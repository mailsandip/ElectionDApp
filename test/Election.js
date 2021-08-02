const Election = artifacts.require("Election.sol")

contract("Election", function(accounts){
	let electionInstance;

	it("started with 4 candidates", function(){
		return Election.deployed().then(function(instance){
			return instance.candidateCount();
		}).then(function(count){
			assert.equal(count,4);
		})
	});

	//check if the candidate values are correct

	it("candidates have correct information", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.candidates(1)			
		}).then(function(candidate){
			assert.equal(candidate[0],1,"candidate has correct id");
			assert.equal(candidate[1],"Sam","Candidate has corrct name");
			assert.equal(candidate[2],0,"candidate has correct vote count");
			return electionInstance.candidates(2)
		}).then(function(candidate){
			assert.equal(candidate[0],2,"candidate has correct id");
			assert.equal(candidate[1],"Allen","Candidate has corrct name");
			assert.equal(candidate[2],0,"candidate has correct vote count");
		});
	});

	it("voted for candidate 2", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.voteForCandidate(2,{ from:accounts[0] });
		}).then(function(receipt){
			return electionInstance.voters(accounts[0]);
		}).then(function(hasVoted){
			assert(hasVoted,"The account has voted:")
			return electionInstance.candidates(2);
		}).then(function(candidate){
			var voteCount= candidate[2];
			assert.equal(voteCount,1,"Candidate 2 has the correct vote count");
		})
	});

	it("throws an exception for invalid candidate id", async()=>{
		const instance = await Election.deployed();
		
		try{
			await instance.voteForCandidate(99,{from: accounts[0]});
		}catch(error){
			assert(error.toString());	
		}
		
		//check the vote count should not increase for Candidate 1,2,3
		var candidate1 = await instance.candidates(1);
		var count = await candidate1[2];
		assert.equal(count,0,"Candidate 1 did not receive any vote");

	});
});