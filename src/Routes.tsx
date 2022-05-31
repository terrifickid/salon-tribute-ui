import { Route, Switch, HashRouter } from "react-router-dom";

import { ENABLE_KYC_ONBOARDING } from "./config";
// import AdapterOrExtensionManager from './components/adapters-extensions/AdapterOrExtensionManager';
import CreateGovernanceProposal from "./pages/governance/CreateGovernanceProposal";
import CreateOnboardingProposal from "./pages/onboarding/CreateOnboardingProposal";
import CreateTransferProposal from "./pages/transfers/CreateTransferProposal";
import CreateTributeProposal from "./pages/tributes/CreateTributeProposal";
import GetStarted from "./pages/start/GetStarted";
import GovernanceProposalDetails from "./pages/governance/GovernanceProposalDetails";
import GovernanceProposals from "./pages/governance/GovernanceProposals";
import KycOnboardingForm from "./pages/kyc-onboarding/KycOnboardingForm";
import MemberProfile from "./pages/members/MemberProfile";
import Members from "./pages/members/Members";
import Onboarding from "./pages/onboarding/Onboarding";
import OnboardingDetails from "./pages/onboarding/OnboardingDetails";
import NotFound from "./pages/subpages/NotFound";
import Redeem from "./pages/redeem/Redeem";
import TransferDetails from "./pages/transfers/TransferDetails";
import Transfers from "./pages/transfers/Transfers";
import TributeDetails from "./pages/tributes/TributeDetails";
import Tributes from "./pages/tributes/Tributes";

import KycOnboard from "./pages/custom/KycOnboard";

import Header from "./components/Header";
import Footer from "./components/Footer";

const proposalIdParameter: string = ":proposalId";

export default function Routes() {
  return (
    <HashRouter>
      {[
        // Index page
        <Route key="splash" exact path="/" render={() => <GetStarted />} />,
        ENABLE_KYC_ONBOARDING && (
          <Route
            key="join"
            exact
            path="/join"
            render={() => <KycOnboardingForm />}
          />
        ),
        <Route
          key="onboard"
          exact
          path="/onboard"
          render={() => <CreateOnboardingProposal />}
        />,
        <Route
          key="kyc"
          exact
          path="/kyc"
          render={() => (
            <>
              <Header />
              <KycOnboard />
              <Footer />
            </>
          )}
        />,
        <Route
          key="onboarding"
          exact
          path="/onboarding"
          render={() => <Onboarding />}
        />,
        <Route
          key="onboarding-details"
          exact
          path={`/onboarding/${proposalIdParameter}`}
          render={() => <OnboardingDetails />}
        />,
        <Route
          key="transfer"
          exact
          path="/transfer"
          render={() => (
            <>
              <Header />
              <CreateTransferProposal />
              <Footer />
            </>
          )}
        />,
        <Route
          key="transfers"
          exact
          path="/transfers"
          render={() => (
            <>
              <Header />
              <Transfers />
              <Footer />
            </>
          )}
        />,
        <Route
          key="transfer-details"
          exact
          path={`/transfers/${proposalIdParameter}`}
          render={() => (
            <>
              <Header />
              <TransferDetails />
              <Footer />
            </>
          )}
        />,
        <Route
          key="tribute"
          exact
          path="/tribute"
          render={() => (
            <>
              <Header />
              <CreateTributeProposal />
              <Footer />
            </>
          )}
        />,
        <Route
          key="tributes"
          exact
          path="/tributes"
          render={() => (
            <>
              <Header />
              <Tributes />
              <Footer />
            </>
          )}
        />,
        <Route
          key="tribute-details"
          exact
          path={`/tributes/${proposalIdParameter}`}
          render={() => (
            <>
              <Header />
              <TributeDetails />
              <Footer />
            </>
          )}
        />,
        <Route
          key="governance-proposal"
          exact
          path="/governance-proposal"
          render={() => (
            <>
              <Header />
              <CreateGovernanceProposal />
              <Footer />
            </>
          )}
        />,
        <Route
          key="governance-proposals"
          exact
          path="/governance"
          render={() => (
            <>
              <Header />
              <GovernanceProposals />
              <Footer />
            </>
          )}
        />,
        <Route
          key="governance-proposal-details"
          exact
          path={`/governance/${proposalIdParameter}`}
          render={() => (
            <>
              <Header />
              <GovernanceProposalDetails />
              <Footer />
            </>
          )}
        />,
        <Route
          key="members"
          exact
          path="/members"
          render={() => (
            <>
              <Header />
              <Members />
              <Footer />
            </>
          )}
        />,
        <Route
          key="member-profile"
          exact
          path="/members/:ethereumAddress"
          render={() => (
            <>
              <Header />
              <MemberProfile />
              <Footer />
            </>
          )}
        />,
        // @note Disabling DAO Manager for now because we paused on maintaining
        // it.
        // <Route
        //   key="dao-manager"
        //   exact
        //   path="/dao-manager"
        //   render={() => <AdapterOrExtensionManager />}
        // />,
        <Route key="redeem" exact path="/redeem" render={() => <Redeem />} />,
        // 404 component (note: does not redirect to a route to maintain original path)
      ]}
    </HashRouter>
  );
}
