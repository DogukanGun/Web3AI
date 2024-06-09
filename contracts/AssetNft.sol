// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "AIHackathon/interface/IAssetNft.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract AssetNft is ERC721,IAssetNft{

    string private baseURI;
    string private cidForOwnership;
    string private assetData;
    uint256 private price;

    constructor(string memory nameCons, string memory symbolCons,string memory _assetData,uint256 _price, string memory baseURICons) ERC721(nameCons, symbolCons) {
        assetData = _assetData;
        baseURI = baseURICons;
        price = _price;
    }

    function setOwnership() external {
        //TODO call ownership contract, if the contract is done transfer the ownership to new owner
    }

    function setPrice(uint256 _price) external {
        //add check only current owner can change
        price = _price;
    }

    function getPrice() external view returns(uint256) {
        return price;
    }

    function getAssetData() external view returns (string memory) {
        return assetData;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}