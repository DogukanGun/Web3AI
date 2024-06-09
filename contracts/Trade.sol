// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Trade {

    address seller;
    address buyer;
    uint256 price;
    string sellerName;
    string buyerName;

    constructor(address _seller,address _buyer,uint256 _price,string memory _sellerName,string memory _buyerName) {
        seller = _seller;
        buyer = _buyer;
        price = _price;
        sellerName = _sellerName;
        buyerName = _buyerName;
    }

    function verify() public {
        //verify the contract 
    }


}