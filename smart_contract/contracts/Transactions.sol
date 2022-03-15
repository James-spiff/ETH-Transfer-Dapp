//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCount;

    event Transfer(address from, address to, uint amount, string message, uint256 timestamp, string keyword); // an event that triggers when the inputs passed from the frontend to initiate a transfer

    struct TransferStruct {
        address from;
        address to;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    } //struct is similar to an object

    TransferStruct[] transactions; //Here the array transactions has the properties of TransferStruct e.g address[] sender is an array called sender with an address type so it is an array that holds addresses.

    function addToBlockchain(address payable to, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, to, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, to, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {   //returns an array of type TransferStruct from the memory
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}