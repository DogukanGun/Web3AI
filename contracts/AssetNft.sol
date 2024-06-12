// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "./interface/IAssetNft.sol";
import "./interface/ITrade.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract AssetNft is ERC721, IAssetNft {
    string private baseURI;
    address public erc20Address;
    string private cidForOwnership;
    string private assetData;
    uint256 private price;

    constructor(
        string memory nameCons,
        string memory symbolCons,
        string memory _assetData,
        uint256 _price,
        string memory baseURICons,
        address _erc20Address
    ) ERC721(nameCons, symbolCons) {
        assetData = _assetData;
        baseURI = baseURICons;
        price = _price;
        erc20Address = _erc20Address;
        _mint(msg.sender, uint256(keccak256(abi.encodePacked(msg.sender))));
    }

    function setOwnership(uint256 _tokenId,address tradeContract) external {
        bool isCorrectTrade = ITrade(tradeContract).isCorrectTrade(ownerOf(_tokenId),msg.sender,price);
        require(isCorrectTrade,"Wrong trade contract");
        bool isTransferVerified = ITrade(tradeContract).isTransferVerified();
        require(isTransferVerified,"Transfer is not verified");
        IERC20(erc20Address).transfer(ownerOf(_tokenId), price);
        ITrade(tradeContract).setTransferDone();
        transferFrom(ownerOf(_tokenId), msg.sender, _tokenId);
    }
    
    function getTokenID() external view returns(uint256){
        return uint256(keccak256(abi.encodePacked(msg.sender)));
    }

    function setPrice(uint256 _tokenId, uint256 _price) external {
        require(
            ownerOf(_tokenId) == msg.sender,
            "Only the current owner can change the price"
        );
        price = _price;
    }

    function getPrice() external view returns (uint256) {
        return price;
    }

    function getAssetData() external view returns (string memory) {
        return assetData;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
