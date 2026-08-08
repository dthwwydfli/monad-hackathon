// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import { console2 } from "forge-std/console2.sol";
import "../contracts/MergePact.sol";

/// @notice Non-interactive deploy for CI / agents (uses DEPLOYER_PRIVATE_KEY from env)
contract DeployMergePactBroadcast is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        MergePact mergePact = new MergePact();

        vm.stopBroadcast();

        console2.log("MergePact deployed at:", address(mergePact));
        console2.log("Deployer:", deployer);
    }
}
