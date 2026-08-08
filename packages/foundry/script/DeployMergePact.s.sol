//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../contracts/MergePact.sol";
import "./DeployHelpers.s.sol";

contract DeployMergePact is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        MergePact mergePact = new MergePact();
        deployments.push(Deployment({ name: "MergePact", addr: address(mergePact) }));
    }
}
