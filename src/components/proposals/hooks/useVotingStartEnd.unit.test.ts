import {renderHook} from '@testing-library/react-hooks';
import {
  SnapshotDraftResponseData,
  SnapshotProposalResponseData,
  SnapshotType,
} from '@openlaw/snapshot-js-erc712';

import {ProposalCombined} from '../types';
import {useVotingStartEnd} from '.';

describe('useVotingStartEnd unit tests', () => {
  test('hook returns correct data throughout the voting period', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);

    const {result, waitForNextUpdate} = await renderHook(() =>
      useVotingStartEnd({
        snapshotProposal: {
          msg: {
            payload: {start: nowSeconds + 1, end: nowSeconds + 3},
            type: SnapshotType.proposal,
          },
        },
      } as ProposalCombined<SnapshotProposalResponseData>)
    );

    // Assert initial state
    expect(result.current.hasVotingStarted).toBe(false);
    expect(result.current.hasVotingEnded).toBe(false);

    await waitForNextUpdate();

    // Assert initial state
    expect(result.current.hasVotingStarted).toBe(true);
    expect(result.current.hasVotingEnded).toBe(false);

    await waitForNextUpdate();

    // Assert initial state
    expect(result.current.hasVotingStarted).toBe(true);
    expect(result.current.hasVotingEnded).toBe(true);
  });

  test('should provide "true" if voting already started', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);

    const {result, waitForNextUpdate} = await renderHook(() =>
      useVotingStartEnd({
        snapshotProposal: {
          msg: {
            payload: {start: nowSeconds - 1, end: nowSeconds + 3},
            type: SnapshotType.proposal,
          },
        },
      } as ProposalCombined<SnapshotProposalResponseData>)
    );

    // Assert initial state
    expect(result.current.hasVotingStarted).toBe(false);
    expect(result.current.hasVotingEnded).toBe(false);

    await waitForNextUpdate();

    expect(result.current.hasVotingStarted).toBe(true);
    expect(result.current.hasVotingEnded).toBe(false);
  });

  test('should provide "true" if voting already ended', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);

    const {result, waitForNextUpdate} = await renderHook(() =>
      useVotingStartEnd({
        snapshotProposal: {
          msg: {
            payload: {start: nowSeconds, end: nowSeconds - 1},
            type: SnapshotType.proposal,
          },
        },
      } as ProposalCombined<SnapshotProposalResponseData>)
    );

    // Assert initial state
    expect(result.current.hasVotingStarted).toBe(false);
    expect(result.current.hasVotingEnded).toBe(false);

    await waitForNextUpdate();

    expect(result.current.hasVotingStarted).toBe(true);
    expect(result.current.hasVotingEnded).toBe(false);

    await waitForNextUpdate();

    expect(result.current.hasVotingStarted).toBe(true);
    expect(result.current.hasVotingEnded).toBe(true);
  });

  test('should provide "false" if proposal is a draft', async () => {
    const {result} = await renderHook(() =>
      useVotingStartEnd({
        snapshotProposal: {
          msg: {
            payload: {},
            type: SnapshotType.draft,
          },
        },
      } as ProposalCombined<SnapshotDraftResponseData>)
    );

    // Assert initial state
    expect(result.current.hasVotingStarted).toBe(false);
    expect(result.current.hasVotingEnded).toBe(false);
  });
});
