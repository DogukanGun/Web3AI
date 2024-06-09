// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "AIHackathon/Trade.sol";
import "AIHackathon/interface/IAssetNft.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";

contract Market {

    struct User {
        string name;
        address wallet;
    }

    mapping(address=>bool) registeredUsers;
    mapping(address=>string) users;
    mapping(bytes32=>address) tradeContracts;

    function register(string calldata name) public  {
        require(registeredUsers[msg.sender] == false,"You have already registered.");
        users[msg.sender] = name;
    }

    function createTrade(address nft,uint256 tokenId) external {
        address owner = IERC721(nft).ownerOf(tokenId);
        uint256 price = IAssetNft(nft).getPrice();
        address tradeAddress = address(new Trade(owner,msg.sender,price,users[owner],users[msg.sender]));
        bytes32 hash = keccak256(abi.encodePacked(owner, msg.sender, price));
        tradeContracts[hash] = tradeAddress;
    }

    function isRegistered() public view returns(bool) {
        return registeredUsers[msg.sender];
    }
    
}