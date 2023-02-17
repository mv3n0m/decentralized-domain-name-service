// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    uint256 public maxSupply;
    uint256 public totalSupply;
    address public owner;

    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
    }

    mapping(uint256 => Domain) domains;

    modifier restrictOwner() {
        require(msg.sender == owner, "Only deployer can list domains.");
        _;
    }

    constructor(string memory _name, string memory _symbol) 
        ERC721(_name, _symbol) 
    {
        owner = msg.sender;
    }

    function listDomain(string memory _name, uint256 _cost) public restrictOwner {
        maxSupply++;
        domains[maxSupply] = Domain(_name, _cost, false);
    }

    function getDomain(uint256 _id) public view restrictOwner returns (Domain memory) {
        return domains[_id];
    }

    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= maxSupply);
        require(domains[_id].isOwned == false);
        require(domains[_id].cost <= msg.value);

        domains[_id].isOwned = true;
        totalSupply++;
        _safeMint(msg.sender, _id);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public restrictOwner {
        (bool success, ) = owner.call{value: getBalance( )}("");
        require(success);
    }

}



