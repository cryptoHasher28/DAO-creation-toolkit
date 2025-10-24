// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CharityDonation {
    address public owner;
    uint256 public totalDonations;

    mapping(address => uint256) public donations;

    event Donated(address indexed donor, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    /// @notice Donate Ether to the charity
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        donations[msg.sender] += msg.value;
        totalDonations += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    /// @notice Withdraw all funds to the owner's address
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner).transfer(balance);
        emit Withdrawn(owner, balance);
    }

    /// @notice Get the contract's current Ether balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
