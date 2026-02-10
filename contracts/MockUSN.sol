// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSN
 * @dev Mock USN stablecoin for testing on Neura Testnet
 */
contract MockUSN is ERC20, Ownable {
    constructor() ERC20("Mock USN Stablecoin", "USN") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    /**
     * @dev Faucet function for testing
     */
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    /**
     * @dev Mint function (owner only)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
