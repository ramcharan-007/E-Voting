// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract ElectionFactory {
    address[] public deployedElections;

    function createElection(bytes[] memory proposalNames, address[] memory eligibleVoters) public {
        address newElection = address(new Election(proposalNames, eligibleVoters, msg.sender));
        deployedElections.push(newElection);
    }
    
     function getDeployedElections() public view returns (address[] memory) {
        return deployedElections;
    }
}

contract Election {
    address public admin;

    struct Voters {
        bool hasVoted;
        uint vote;
    }

    struct Candidates {
        bytes name;
        uint voteCount;
    }

    mapping(address => Voters) public voters;
    Candidates[] public candidates;

    // Maintain a list of eligible voters
    address[] public eligibleVoters;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    modifier onlyEligibleVoters(address voter) {
        require(!voters[voter].hasVoted, "You have already voted.");
        require(isVoterEligible(voter), "You are not eligible to vote.");
        _;
    }

    constructor(bytes[] memory proposalNames, address[] memory _eligibleVoters, address creator) {
        admin = creator;

        for (uint i = 0; i < proposalNames.length; i++) {
            candidates.push(
                Candidates({
                    name: proposalNames[i],
                    voteCount: 0
                })
            );
        }

        eligibleVoters = _eligibleVoters;

        // Initialize eligible voters in the mapping with hasVoted set to false
        for (uint i = 0; i < eligibleVoters.length; i++) {
            voters[eligibleVoters[i]] = Voters({
                hasVoted: false,
                vote: 0
            });
        }
    }

    function isVoterEligible(address voter) internal view returns (bool) {
        for (uint i = 0; i < eligibleVoters.length; i++) {
            if (eligibleVoters[i] == voter) {
                return true;
            }
        }
        return false;
    }

    function vote(address voter, bytes memory candidateName) public onlyEligibleVoters(voter) {
        // Perform the voting logic here
        candidatesVotesCount(candidateName);
        candidates[getCandidateIndex(candidateName)].voteCount++;

        // Mark the voter as having voted
        voters[voter].hasVoted = true;
        voters[voter].vote = getCandidateIndex(candidateName);

        // Emit the vote event
        emit Vote(voter, candidateName);
    }

    function candidatesVotesCount(bytes memory candidateName) public view returns (uint) {
        // Return the vote count for the specified candidate
        uint candidateIndex = getCandidateIndex(candidateName);
        return candidates[candidateIndex].voteCount;
    }

    function getCandidateIndex(bytes memory candidateName) internal view returns (uint) {
        // Find the index of the candidate in the candidates array
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(candidates[i].name) == keccak256(candidateName)) {
                return i;
            }
        }
        revert("Candidate not found");
    }

    function getResult() public view returns (bytes memory winner) {
        uint maxVotes = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winner = candidates[i].name;
            }
        }
        return winner;
    }

    event Vote(address indexed voter, bytes indexed candidateName);
}
