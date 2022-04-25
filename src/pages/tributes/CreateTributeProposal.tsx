// @ts-nocheck
import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { SnapshotType } from "@openlaw/snapshot-js-erc712";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Contract as Web3Contract } from "web3-eth-contract/types";
import { toBN, AbiItem, toChecksumAddress } from "web3-utils";
import { debounce } from "debounce";

import {
  formatNumber,
  getValidationError,
  normalizeString,
  stripFormatNumber,
  truncateEthAddress,
} from "../../util/helpers";
import { useIsDefaultChain, useWeb3Modal } from "../../components/web3/hooks";
import {
  ContractAdapterNames,
  Web3TxStatus,
} from "../../components/web3/types";
import { FormFieldErrors } from "../../util/enums";
import { isEthAddressValid } from "../../util/validation";
import { AsyncStatus } from "../../util/types";
import { UNITS_ADDRESS } from "../../config";
import { StoreState } from "../../store/types";
import {
  useCheckApplicant,
  useSignAndSubmitProposal,
} from "../../components/proposals/hooks";
import { CycleEllipsis } from "../../components/feedback";
import ErrorMessageWithDetails from "../../components/common/ErrorMessageWithDetails";
import FadeIn from "../../components/common/FadeIn";
import InputError from "../../components/common/InputError";
import Loader from "../../components/feedback/Loader";
import Wrap from "../../components/common/Wrap";

enum Fields {
  applicantAddress = "applicantAddress",
  erc20Address = "erc20Address",
  tributeAmount = "tributeAmount",
  requestAmount = "requestAmount",
  description = "description",
}

type FormInputs = {
  applicantAddress: string;
  erc20Address: string;
  tributeAmount: string;
  requestAmount: string;
  description: string;
};

type SubmitActionArguments = [
  string, // `applicant`
  string, // `tokenToMint`
  string, // `requestAmount`
  string, // `tokenAddr`
  string, // `tributeAmount`
  string // `tributeTokenOwner`
];

type ERC20Details = {
  symbol: string;
  decimals: number;
};

export default function CreateTributeProposal() {
  /**
   * Selectors
   */

  const ERC20ExtensionContract = useSelector(
    (state: StoreState) => state.contracts?.ERC20ExtensionContract
  );

  /**
   * Our hooks
   */

  const { defaultChainError } = useIsDefaultChain();
  const { connected, account, web3Instance } = useWeb3Modal();
  const {
    proposalData,
    proposalSignAndSendError,
    proposalSignAndSendStatus,
    signAndSendProposal,
  } = useSignAndSubmitProposal<SnapshotType.draft>();

  /**
   * Their hooks
   */

  const form = useForm<FormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const history = useHistory();

  /**
   * State
   */

  const [submitError, setSubmitError] = useState<Error>();
  const [userERC20Balance, setUserERC20Balance] = useState<string>();
  const [erc20Details, setERC20Details] = useState<ERC20Details>();
  const [erc20Contract, setERC20Contract] = useState<Web3Contract>();

  /**
   * Variables
   */

  const { errors, getValues, setValue, register, trigger, watch } = form;

  const erc20AddressValue = watch(Fields.erc20Address);

  const applicantAddressValue = watch(Fields.applicantAddress);

  const createTributeError = submitError || proposalSignAndSendError;

  const isConnected = connected && account;

  const isInProcess =
    proposalSignAndSendStatus === Web3TxStatus.AWAITING_CONFIRM ||
    proposalSignAndSendStatus === Web3TxStatus.PENDING;

  const isDone = proposalSignAndSendStatus === Web3TxStatus.FULFILLED;

  const isInProcessOrDone = isInProcess || isDone;

  const {
    checkApplicantError,
    checkApplicantInvalidMsg,
    checkApplicantStatus,
    isApplicantValid,
  } = useCheckApplicant(applicantAddressValue);

  var amountSelected = 1;
  /**
   * Cached callbacks
   */

  const getERC20ContractCached = useCallback(getERC20Contract, [
    erc20AddressValue,
    web3Instance,
  ]);

  const getERC20DetailsCached = useCallback(getERC20Details, [
    account,
    erc20Contract,
  ]);

  const getUserERC20BalanceCached = useCallback(getUserERC20Balance, [
    account,
    erc20Contract,
  ]);

  /**
   * Effects
   */

  useEffect(() => {
    getERC20ContractCached();
  }, [getERC20ContractCached]);

  useEffect(() => {
    getERC20DetailsCached();
  }, [getERC20DetailsCached]);

  useEffect(() => {
    getUserERC20BalanceCached();
  }, [getUserERC20BalanceCached]);

  // Set the value of `applicantAddress` if the `account` changes
  useEffect(() => {
    setValue(Fields.applicantAddress, account);
  }, [account, setValue]);

  /**
   * Functions
   */

  async function getERC20Contract() {
    if (!web3Instance || !erc20AddressValue) {
      setERC20Contract(undefined);
      return;
    }

    try {
      const { default: lazyERC20ABI } = await import(
        "../../abis/external/ERC20.json"
      );
      const erc20Contract: AbiItem[] = lazyERC20ABI as any;
      const instance = new web3Instance.eth.Contract(
        erc20Contract,
        erc20AddressValue
      );
      setERC20Contract(instance);
    } catch (error) {
      console.error(error);
      setERC20Contract(undefined);
    }
  }

  async function getERC20Details() {
    if (!account || !erc20Contract) {
      setERC20Details(undefined);
      return;
    }

    try {
      const symbol = await erc20Contract.methods.symbol().call();
      const decimals = await erc20Contract.methods.decimals().call();
      setERC20Details({ symbol, decimals: Number(decimals) });
    } catch (error) {
      console.error(error);
      setERC20Details(undefined);
    }
  }

  async function getUserERC20Balance() {
    if (!account || !erc20Contract) {
      setUserERC20Balance(undefined);
      return;
    }

    try {
      const balance = await erc20Contract.methods.balanceOf(account).call();
      const balanceBN = toBN(balance);
      const decimals = await erc20Contract.methods.decimals().call();
      const divisor = toBN(10).pow(toBN(decimals));
      const beforeDecimal = balanceBN.div(divisor);
      const afterDecimal = balanceBN.mod(divisor);
      const balanceReadable = afterDecimal.eq(toBN(0))
        ? beforeDecimal.toString()
        : `${beforeDecimal.toString()}.${afterDecimal.toString()}`;

      setUserERC20Balance(balanceReadable);
    } catch (error) {
      console.error(error);
      setUserERC20Balance(undefined);
    }
  }

  async function getRequestAmountUnit() {
    if (!ERC20ExtensionContract) {
      return "UNITS";
    } else {
      try {
        return await ERC20ExtensionContract.instance.methods.symbol().call();
      } catch (error) {
        console.log(error);
        return "UNITS";
      }
    }
  }

  async function handleSubmit(values: FormInputs) {
    try {
      if (!isConnected) {
        throw new Error(
          "No user account was found. Please make sure your wallet is connected."
        );
      }

      if (!account) {
        throw new Error("No account found.");
      }

      if (!erc20Contract) {
        throw new Error("No ERC20Contract found.");
      }

      if (!erc20Details) {
        throw new Error("No ERC20 details found.");
      }

      if (checkApplicantError) {
        // Just log the error (don't throw) because it is not a blocker for the
        // snapshot draft to be submitted. The applicant address validity will
        // be checked again when the proposal is submitted onchain.
        console.warn(
          `Error checking if the applicant address is valid: ${checkApplicantError.message}`
        );
      }

      if (
        checkApplicantStatus === AsyncStatus.FULFILLED &&
        !isApplicantValid &&
        checkApplicantInvalidMsg
      ) {
        throw new Error(checkApplicantInvalidMsg);
      }

      const {
        applicantAddress,
        erc20Address,
        tributeAmount,
        requestAmount,
        description,
      } = values;
      const multiplier = toBN(10).pow(toBN(erc20Details.decimals));
      const tributeAmountWithDecimals = toBN(
        stripFormatNumber(tributeAmount)
      ).mul(multiplier);
      const requestAmountArg = stripFormatNumber(requestAmount);
      const applicantAddressToChecksum = toChecksumAddress(applicantAddress);
      const proposerAddressToChecksum = toChecksumAddress(account);

      // Maybe set proposal ID from previous attempt
      let proposalId: string = proposalData?.uniqueId || "";

      // Only submit to snapshot if there is not already a proposal ID returned from a previous attempt.
      if (!proposalId) {
        const bodyIntro =
          normalizeString(applicantAddress) === normalizeString(account)
            ? `Tribute from ${truncateEthAddress(
                applicantAddressToChecksum,
                7
              )}.`
            : `Tribute from ${truncateEthAddress(
                proposerAddressToChecksum,
                7
              )} for applicant ${truncateEthAddress(
                applicantAddressToChecksum,
                7
              )}.`;
        const body = description ? `${bodyIntro}\n${description}` : bodyIntro;

        // Values needed to display relevant proposal amounts in the proposal
        // details page are set in the snapshot draft metadata. (We can no
        // longer rely on getting this data from onchain because the proposal
        // may not exist there yet.)
        const proposalAmountValues = {
          requestAmount,
          requestAmountUnit: await getRequestAmountUnit(),
          tributeAmount,
          tributeAmountUnit: erc20Details.symbol,
        };

        // Arguments needed to submit the proposal onchain are set in the
        // snapshot draft metadata.
        const submitActionArgs: SubmitActionArguments = [
          applicantAddressToChecksum,
          UNITS_ADDRESS,
          requestAmountArg,
          toChecksumAddress(erc20Address),
          tributeAmountWithDecimals.toString(),
          proposerAddressToChecksum,
        ];

        // Sign and submit draft for snapshot-hub
        const { uniqueId } = await signAndSendProposal({
          partialProposalData: {
            name: applicantAddressToChecksum,
            body,
            metadata: {
              proposalAmountValues,
              submitActionArgs,
              accountAuthorizedToProcessPassedProposal: proposerAddressToChecksum,
            },
          },
          adapterName: ContractAdapterNames.tribute,
          type: SnapshotType.draft,
        });

        proposalId = uniqueId;
      }

      // go to TributeDetails page for newly created tribute proposal
      history.push(`/tributes/${proposalId}`);
    } catch (error) {
      // Set any errors from Web3 utils or explicitly set above.
      const e = error as Error;

      setSubmitError(e);
    }
  }

  function renderSubmitStatus(): React.ReactNode {
    switch (proposalSignAndSendStatus) {
      case Web3TxStatus.AWAITING_CONFIRM:
        return (
          <>
            Awaiting your confirmation
            <CycleEllipsis intervalMs={500} />
          </>
        );
      case Web3TxStatus.PENDING:
        return (
          <>
            Submitting
            <CycleEllipsis intervalMs={500} />
          </>
        );
      case Web3TxStatus.FULFILLED:
        return "Done!";
      default:
        return "";
    }
  }

  function renderUserERC20Balance() {
    if (!userERC20Balance) {
      return "---";
    }

    return formatNumber(userERC20Balance);
  }

  function getUnauthorizedMessage() {
    // user is not connected
    if (!isConnected) {
      return "Connect your wallet to submit a tribute proposal.";
    }

    // user is on wrong network
    if (defaultChainError) {
      return defaultChainError.message;
    }
  }

  /**
   * Render
   */

  // Render unauthorized message
  if (!isConnected || defaultChainError) {
    return (
      <RenderWrapper>
        <div className="form__description--unauthorized">
          <p>{getUnauthorizedMessage()}</p>
        </div>
      </RenderWrapper>
    );
  }

  return (
    <RenderWrapper>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {/* APPLICANT ADDRESS */}
        <div className="form__input-row">
          <label className="form__input-row-label">Applicant Address</label>
          <div className="form__input-row-fieldwrap">
            {/* @note We don't need the default value as it's handled in the useEffect above. */}
            <input
              aria-describedby={`error-${Fields.applicantAddress}`}
              aria-invalid={errors.applicantAddress ? "true" : "false"}
              name={Fields.applicantAddress}
              ref={register({
                validate: (applicantAddress: string): string | boolean => {
                  return !applicantAddress
                    ? FormFieldErrors.REQUIRED
                    : !isEthAddressValid(applicantAddress)
                    ? FormFieldErrors.INVALID_ETHEREUM_ADDRESS
                    : true;
                },
              })}
              type="text"
              disabled={isInProcessOrDone}
            />

            <InputError
              error={getValidationError(Fields.applicantAddress, errors)}
              id={`error-${Fields.applicantAddress}`}
            />
          </div>
        </div>

        {/* ERC20 ADDRESS */}
        <div className="form__input-row" style={{visibility: 'hidden', height: '0rem', margin: '0rem'}}>
          <label className="form__input-row-label">ERC20 Address</label>
          <div className="form__input-row-fieldwrap">
            <input

              aria-describedby={`error-${Fields.erc20Address}`}
              aria-invalid={errors.erc20Address ? "true" : "false"}
              name={Fields.erc20Address}
              ref={register({
                validate: (erc20Address: string): string | boolean => {
                  return !erc20Address
                    ? FormFieldErrors.REQUIRED
                    : !isEthAddressValid(erc20Address)
                    ? FormFieldErrors.INVALID_ETHEREUM_ADDRESS
                    : true;
                },
              })}
              type="text"
              disabled={isInProcessOrDone}
              defaultValue="0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b"
            />

            <InputError
              error={getValidationError(Fields.erc20Address, errors)}
              id={`error-${Fields.erc20Address}`}
            />
          </div>
        </div>

        <div className="form__input-row formbuilder-radio-group form-group form__input-row field-type_of_entity">
          <label className="formbuilder-radio-group-label form__input-row-label">
            Amount
          </label>
          <div style={{width: '100%'}} className="bootstrap-wrapper">
            <div className="row" style={{display: 'flex', alignItems: 'center'}}>
              <div className="col-md-8">
                <input type="range" defaultValue="1" id="points" onChange={amountChange} name="points" min="1" max="10" />
              </div>
              <div className="col-md-4">
              <span id="aVal">1%</span>
              </div>
            </div>
          </div>
        </div>


        {/* TRIBUTE AMOUNT */}
        <div className="form__input-row">
          <label className="form__input-row-label"></label>
          <div className="form__input-row-fieldwrap--narrow">
            <div className="input__suffix-wrap">
              <input
                id="salonAmount"
                readonly="true"
                defaultValue="1"
                className="input__suffix"
                aria-describedby={`error-${Fields.tributeAmount}`}
                aria-invalid={errors.tributeAmount ? "true" : "false"}
                name={Fields.tributeAmount}
                onChange={debounce(
                  () =>
                    setValue(
                      Fields.tributeAmount,
                      formatNumber(stripFormatNumber(getValues().tributeAmount))
                    ),
                  1000
                )}
                ref={register({
                  validate: (tributeAmount: string): string | boolean => {
                    const amount = Number(stripFormatNumber(tributeAmount));

                    return tributeAmount === ""
                      ? FormFieldErrors.REQUIRED
                      : isNaN(amount)
                      ? FormFieldErrors.INVALID_NUMBER
                      : amount <= 0
                      ? "The value must be greater than 0."
                      : amount > Number(userERC20Balance)
                      ? "Insufficient funds."
                      : !Number.isInteger(amount)
                      ? "The value must be an integer for an ERC20 token."
                      : true;
                  },
                })}
                type="text"
                disabled={true}
                  style={{backgroundColor: '#f7fafd'}}
              />

              <div style={{width: '5rem', backgroundColor: '#f7fafd'}} className="input__suffix-item">
                {erc20Details?.symbol || "___"}
              </div>
            </div>

            <InputError
              error={getValidationError(Fields.tributeAmount, errors)}
              id={`error-${Fields.tributeAmount}`}
            />

            <div className="form__input-description">
              This amount will be held in escrow pending a member vote. If the
              proposal passes, the funds will automatically be sent to the DAO.
              If the proposal fails, the funds will be refunded to you.
            </div>
          </div>

          <div className="form__input-addon">
            available: <span>{renderUserERC20Balance()}</span>
          </div>
        </div>

        {/* REQUEST AMOUNT */}
        <div className="form__input-row">
          <label className="form__input-row-label"></label>
          <div className="form__input-row-fieldwrap--narrow">
            <input
              id="reqAmount"
              aria-describedby={`error-${Fields.requestAmount}`}
              aria-invalid={errors.requestAmount ? "true" : "false"}
              name={Fields.requestAmount}
              onChange={debounce(
                () =>
                  setValue(
                    Fields.requestAmount,
                    formatNumber(stripFormatNumber(getValues().requestAmount))
                  ),
                1000
              )}
              ref={register({
                validate: (requestAmount: string): string | boolean => {
                  const amount = Number(stripFormatNumber(requestAmount));

                  return requestAmount === ""
                    ? FormFieldErrors.REQUIRED
                    : isNaN(amount)
                    ? FormFieldErrors.INVALID_NUMBER
                    : amount < 0
                    ? "The value must be at least 0."
                    : !Number.isInteger(amount)
                    ? "The value must be an integer."
                    : true;
                },
              })}
              type="text"
                readonly="true"
              disabled={true}
              defaultValue="3"
              style={{backgroundColor: '#f7fafd'}}
            />

            <InputError
              error={getValidationError(Fields.requestAmount, errors)}
              id={`error-${Fields.requestAmount}`}
            />

            <div className="form__input-description">
              This is the amount of DAO membership tokens you are requesting be
              sent to the Applicant Address in exchange for your tribute.
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={{marginBottom: '0', display:'none'}} className="form__textarea-row">
          <label className="form__input-row-label">Description</label>
          <div className="form__input-row-fieldwrap">
            <textarea
              name={Fields.description}
              placeholder="Say something about your tribute..."
              ref={register}
              disabled={isInProcessOrDone}
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
        style={{visibility: 'hidden', height: '0', margin: '0', padding: '0'}}
          id="submitBtn"
          className="button"
          disabled={isInProcessOrDone}
          onClick={async () => {
            if (isInProcessOrDone) return;

            if (!(await trigger())) {
              return;
            }

            handleSubmit(getValues());
          }}
          type="submit"
        >
          {isInProcess ? <Loader /> : isDone ? "Done" : "Submit"}
        </button>

        {/* SUBMIT STATUS */}
        {isInProcessOrDone && (
          <div className="form__submit-status-container">
            {renderSubmitStatus()}
          </div>
        )}

        {/* SUBMIT ERROR */}
        {createTributeError && (
          <div className="form__submit-error-container">
            <ErrorMessageWithDetails
              renderText="Something went wrong while submitting the proposal."
              error={createTributeError}
            />
          </div>
        )}
      </form>

      <form
        id="kycSubmit"
        style={{ width: "100%", margin: '0' }}
        action="https://getform.io/f/9ddb7b44-927e-475f-bf03-6e92cd6c71a8"
        method="POST"
        className="form"
        onSubmit={kycSubmit}
      >


        <div className="rendered-form">




          <div style={{marginTop: '1rem'}} className="form__input-row formbuilder-radio-group form-group form__input-row field-type_of_entity">
            <label
              htmlFor="type_of_entity"
              className="formbuilder-radio-group-label form__input-row-label"
            >
              Type of Entity
            </label>
            <div className="radio-group">
              <div className="formbuilder-radio">
                <input
                  name="type_of_entity"
                  id="type_of_entity-0"
                  aria-required="true"
                  value="person"
                  type="radio"
                />
                <label htmlFor="type_of_entity-0">Person</label>
              </div>
              <div className="formbuilder-radio">
                <input
                  name="type_of_entity"
                  id="type_of_entity-1"
                  aria-required="true"
                  value="company"
                  type="radio"
                />
                <label htmlFor="type_of_entity-1">Company</label>
              </div>
              <div className="formbuilder-radio">
                <input
                  name="type_of_entity"
                  id="type_of_entity-2"
                  aria-required="true"
                  value="trust"
                  type="radio"
                />
                <label htmlFor="type_of_entity-2">Trust</label>
              </div>
            </div>
          </div>
          <div className="form__input-row formbuilder-text form-group form__input-row field-legal_name_of_person">
            <label
              htmlFor="legal_name_of_person"
              className="formbuilder-text-label form__input-row-label"
            >
              Legal Name of Person

            </label>
            <input
              type="text"
              name="legal_name_of_person"
              id="legal_name_of_person"
              aria-required="true"
            />
          </div>
          <div className="formbuilder-text form-group form__input-row field-email_address">
            <label
              htmlFor="email_address"
              className="formbuilder-text-label form__input-row-label"
            >
              Email Address
            </label>
            <input
              type="text"
              name="email_address"
              id="email_address"
              aria-required="true"
            />
          </div>
          <div className="formbuilder-text form-group form__input-row field-text-1650421756581">
            <label
              htmlFor="text-1650421756581"
              className="formbuilder-text-label form__input-row-label"
            >
              Home Address
            </label>
            <input
              type="text"
              className="form-control"
              name="text-1650421756581"
              id="text-1650421756581"
              aria-required="true"
            />
          </div>

          <div className="formbuilder-select form-group form__input-row field-select-1650421785515">
            <label
              htmlFor="text-1650421756581"
              className="formbuilder-text-label form__input-row-label"
            >
              Date of Birth
            </label>

            <div style={{width: '100%'}} className="bootstrap-wrapper">
              <div className="row">
                <div className="col-md-4">
                  <select
                    className="form-control"
                    name="select-1650421785515"
                    id="select-1650421785515"
                    aria-required="true"
                  >
                    <option value="01"  id="select-1650421785515-0">
                      01
                    </option>
                    <option value="02" id="select-1650421785515-1">
                      02
                    </option>
                    <option value="03" id="select-1650421785515-2">
                      03
                    </option>
                  </select>
                </div>
                <div
                  className="hidden-md-up col-12"
                  style={{ height: "1rem" }}
                ></div>
                <div className="col-md-4">
                  <select name="day" id="day" required aria-required="true">
                    <option value="01"  id="day-0">
                      01
                    </option>
                    <option value="02" id="day-1">
                      02
                    </option>
                    <option value="03" id="day-2">
                      03
                    </option>
                  </select>
                </div>
                <div
                  className="hidden-md-up col-12"
                  style={{ height: "1rem" }}
                ></div>
                <div className="col-md-4">
                  <select name="year" id="year" aria-required="true">
                    <option value="2000"  id="year-0">
                      2000
                    </option>
                    <option value="2001" id="year-1">
                      2001
                    </option>
                    <option value="2003" id="year-2">
                      2003
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="formbuilder-file form-group form__input-row field-id_scan" style={{display: 'block'}}>
            <p><label
              htmlFor="id_scan"
              className="formbuilder-file-label"
            >
              ID Scan
            </label></p>
            <p>A passport is highly recommended but other forms of government–issued color photo ID (such as a national identity card or driver’s license) are also acceptable.</p>
            <p>
            <input
              type="file"
              name="id_scan"
              id="id_scan"
              aria-required="true"
            />
            </p>
          </div>
          <div className="formbuilder-file form-group form__input-row field-back_of_id_scan"   style={{display: 'block'}}>
            <p><label
              htmlFor="back_of_id_scan"
              className="formbuilder-file-label form__input-row-label"

            >
              Back of ID Scan (Optional)
            </label></p>
            <p>Not required if you uploaded a passport above.</p>
            <p>
            <input
              type="file"
              name="back_of_id_scan"
              id="back_of_id_scan"
            /></p>
          </div>
          <div className="formbuilder-text form-group form__input-row field-passport_or_id_number">
            <label
              htmlFor="passport_or_id_number"
              className="formbuilder-text-label form__input-row-label"
            >
              Passport or ID Number

            </label>
            <input
              type="text"
              name="passport_or_id_number"
              id="passport_or_id_number"
              aria-required="true"
            />
          </div>
          <div className="formbuilder-text form-group form__input-row field-Phone-Number">
            <label
              htmlFor="Phone-Number"
              className="formbuilder-text-label form__input-row-label"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="Phone-Number"
              id="Phone-Number"
              aria-required="true"
            />
          </div>
          <div className="formbuilder-text form-group form__input-row field-occupation">
            <label
              htmlFor="occupation"
              className="formbuilder-text-label form__input-row-label"
            >
              Occupation
            </label>
            <input
              type="text"
              className="form-control"
              name="occupation"
              id="occupation"
              aria-required="true"
            />
          </div>
          <h3>How are you accredited?</h3>

          <div className="formbuilder-radio-group form-group form__input-row field-basis_of_accreditation">
            <label
              htmlFor="basis_of_accreditation"
              className="formbuilder-radio-group-label form__input-row-label"
            >
              Basis of Accreditation

            </label>
            <div className="radio-group">
              <div className="formbuilder-radio">
                <input
                  name="basis_of_accreditation"
                  id="basis_of_accreditation-0"
                  aria-required="true"
                  value="income"
                  type="radio"
                />
                <label htmlFor="basis_of_accreditation-0">
                  Income of $200k ($300K with spouse) in each of the last 2
                  years
                </label>
              </div>
              <div className="formbuilder-radio">
                <input
                  name="basis_of_accreditation"
                  id="basis_of_accreditation-1"
                  aria-required="true"
                  value="net-worth"
                  type="radio"
                />
                <label htmlFor="basis_of_accreditation-1">
                  Net worth over $1M
                </label>
              </div>
            </div>
          </div>

          <h3>Your income in the most recent tax year</h3>
          <div className="formbuilder-text form-group form__input-row field-income_recent">
            <label
              htmlFor="income_recent"
              className="formbuilder-text-label form__input-row-label"
            >
              Income
            </label>
            <input
              type="text"
              name="income_recent"
              id="income_recent"
              aria-required="true"
            />
          </div>
          <div className="formbuilder-file form-group form__input-row field-income_recent_documentation" style={{display: 'block'}}>
<p>
            <label
              htmlFor="income_recent_documentation"
              className="formbuilder-file-label form__input-row-label"
            >
              Documentation
            </label>
            </p>
            <p>Government tax filings, pay stubs, or a letter from your attorney, accountant, or investment advisor written in the last 90 days (upload pdf, docx).</p>
            <p>
            <input
              type="file"
              name="income_recent_documentation"
              id="income_recent_documentation"
              aria-required="true"
            /></p>
          </div>

          <h3>Your income in the previous tax year</h3>

          <div className="formbuilder-text form-group form__input-row field-income_last">
            <label
              htmlFor="income_last"
              className="formbuilder-text-label form__input-row-label"
            >
              Income
            </label>
            <input
              type="text"
              name="income_last"
              id="income_last"
              aria-required="true"
            />
          </div>
          <div className="formbuilder-file form-group form__input-row field-income_last_documentation" style={{display: 'block'}}>
            <p><label
              htmlFor="income_last_documentation"
              className="formbuilder-file-label form__input-row-label"
            >
              Documenation
            </label></p>
            <p>Government tax filings, pay stubs, or a letter from your attorney, accountant, or investment advisor written in the last 90 days (upload pdf, docx).</p>
            <p><input
              type="file"
              name="income_last_documentation"
              id="income_last_documentation"
              aria-required="true"
            /></p>
          </div>
          <div className="formbuilder-checkbox-group form-group form__input-row field-current_year_income">
            <label
              htmlFor="current_year_income"
              className="formbuilder-checkbox-group-label form__input-row-label"
            >
              Current Year Income

            </label>
            <div className="checkbox-group">
              <div className="formbuilder-checkbox">
                <input
                  name="current_year_income[]"
                  id="current_year_income-0"
                  aria-required="true"
                  value="true"
                  type="checkbox"

                />
                <label htmlFor="current_year_income-0">
                  I expect to earn an income of at least $200k ($300k with
                  spouse) again this year.{" "}
                </label>
              </div>
            </div>
          </div>
        </div>

        <input type="hidden" name="_captcha" value="false" />
        <button   id="kycSubmitBtn"
          className="button" type="submit">{isInProcess ? <Loader /> : isDone ? "Done" : "Submit"}</button>
      </form>

    </RenderWrapper>
  );
}

function amountChange(e: any){
    document.getElementById('aVal').innerHTML = e.target.value + ' %';
    document.getElementById('salonAmount').value = e.target.value;
    document.getElementById('reqAmount').value = e.target.value * 3;
    document.getElementById('salonAmount').click();
    debounce(
      () =>
        setValue(
          Fields.tributeAmount,
          formatNumber(stripFormatNumber(getValues().tributeAmount))
        ),
      1000
    )
}

async function kycSubmit(e: any) {
  e.preventDefault();
  var formEl = document.forms.kycSubmit;
  var formData = new FormData(formEl);
  var res = await fetch("https://salontest-terrifickid.cloud.okteto.net", {
    method: "POST",
    body: formData,
  });
  console.log(res);
  document.getElementById("submitBtn").click();
}

function RenderWrapper(props: React.PropsWithChildren<any>): JSX.Element {
  /**
   * Render
   */

  return (
    <Wrap className="section-wrapper">
      <FadeIn>
        <div className="titlebar">
          <h2 className="titlebar__title">Become a Member</h2>
        </div>

        <div className="form-wrapper">
          <div className="form__description">
            <p>For U.S. accredited investors</p>
            <p>
              Salon is a for-profit member-managed limited liability company
              organized in Delaware.{" "}
            </p>
            <p>
              Salon will have up to 100 initial members who will pool their
              capital to build a world class collection of contemporary art.
              Each member can purchase 1% blocks of Salon units for $30,000 (up
              to 10% for $300,000).
            </p>
            <p>Interested? Get accredited below.</p>
          </div>



          {/* RENDER CHILDREN */}
          {props.children}
        </div>
      </FadeIn>
    </Wrap>
  );
}
