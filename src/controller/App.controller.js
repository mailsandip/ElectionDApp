sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageBox",
    "../js/truffle-contract"
], function (Controller, MessageToast,JSONModel,MessageBox) {
   "use strict";
   return Controller.extend("com.sam.voting.controllers.App", {
      oController: this,
      contracts: {},
      account: "0x0",
      web3Provider: null,
      electionContractInstance:null,

      onInit: function() {         
         var that = this;
         if(typeof Web3 === undefined  ){
            MessageBox.error("Please install Metamask to use this dApp..")
         } else{
             ethereum.on('accountsChanged', this.getEthAccounts.bind(this));
         }
        // this.initializeWeb3();

        

      },
      
      connectToMetamask : function (oEvent) {
         //MessageToast.show("Hello World");
         const web3Instance = window.web3;
         const ethInstance = window.ethereum;

         let ethAccounts;
         //const Web3 = sap.ui.require("web3");


         if(typeof ethInstance === undefined){
            alert("Please install MetaMask to use this dApp!");
         }else{
            //console.log('sss');
           // let accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            ethereum.request({ method: 'eth_requestAccounts' }).then(this.getEthAccounts.bind(this)).catch((error) => {
               console.log(error)
            });
               
         }
      },

      initializeWeb3: function() {
        // console.log("init2222");

      },

      getEthAccounts: async function(accounts) {
         var that = this;
         console.log('acc changed');
         if(accounts.length === 0){
            console.log("please connect to Metamask");  //in case metamask is locked or no account is connected
         }else{
            this.byId("account").setText(accounts[0]);
            this.account= accounts[0];
         }

         //once account is connected, load the smart contract data
         this.initElectionContract();
      },

      initElectionContract: function () {
         console.log('ddfdfsd');
         var that = this;
         //var electionContractInstance;
                     

         $.getJSON("Election.json", async function(electionArtifact){
            //console.log(electionArtifact);
            that.contracts.Election = TruffleContract(electionArtifact);
            //console.log(that.contracts.Election);
            that.contracts.Election.setProvider(window.web3.currentProvider);

            //get candidate data from the smart contract
            that.electionContractInstance =  await that.contracts.Election.deployed();

            that.getListOfCandidates();
            // that.electionContractInstance = contractInstance;
            //    return that.electionContractInstance.candidateCount();
            //    that.getListOfCandidates();
            // }).then(function(candidateCount) {
            //    // body...
              
               
            // }           
               
            //    // candidateListModel.setData({"results":candidateData});  
            //    // that.getView().setModel(candidateListModel);

            // }).catch(function(error){
            //    MessageBox.error(error.message);
            // });
            
           
         })



      },

      vote: async function() {
         // body...
            var that = this;
         var oSelectedRow = this.byId("idCandidateList").getSelectedItem();
         if(oSelectedRow == null){
            MessageBox.warning("Please select a candidate to vote..."); 
            } else {
               var candidateId = oSelectedRow.getBindingContext().getProperty("id");        
           console.log(candidateId);

           //call funtion of the smart contract, check if the address has already voted
           var hasVoted = await this.electionContractInstance.voters(this.account);        
                     
           if(hasVoted){
            MessageBox.error("This eth account has already voted..."); 

           }else{
               try{
                  var result = await this.electionContractInstance.voteForCandidate(candidateId,{ from: this.account});
                  

                  //listend to the events
                  this.electionContractInstance.voteEvent({},{
                     fromBlock:0,
                     toBlock: 'latest'
                  }).watch(function(error, event){
                     //console.log(event);
                     MessageBox.success("You voted successfully at ethereum Block# "+event.blockNumber);
                      //refresh the table
                     that.getListOfCandidates();
                  });

                 
               }catch(error) {
                  MessageBox.error(error.code+"\n"+error.message);
               }
               
           }
         }
         
        

        //console.log(this.account);
         // body...
      },

      getListOfCandidates: function() {
         var candidateListModel = new JSONModel();
         var candidateData = [];
         var that = this;
         
           that.electionContractInstance.candidateCount().then(function(count){
               for (var i = 1; i <= count; i++) {
                     that.electionContractInstance.candidates(i).then(function(candidate){                    
                     //fill the jsonmodel here
                     
                     var id = candidate[0].toNumber();
                     var name= candidate[1].toString();
                     var voteCount = candidate[2].toNumber();

                     var entry = {
                        id:id,
                        name:name,
                        voteCount: voteCount
                     };

                     //console.log("Entry11::"+entry.toString());
                     candidateData.push(entry);
                     //console.log("data::"+candidateData);
                     candidateListModel.setData({"results":candidateData});    
                     that.getView().setModel(candidateListModel);

                  }).catch(function(error){
                     MessageBox.error(error.message);
                  });
            }
           }).catch(function(error){
               console.log(error);
           });
                  

      



   }

});
});