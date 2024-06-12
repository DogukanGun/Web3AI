// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./interface/ITrade.sol";

contract Trade is ITrade {
    address seller;
    address buyer;
    address nft;
    uint256 price;
    string sellerName;
    string buyerName;
    bool transferVerified;
    bool transferDone;

    constructor(
        address _seller,
        address _buyer,
        address _nftAddress,
        uint256 _price,
        string memory _sellerName,
        string memory _buyerName
    ) {
        seller = _seller;
        buyer = _buyer;
        price = _price;
        sellerName = _sellerName;
        buyerName = _buyerName;
        nft = _nftAddress;
    }

    function verify() external {
        transferVerified = true;
    }

    function isTransferVerified() external view returns (bool) {
        return transferVerified;
    }

    function isCorrectTrade(
        address _seller,
        address _buyer,
        uint256 _price
    ) external view returns (bool) {
        return
            seller == _seller &&
            buyer == _buyer &&
            price == _price &&
            !transferDone;
    }

    function setTransferDone() external {
        require(msg.sender == nft, "Only nft can set transfer done");
        transferDone = true;
    }
}
