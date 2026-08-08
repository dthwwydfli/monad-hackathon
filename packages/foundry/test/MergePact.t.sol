// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { MergePact } from "../contracts/MergePact.sol";

contract MergePactTest is Test {
    MergePact internal mergePact;
    address internal maintainer = address(0xA11CE);
    address internal contributorA = address(0xB0B);
    address internal contributorB = address(0xCAFE);

    uint40 internal claimDeadline;
    uint40 internal workDeadline;

    function setUp() public {
        mergePact = new MergePact();
        claimDeadline = uint40(block.timestamp + 1 hours);
        workDeadline = uint40(block.timestamp + 2 hours);
        vm.deal(maintainer, 10 ether);
        vm.deal(contributorA, 1 ether);
        vm.deal(contributorB, 1 ether);
    }

    function _createPact() internal returns (uint256) {
        vm.prank(maintainer);
        return mergePact.createPact{ value: 0.5 ether }(
            "https://github.com/org/repo/issues/42",
            "Show confirmed receipt state after a contract write.",
            claimDeadline,
            workDeadline
        );
    }

    function testCreateFundedPact() public {
        vm.expectEmit(true, true, false, true);
        emit MergePact.PactCreated(
            0,
            maintainer,
            0.5 ether,
            claimDeadline,
            workDeadline,
            "https://github.com/org/repo/issues/42",
            "Show confirmed receipt state after a contract write."
        );

        uint256 pactId = _createPact();
        assertEq(pactId, 0);

        MergePact.Pact memory pact = mergePact.getPact(0);
        assertEq(uint256(pact.state), uint256(MergePact.PactState.Open));
        assertEq(pact.maintainer, maintainer);
        assertEq(pact.contributor, address(0));
        assertEq(pact.bountyWei, 0.5 ether);
        assertEq(mergePact.totalPacts(), 1);
    }

    function testZeroBountyBlocked() public {
        vm.prank(maintainer);
        vm.expectRevert(MergePact.ZeroBounty.selector);
        mergePact.createPact("https://github.com/org/repo/issues/1", "Acceptance text here.", claimDeadline, workDeadline);
    }

    function testBadDeadlinesBlocked() public {
        vm.startPrank(maintainer);
        vm.expectRevert(MergePact.InvalidDeadline.selector);
        mergePact.createPact{ value: 0.5 ether }(
            "https://github.com/org/repo/issues/1",
            "Acceptance text here.",
            uint40(block.timestamp - 1),
            workDeadline
        );

        vm.expectRevert(MergePact.InvalidDeadline.selector);
        mergePact.createPact{ value: 0.5 ether }(
            "https://github.com/org/repo/issues/1",
            "Acceptance text here.",
            claimDeadline,
            claimDeadline
        );
        vm.stopPrank();
    }

    function testClaimOnce() public {
        _createPact();

        vm.expectEmit(true, true, false, false);
        emit MergePact.PactClaimed(0, contributorA);

        vm.prank(contributorA);
        mergePact.claimPact(0);

        MergePact.Pact memory pact = mergePact.getPact(0);
        assertEq(uint256(pact.state), uint256(MergePact.PactState.Claimed));
        assertEq(pact.contributor, contributorA);
    }

    function testDoubleClaimBlocked() public {
        _createPact();
        vm.prank(contributorA);
        mergePact.claimPact(0);

        vm.prank(contributorB);
        vm.expectRevert(MergePact.InvalidPactState.selector);
        mergePact.claimPact(0);
    }

    function testMaintainerCannotClaim() public {
        _createPact();
        vm.prank(maintainer);
        vm.expectRevert(MergePact.MaintainerCannotClaim.selector);
        mergePact.claimPact(0);
    }

    function testSubmitProofRoleCheck() public {
        _createPact();
        vm.prank(contributorA);
        mergePact.claimPact(0);

        vm.prank(contributorB);
        vm.expectRevert(MergePact.NotContributor.selector);
        mergePact.submitProof(0, "https://github.com/org/repo/pull/1");
    }

    function testSubmitProofStateAndStorage() public {
        _createPact();
        vm.prank(contributorA);
        mergePact.claimPact(0);

        string memory proofUrl = "https://github.com/org/repo/pull/1";
        vm.expectEmit(true, true, false, true);
        emit MergePact.ProofSubmitted(0, contributorA, proofUrl);

        vm.prank(contributorA);
        mergePact.submitProof(0, proofUrl);

        MergePact.Pact memory pact = mergePact.getPact(0);
        assertEq(uint256(pact.state), uint256(MergePact.PactState.Submitted));
        assertEq(pact.proofUrl, proofUrl);
    }

    function testReleaseRoleCheck() public {
        _createPact();
        vm.prank(contributorA);
        mergePact.claimPact(0);
        vm.prank(contributorA);
        mergePact.submitProof(0, "https://github.com/org/repo/pull/1");

        vm.prank(contributorA);
        vm.expectRevert(MergePact.NotMaintainer.selector);
        mergePact.approveAndRelease(0);
    }

    function testReleasePayment() public {
        _createPact();
        vm.prank(contributorA);
        mergePact.claimPact(0);
        vm.prank(contributorA);
        mergePact.submitProof(0, "https://github.com/org/repo/pull/1");

        uint256 before = contributorA.balance;

        vm.expectEmit(true, true, false, true);
        emit MergePact.PactReleased(0, contributorA, 0.5 ether);

        vm.prank(maintainer);
        mergePact.approveAndRelease(0);

        MergePact.Pact memory pact = mergePact.getPact(0);
        assertEq(uint256(pact.state), uint256(MergePact.PactState.Released));
        assertEq(contributorA.balance, before + 0.5 ether);
    }

    function testCancelOpenPact() public {
        _createPact();
        uint256 before = maintainer.balance;

        vm.prank(maintainer);
        mergePact.cancelPact(0);

        MergePact.Pact memory pact = mergePact.getPact(0);
        assertEq(uint256(pact.state), uint256(MergePact.PactState.Cancelled));
        assertEq(maintainer.balance, before + 0.5 ether);
    }

    function testReclaimUnclaimed() public {
        _createPact();
        vm.warp(claimDeadline + 1);

        uint256 before = maintainer.balance;
        vm.prank(maintainer);
        mergePact.reclaimUnclaimed(0);

        MergePact.Pact memory pact = mergePact.getPact(0);
        assertEq(uint256(pact.state), uint256(MergePact.PactState.Reclaimed));
        assertEq(maintainer.balance, before + 0.5 ether);
    }

    function testReclaimUnsubmitted() public {
        _createPact();
        vm.prank(contributorA);
        mergePact.claimPact(0);
        vm.warp(workDeadline + 1);

        uint256 before = maintainer.balance;
        vm.prank(maintainer);
        mergePact.reclaimUnsubmitted(0);

        MergePact.Pact memory pact = mergePact.getPact(0);
        assertEq(uint256(pact.state), uint256(MergePact.PactState.Reclaimed));
        assertEq(maintainer.balance, before + 0.5 ether);
    }

    function testTerminalStateSafety() public {
        _createPact();
        vm.prank(contributorA);
        mergePact.claimPact(0);
        vm.prank(contributorA);
        mergePact.submitProof(0, "https://github.com/org/repo/pull/1");
        vm.prank(maintainer);
        mergePact.approveAndRelease(0);

        vm.prank(contributorA);
        vm.expectRevert(MergePact.InvalidPactState.selector);
        mergePact.claimPact(0);

        vm.prank(contributorA);
        vm.expectRevert(MergePact.InvalidPactState.selector);
        mergePact.submitProof(0, "https://github.com/org/repo/pull/2");

        vm.prank(maintainer);
        vm.expectRevert(MergePact.InvalidPactState.selector);
        mergePact.approveAndRelease(0);

        vm.prank(maintainer);
        vm.expectRevert(MergePact.InvalidPactState.selector);
        mergePact.cancelPact(0);

        vm.prank(maintainer);
        vm.expectRevert(MergePact.InvalidPactState.selector);
        mergePact.reclaimUnclaimed(0);

        vm.prank(maintainer);
        vm.expectRevert(MergePact.InvalidPactState.selector);
        mergePact.reclaimUnsubmitted(0);
    }

    function testDirectTransferBlocked() public {
        vm.expectRevert(MergePact.DirectTransferDisabled.selector);
        (bool ok,) = address(mergePact).call{ value: 1 ether }("");
        ok;
    }
}
