// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title MergePact — public Testnet work commitments for GitHub issues
contract MergePact is ReentrancyGuard {
    enum PactState {
        Open,
        Claimed,
        Submitted,
        Released,
        Cancelled,
        Reclaimed
    }

    struct Pact {
        address maintainer;
        address contributor;
        uint96 bountyWei;
        uint40 claimDeadline;
        uint40 workDeadline;
        PactState state;
        string issueUrl;
        string acceptance;
        string proofUrl;
    }

    uint256 internal constant MAX_ISSUE_URL_BYTES = 180;
    uint256 internal constant MAX_ACCEPTANCE_BYTES = 140;
    uint256 internal constant MAX_PROOF_URL_BYTES = 220;

    error PactNotFound();
    error ZeroBounty();
    error EmptyIssueUrl();
    error EmptyAcceptance();
    error EmptyProofUrl();
    error FieldTooLong();
    error InvalidDeadline();
    error InvalidPactState();
    error DeadlineExpired();
    error DeadlineNotReached();
    error MaintainerCannotClaim();
    error NotMaintainer();
    error NotContributor();
    error DirectTransferDisabled();
    error TransferFailed();

    event PactCreated(
        uint256 indexed pactId,
        address indexed maintainer,
        uint256 bountyWei,
        uint40 claimDeadline,
        uint40 workDeadline,
        string issueUrl,
        string acceptance
    );
    event PactClaimed(uint256 indexed pactId, address indexed contributor);
    event ProofSubmitted(uint256 indexed pactId, address indexed contributor, string proofUrl);
    event PactReleased(uint256 indexed pactId, address indexed contributor, uint256 bountyWei);
    event PactCancelled(uint256 indexed pactId, address indexed maintainer, uint256 bountyWei);
    event PactReclaimed(uint256 indexed pactId, address indexed maintainer, uint256 bountyWei);

    Pact[] internal pacts;

    function createPact(
        string calldata issueUrl,
        string calldata acceptance,
        uint40 claimDeadline,
        uint40 workDeadline
    ) external payable returns (uint256 pactId) {
        if (msg.value == 0) revert ZeroBounty();
        _validateCreateFields(issueUrl, acceptance, claimDeadline, workDeadline);

        pactId = pacts.length;
        pacts.push(
            Pact({
                maintainer: msg.sender,
                contributor: address(0),
                bountyWei: uint96(msg.value),
                claimDeadline: claimDeadline,
                workDeadline: workDeadline,
                state: PactState.Open,
                issueUrl: issueUrl,
                acceptance: acceptance,
                proofUrl: ""
            })
        );

        emit PactCreated(pactId, msg.sender, msg.value, claimDeadline, workDeadline, issueUrl, acceptance);
    }

    function claimPact(uint256 pactId) external {
        Pact storage pact = _getPact(pactId);
        if (pact.state != PactState.Open) revert InvalidPactState();
        if (block.timestamp >= pact.claimDeadline) revert DeadlineExpired();
        if (msg.sender == pact.maintainer) revert MaintainerCannotClaim();

        pact.contributor = msg.sender;
        pact.state = PactState.Claimed;

        emit PactClaimed(pactId, msg.sender);
    }

    function submitProof(uint256 pactId, string calldata proofUrl) external {
        Pact storage pact = _getPact(pactId);
        if (pact.state != PactState.Claimed) revert InvalidPactState();
        if (msg.sender != pact.contributor) revert NotContributor();
        if (block.timestamp >= pact.workDeadline) revert DeadlineExpired();
        if (bytes(proofUrl).length == 0) revert EmptyProofUrl();
        if (bytes(proofUrl).length > MAX_PROOF_URL_BYTES) revert FieldTooLong();

        pact.proofUrl = proofUrl;
        pact.state = PactState.Submitted;

        emit ProofSubmitted(pactId, msg.sender, proofUrl);
    }

    function approveAndRelease(uint256 pactId) external nonReentrant {
        Pact storage pact = _getPact(pactId);
        if (pact.state != PactState.Submitted) revert InvalidPactState();
        if (msg.sender != pact.maintainer) revert NotMaintainer();

        uint256 amount = pact.bountyWei;
        address contributor = pact.contributor;
        pact.state = PactState.Released;

        (bool ok,) = contributor.call{ value: amount }("");
        if (!ok) revert TransferFailed();

        emit PactReleased(pactId, contributor, amount);
    }

    function cancelPact(uint256 pactId) external nonReentrant {
        Pact storage pact = _getPact(pactId);
        if (pact.state != PactState.Open) revert InvalidPactState();
        if (msg.sender != pact.maintainer) revert NotMaintainer();

        uint256 amount = pact.bountyWei;
        pact.state = PactState.Cancelled;

        (bool ok,) = msg.sender.call{ value: amount }("");
        if (!ok) revert TransferFailed();

        emit PactCancelled(pactId, msg.sender, amount);
    }

    function reclaimUnclaimed(uint256 pactId) external nonReentrant {
        Pact storage pact = _getPact(pactId);
        if (pact.state != PactState.Open) revert InvalidPactState();
        if (msg.sender != pact.maintainer) revert NotMaintainer();
        if (block.timestamp < pact.claimDeadline) revert DeadlineNotReached();

        uint256 amount = pact.bountyWei;
        pact.state = PactState.Reclaimed;

        (bool ok,) = msg.sender.call{ value: amount }("");
        if (!ok) revert TransferFailed();

        emit PactReclaimed(pactId, msg.sender, amount);
    }

    function reclaimUnsubmitted(uint256 pactId) external nonReentrant {
        Pact storage pact = _getPact(pactId);
        if (pact.state != PactState.Claimed) revert InvalidPactState();
        if (msg.sender != pact.maintainer) revert NotMaintainer();
        if (block.timestamp < pact.workDeadline) revert DeadlineNotReached();

        uint256 amount = pact.bountyWei;
        pact.state = PactState.Reclaimed;

        (bool ok,) = msg.sender.call{ value: amount }("");
        if (!ok) revert TransferFailed();

        emit PactReclaimed(pactId, msg.sender, amount);
    }

    function getPact(uint256 pactId) external view returns (Pact memory) {
        return _getPact(pactId);
    }

    function totalPacts() external view returns (uint256) {
        return pacts.length;
    }

    receive() external payable {
        revert DirectTransferDisabled();
    }

    fallback() external payable {
        revert DirectTransferDisabled();
    }

    function _getPact(uint256 pactId) internal view returns (Pact storage pact) {
        if (pactId >= pacts.length) revert PactNotFound();
        pact = pacts[pactId];
    }

    function _validateCreateFields(
        string calldata issueUrl,
        string calldata acceptance,
        uint40 claimDeadline,
        uint40 workDeadline
    ) internal view {
        if (bytes(issueUrl).length == 0) revert EmptyIssueUrl();
        if (bytes(acceptance).length == 0) revert EmptyAcceptance();
        if (bytes(issueUrl).length > MAX_ISSUE_URL_BYTES) revert FieldTooLong();
        if (bytes(acceptance).length > MAX_ACCEPTANCE_BYTES) revert FieldTooLong();
        if (claimDeadline <= block.timestamp) revert InvalidDeadline();
        if (workDeadline <= claimDeadline) revert InvalidDeadline();
    }
}
