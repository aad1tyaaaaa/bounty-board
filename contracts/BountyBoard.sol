// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BountyBoard {
    enum BountyStatus { Open, Claimed, Completed, Approved }
    
    struct Bounty {
        uint256 id;
        address poster;
        address worker;
        string title;
        string description;
        uint256 reward;
        BountyStatus status;
        uint256 createdAt;
    }
    
    mapping(uint256 => Bounty) public bounties;
    uint256 public bountyCounter;
    
    event BountyPosted(uint256 indexed bountyId, address indexed poster, string title, uint256 reward);
    event BountyClaimed(uint256 indexed bountyId, address indexed worker);
    event BountyCompleted(uint256 indexed bountyId, address indexed worker);
    event BountyApproved(uint256 indexed bountyId, address indexed poster, address indexed worker, uint256 reward);
    
    modifier onlyPoster(uint256 bountyId) {
        require(bounties[bountyId].poster == msg.sender, "Only poster can perform this action");
        _;
    }
    
    modifier onlyWorker(uint256 bountyId) {
        require(bounties[bountyId].worker == msg.sender, "Only assigned worker can perform this action");
        _;
    }
    
    modifier bountyExists(uint256 bountyId) {
        require(bountyId > 0 && bountyId <= bountyCounter, "Bounty does not exist");
        _;
    }
    
    function postBounty(string memory title, string memory description) external payable returns (uint256) {
        require(msg.value > 0, "Reward must be greater than 0");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        
        bountyCounter++;
        
        bounties[bountyCounter] = Bounty({
            id: bountyCounter,
            poster: msg.sender,
            worker: address(0),
            title: title,
            description: description,
            reward: msg.value,
            status: BountyStatus.Open,
            createdAt: block.timestamp
        });
        
        emit BountyPosted(bountyCounter, msg.sender, title, msg.value);
        return bountyCounter;
    }
    
    function claimBounty(uint256 bountyId) external bountyExists(bountyId) {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.Open, "Bounty is not available for claiming");
        require(bounty.poster != msg.sender, "Cannot claim your own bounty");
        
        bounty.worker = msg.sender;
        bounty.status = BountyStatus.Claimed;
        
        emit BountyClaimed(bountyId, msg.sender);
    }
    
    function completeBounty(uint256 bountyId) external bountyExists(bountyId) onlyWorker(bountyId) {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.Claimed, "Bounty must be claimed first");
        
        bounty.status = BountyStatus.Completed;
        
        emit BountyCompleted(bountyId, msg.sender);
    }
    
    function approveBounty(uint256 bountyId) external bountyExists(bountyId) onlyPoster(bountyId) {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.Completed, "Bounty must be completed first");
        
        bounty.status = BountyStatus.Approved;
        
        // Transfer reward to worker
        payable(bounty.worker).transfer(bounty.reward);
        
        emit BountyApproved(bountyId, msg.sender, bounty.worker, bounty.reward);
    }
    
    function getBounty(uint256 bountyId) external view bountyExists(bountyId) returns (Bounty memory) {
        return bounties[bountyId];
    }
    
    function getAllBounties() external view returns (Bounty[] memory) {
        Bounty[] memory allBounties = new Bounty[](bountyCounter);
        
        for (uint256 i = 1; i <= bountyCounter; i++) {
            allBounties[i - 1] = bounties[i];
        }
        
        return allBounties;
    }
    
    function getBountiesCount() external view returns (uint256) {
        return bountyCounter;
    }
    
    function getOpenBounties() external view returns (Bounty[] memory) {
        uint256 openCount = 0;
        
        // Count open bounties
        for (uint256 i = 1; i <= bountyCounter; i++) {
            if (bounties[i].status == BountyStatus.Open) {
                openCount++;
            }
        }
        
        // Create array of open bounties
        Bounty[] memory openBounties = new Bounty[](openCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= bountyCounter; i++) {
            if (bounties[i].status == BountyStatus.Open) {
                openBounties[index] = bounties[i];
                index++;
            }
        }
        
        return openBounties;
    }
    
    function getUserBounties(address user) external view returns (Bounty[] memory) {
        uint256 userBountyCount = 0;
        
        // Count user's bounties (posted or claimed)
        for (uint256 i = 1; i <= bountyCounter; i++) {
            if (bounties[i].poster == user || bounties[i].worker == user) {
                userBountyCount++;
            }
        }
        
        // Create array of user's bounties
        Bounty[] memory userBounties = new Bounty[](userBountyCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= bountyCounter; i++) {
            if (bounties[i].poster == user || bounties[i].worker == user) {
                userBounties[index] = bounties[i];
                index++;
            }
        }
        
        return userBounties;
    }
}
