// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface ITrade {
    function isTransferVerified() external view returns (bool);

    function setTransferDone() external;

    function isCorrectTrade(
        address _seller,
        address _buyer,
        uint256 _price
    ) external view returns (bool);

    function verify() external;
}
