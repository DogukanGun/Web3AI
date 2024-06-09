// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IAssetNft {
    function setOwnership() external ;

    function setPrice(uint256 _price) external;

    function getPrice() external view returns(uint256);

    function getAssetData() external view returns (string memory);

}