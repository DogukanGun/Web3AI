// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "./Trade.sol";
import "./interface/IAssetNft.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";

contract Market {
    struct User {
        string name;
        address wallet;
    }

    mapping(address => bool) registeredUsers;
    mapping(address => string) users;
    mapping(bytes32 => address) tradeContracts;

    function register(string calldata name) public {
        require(
            registeredUsers[msg.sender] == false,
            "You have already registered."
        );
        registeredUsers[msg.sender] = true;
        users[msg.sender] = name;
    }

    function createTrade(address nft, uint256 tokenId) external {
        address owner = IERC721(nft).ownerOf(tokenId);
        require(msg.sender == owner, "Only owner can start a trade.");
        uint256 price = IAssetNft(nft).getPrice();
        address tradeAddress = address(
            new Trade(
                owner,
                msg.sender,
                nft,
                price,
                users[owner],
                users[msg.sender]
            )
        );
        bytes32 hash = keccak256(abi.encodePacked(owner, msg.sender, price));
        tradeContracts[hash] = tradeAddress;
    }

    function getTradeContractAddress(address nft, uint256 tokenId) external view returns(address){
        address owner = IERC721(nft).ownerOf(tokenId);
        uint256 price = IAssetNft(nft).getPrice();
        bytes32 hash = keccak256(abi.encodePacked(owner, msg.sender, price));
        return tradeContracts[hash];
    }

    function isRegistered() public view returns (bool) {
        return registeredUsers[msg.sender];
    }
}
