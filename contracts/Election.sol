// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Election {

  struct Candidate {
    uint256 id;
    string name;
    uint256 voteCount;
  }

  //list of voters
  mapping (address => bool) public voters;
  
  mapping (uint256 => Candidate) public candidates; 
  uint256 public candidateCount;
  
  event voteEvent(uint256 indexed _candidateId);

  constructor() public {
    _addCandidate("Sam");
    _addCandidate("Allen");   
    _addCandidate("James");
    _addCandidate("Frank");
  }

  function _addCandidate(string memory _name) private {
    candidateCount++;
    candidates[candidateCount] = Candidate(candidateCount,_name,0);
  }

  function voteForCandidate(uint256 _candidateId) external {
     //it is the valid candidate
    require((_candidateId >0 && _candidateId <= candidateCount),"This is not a valid Candidate ID");   
    
    //check the address has not voted already
    require (voters[msg.sender]==false,"The address has already voted");
       
    voters[msg.sender] = true;  
    candidates[_candidateId].voteCount++;

    emit voteEvent(_candidateId);
  }
}
