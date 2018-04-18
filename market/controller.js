'use strict';
//SPDX-License-Identifier: Apache-2.0

/*
  This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/fabcar/query.js
  and https://github.com/hyperledger/fabric-samples/blob/release/fabcar/invoke.js
 */

// call the packages we need
var express       = require('express');        // call express
var app           = express();                 // define our app using express
var bodyParser    = require('body-parser');
var http          = require('http')
var fs            = require('fs');
//var Fabric_Client = require('fabric-client');
var hfc           = require('fabric-client');
var path          = require('path');
var util          = require('util');
var os            = require('os');

module.exports = (function() {
return{
	query_qGetUser_100: function(req, res){
		console.log("controller GetUser_100: ");

		var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'market',
            network_url: 'grpc://localhost:7051',
        };

        var channel = {};
        var client = null;

        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            //KeyValueStore : Abstract class for a Key-Value store. The Channel class uses this store to save sensitive information such as authenticated user's private keys, certificates, etc. 
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            //Set an optional state store to persist application states. The state store must implement the module:api.KeyValueStore interface. 
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
            // the method returns a Promise and will attempt to check the state store for the requested user by the "name"
            //The loaded user object must represent an enrolled user with a valid enrollment certificate signed by a trusted CA (such as the CA server)
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            //isEnrolled: Determine if this name has been enrolled.
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            //Returns a Channel instance with the given name. This represents a channel and its associated ledger.
            channel = client.newChannel(options.channel_id);
            //Add the peer object to the channel object. A channel object can be optionally configured with a list of peer objects, which will be used when calling certain methods such as sendInstantiateProposal(), sendUpgradeProposal(), sendTransactionProposal.
            channel.addPeer(client.newPeer(options.network_url));
            return;
        }).then(() => {
            console.log("Make query");
            //Returns a new TransactionID object. Fabric transaction ids are constructed as a hash of a nonce concatenated with the signing identity's serialized bytes. The TransactionID object keeps the nonce and the resulting id string bundled together as a coherent pair. 
            var transaction_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", transaction_id._transaction_id);

            // queryCar - requires 1 argument, ex: args: ['CAR4'],
            // queryAllCars - requires no arguments , ex: args: [''],
            const request = {
                chaincodeId: options.chaincode_id,
                txId: transaction_id,
                fcn: 'qGetUser',
                args: ['100']
            };
            //Sends a proposal to one or more endorsing peers that will be handled by the chaincode. In fabric v1.0, there is no difference in how the endorsing peers process a request to invoke a chaincode for transaction vs. to invoke a chaincode for query. All requests will be presented to the target chaincode's 'Invoke' method which must be implemented to understand from the arguments that this is a query request. The chaincode must also return results in the byte array format and the caller will have to be able to decode these results.
            //proposal 送給channel裡的peer 透過chaincode處理
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log("returned from query");
            if (!query_responses.length) {
                res.send("Could not locate User_100");
                console.log("No payloads were returned from query");
            } else {
                console.log("Query result count = ", query_responses.length)
            }
            if (query_responses[0] instanceof Error) {
                res.send("Could not locate User_100");
                console.error("error from query = ", query_responses[0]);
            }
            //return response!!!!!
            console.log("Response is ", query_responses[0].toString());
            res.json(JSON.parse(query_responses[0].toString()));
        }).catch((err) => {
            console.error("Caught Error", err);
        });

	},
    query_qGetUserSpe: function(req, res){
		console.log("controller GetUserSpe: ");
        
        var key = req.params.UserID;
        console.log("controller GetUserSpe: "+key);
		var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            network_url: 'grpc://localhost:7051',
        };

        var channel = {};
        var client = null;

        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            channel.addPeer(client.newPeer(options.network_url));
            return;
        }).then(() => {
            console.log("Make query!!!");
            var transaction_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", transaction_id._transaction_id);

            // queryCar - requires 1 argument, ex: args: ['CAR4'],
            // queryAllCars - requires no arguments , ex: args: [''],
             const request = {
                chaincodeId: options.chaincode_id,
                txId: transaction_id,
                fcn: 'qGetUserSpe',
                args: [key]
            };
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log("returned from query");
            if (!query_responses.length) {
                res.send("Could not locate Specific User");
                console.log("No payloads were returned from query");
            } else {
                console.log("Query result count = ", query_responses.length)
            }
            if (query_responses[0] instanceof Error) {
                res.send("Could not locate specific User");
                console.error("error from query = ", query_responses[0]);
            }
            //return response!!!
            console.log("Response is ", query_responses[0].toString());
            res.json(JSON.parse(query_responses[0].toString()));
        }).catch((err) => {
            console.error("Caught Error", err);
        });

	},
    
    query_qGetListOfBids: function(req, res){
		console.log("controller GetListOfBids: ");

        var key = req.params.AuctionID; 
         
		var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            network_url: 'grpc://localhost:7051',
        };

        var channel = {};
        var client = null;

        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            channel.addPeer(client.newPeer(options.network_url));
            return;
        }).then(() => {
            console.log("Make query");
            var transaction_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", transaction_id._transaction_id);

            // queryCar - requires 1 argument, ex: args: ['CAR4'],
            // queryAllCars - requires no arguments , ex: args: [''],
            const request = {
                chaincodeId: options.chaincode_id,
                txId: transaction_id,
                fcn: 'qGetListOfBids',
                args: [key]
            };
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log("returned from query");
            if (!query_responses.length) {
                res.send("Could not locate List Of Bids");
                console.log("No payloads were returned from query");
            } else {
                console.log("Query result count = ", query_responses.length)
            }
            if (query_responses[0] instanceof Error) {
                res.send("Could not locate List Of Bids");
                console.error("error from query = ", query_responses[0]);
            }
            console.log("Response is ", query_responses[0].toString());
            res.json(JSON.parse(query_responses[0].toString()));
        }).catch((err) => {
            console.error("Caught Error", err);
        });
	},
    
    query_qGetHighestBid: function(req, res){
		console.log("controller GetHighestBid: ");

        var key = req.params.AuctionID; 
         
		var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            network_url: 'grpc://localhost:7051',
        };

        var channel = {};
        var client = null;

        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            channel.addPeer(client.newPeer(options.network_url));
            return;
        }).then(() => {
            console.log("Make query");
            var transaction_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", transaction_id._transaction_id);

            // queryCar - requires 1 argument, ex: args: ['CAR4'],
            // queryAllCars - requires no arguments , ex: args: [''],
            const request = {
                chaincodeId: options.chaincode_id,
                txId: transaction_id,
                fcn: 'qGetHighestBid',
                args: [key]
            };
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log("returned from query");
            if (!query_responses.length) {
                res.send("Could not locate Highest Bid");
                console.log("No payloads were returned from query");
            } else {
                console.log("Query result count = ", query_responses.length)
            }
            if (query_responses[0] instanceof Error) {
                res.send("Could not locate Highest Bid");
                console.error("error from query = ", query_responses[0]);
            }
            res.json(JSON.parse(query_responses[0].toString()));
            console.log("Response is ", query_responses[0].toString());
        }).catch((err) => {
            console.error("Caught Error", err);
        });
	},
    
    
    
	invoke_iPostUser_100: function(req, res){
		console.log("controller PostUser_100: ");

        var TimeStamp = req.params.TimeStamp;
        
		var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            peer_url: 'grpc://localhost:7051',
            event_url: 'grpc://localhost:7053',
            orderer_url: 'grpc://localhost:7050'
        };

        var channel = {};
        var client = null;
        var targets = [];
        var tx_id = null;
        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            var peerObj = client.newPeer(options.peer_url);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(options.orderer_url));
            targets.push(peerObj);
            return;
        }).then(() => {
            tx_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", tx_id._transaction_id);
            // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
            // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
            // send proposal to endorser
            var request = {
                targets: targets,
                chaincodeId: options.chaincode_id,
                fcn: 'iPostUser',
                args: ['100', 'USER', 'Betty Lin', 'TRD',  'Taiwan, Taipei', '0919806535', 'betty@gmail.com', 'E.SUN', '0001732345', '0234678', TimeStamp],
                chainId: options.channel_id,
                txId: tx_id
            };
            return channel.sendTransactionProposal(request);
        }).then((results) => {
            var proposalResponses = results[0];
            var proposal = results[1];
            var header = results[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                var transactionID = tx_id.getTransactionID();
                var eventPromises = [];
                let eh = client.newEventHub();
                eh.setPeerAddr(options.event_url);
                eh.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eh.disconnect();
                        reject();
                    }, 30000);

                    eh.registerTxEvent(transactionID, (tx, code) => {
                        clearTimeout(handle);
                        eh.unregisterTxEvent(transactionID);
                        eh.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eh._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                var sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                    console.log(' event promise all complete and testing complete');
                    return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
                }).catch((err) => {
                    console.error(
                        'Failed to send transaction and get notifications within the timeout period.'
                    );
                    return 'Failed to send transaction and get notifications within the timeout period.';
                });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        }, (err) => {
            console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
                err);
            return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
                err;
        }).then((response) => {
            if (response.status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
                res.send(tx_id.getTransactionID());
                return tx_id.getTransactionID();
            } else {
                console.error('Failed to order the transaction. Error code: ' + response.status);
                res.send("Could not Post User_100!");
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        }, (err) => {
            console.error('Failed to send transaction due to error: ' + err.stack ? err
                .stack : err);
            res.send("Could not Post User_100!!");
            return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
                err;
        });
	},
    
    invoke_iPostUser_300: function(req, res){
		console.log("controller PostUser_300: ");

        var TimeStamp = req.params.TimeStamp;
        
		var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            peer_url: 'grpc://localhost:7051',
            event_url: 'grpc://localhost:7053',
            orderer_url: 'grpc://localhost:7050'
        };

        var channel = {};
        var client = null;
        var targets = [];
        var tx_id = null;
        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            var peerObj = client.newPeer(options.peer_url);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(options.orderer_url));
            targets.push(peerObj);
            return;
        }).then(() => {
            tx_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", tx_id._transaction_id);
            // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
            // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
            // send proposal to endorser
            var request = {
                targets: targets,
                chaincodeId: options.chaincode_id,
                fcn: 'iPostUser',
                args: ['300', 'USER', 'Amy', 'TRD',  'Canada', '0922123123', 'happy@yahoo.com.tw', 'Fubun', '0001732347', '0234680', TimeStamp],
                chainId: options.channel_id,
                txId: tx_id
            };
            return channel.sendTransactionProposal(request);
        }).then((results) => {
            var proposalResponses = results[0];
            var proposal = results[1];
            var header = results[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                var transactionID = tx_id.getTransactionID();
                var eventPromises = [];
                let eh = client.newEventHub();
                eh.setPeerAddr(options.event_url);
                eh.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eh.disconnect();
                        reject();
                    }, 30000);

                    eh.registerTxEvent(transactionID, (tx, code) => {
                        clearTimeout(handle);
                        eh.unregisterTxEvent(transactionID);
                        eh.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eh._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                var sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                    console.log(' event promise all complete and testing complete');
                    return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
                }).catch((err) => {
                    console.error(
                        'Failed to send transaction and get notifications within the timeout period.'
                    );
                    return 'Failed to send transaction and get notifications within the timeout period.';
                });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        }, (err) => {
            console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
                err);
            return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
                err;
        }).then((response) => {
            if (response.status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
                res.send(tx_id.getTransactionID());
                return tx_id.getTransactionID();
            } else {
                console.error('Failed to order the transaction. Error code: ' + response.status);
                res.send("Could not Post User_300!");
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        }, (err) => {
            console.error('Failed to send transaction due to error: ' + err.stack ? err
                .stack : err);
            res.send("Could not Post User_300!!");
            return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
                err;
        });
	},
    
    invoke_iPostUserSpe: function(req, res){
		console.log("controller specific PostUser: ");

        var array = req.params.alo.split(",");
        console.log(array);
        
        var key = array[0];
        var RecType = array[1];
        var Name = array[2];
        var UserType = array[3];
        var Address = array[4];
        var Phone = array[5];
        var Email = array[6];
        var Bank = array[7];
        var AccountNo = array[8];
        var RoutingNo = array[9];
        var TimeStamp = array[10];
        
		var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            peer_url: 'grpc://localhost:7051',
            event_url: 'grpc://localhost:7053',
            orderer_url: 'grpc://localhost:7050'
        };

        var channel = {};
        var client = null;
        var targets = [];
        var tx_id = null;
        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            var peerObj = client.newPeer(options.peer_url);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(options.orderer_url));
            targets.push(peerObj);
            return;
        }).then(() => {
            tx_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", tx_id._transaction_id);
            // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
            // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
            // send proposal to endorser
            var request = {
                targets: targets,
                chaincodeId: options.chaincode_id,
                fcn: 'iPostUserSpe',
                args: [key, RecType, Name, UserType, Address, Phone, Email, Bank, AccountNo, RoutingNo, TimeStamp],
                chainId: options.channel_id,
                txId: tx_id
            };
            return channel.sendTransactionProposal(request);
        }).then((results) => {
            var proposalResponses = results[0];
            var proposal = results[1];
            var header = results[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                var transactionID = tx_id.getTransactionID();
                var eventPromises = [];
                let eh = client.newEventHub();
                eh.setPeerAddr(options.event_url);
                eh.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eh.disconnect();
                        reject();
                    }, 30000);

                    eh.registerTxEvent(transactionID, (tx, code) => {
                        clearTimeout(handle);
                        eh.unregisterTxEvent(transactionID);
                        eh.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eh._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                var sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                    console.log(' event promise all complete and testing complete');
                    return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
                }).catch((err) => {
                    console.error(
                        'Failed to send transaction and get notifications within the timeout period.'
                    );
                    return 'Failed to send transaction and get notifications within the timeout period.';
                });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        }, (err) => {
            console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
                err);
            return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
                err;
        }).then((response) => {
            if (response.status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
                res.send(tx_id.getTransactionID());
                return tx_id.getTransactionID();
            } else {
                console.error('Failed to order the transaction. Error code: ' + response.status);
                res.send("Could not Post Specific User!")
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        }, (err) => {
            console.error('Failed to send transaction due to error: ' + err.stack ? err
                .stack : err);
            res.send("Could not Post Specific User!!");
            return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
                err;
        });
	},
    invoke_iPostItem_1000(req,res){
        console.log("controller iPostItem_1000");
        
        var TimeStamp = req.params.TimeStamp;
        
        var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            peer_url: 'grpc://localhost:7051',
            event_url: 'grpc://localhost:7053',
            orderer_url: 'grpc://localhost:7050'
        };

        var channel = {};
        var client = null;
        var targets = [];
        var tx_id = null;
        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            var peerObj = client.newPeer(options.peer_url);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(options.orderer_url));
            targets.push(peerObj);
            return;
        }).then(() => {
            tx_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", tx_id._transaction_id);
            // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
            // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
            // send proposal to endorser
            var request = {
                targets: targets,
                chaincodeId: options.chaincode_id,
                fcn: 'iPostItem',
                args: [ '1000', 'ARTINV', 'AI model', 'predict funds and buy', '2016-02-02', 'AI', 'RL', '15.01%/year', '32.1KB', 'art1.png','60000', '100', TimeStamp],
                chainId: options.channel_id,
                txId: tx_id
            };
            return channel.sendTransactionProposal(request);
        }).then((results) => {
            var proposalResponses = results[0];
            var proposal = results[1];
            var header = results[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                var transactionID = tx_id.getTransactionID();
                var eventPromises = [];
                let eh = client.newEventHub();
                eh.setPeerAddr(options.event_url);
                eh.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eh.disconnect();
                        reject();
                    }, 30000);

                    eh.registerTxEvent(transactionID, (tx, code) => {
                        clearTimeout(handle);
                        eh.unregisterTxEvent(transactionID);
                        eh.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eh._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                var sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                    console.log(' event promise all complete and testing complete');
                    return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
                }).catch((err) => {
                    console.error(
                        'Failed to send transaction and get notifications within the timeout period.'
                    );
                    return 'Failed to send transaction and get notifications within the timeout period.';
                });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        }, (err) => {
            console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
                err);
            return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
                err;
        }).then((response) => {
            if (response.status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
                res.send(tx_id.getTransactionID());
                return tx_id.getTransactionID();
            } else {
                res.send("Could not Post Item_1000!");
                console.error('Failed to order the transaction. Error code: ' + response.status);
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        }, (err) => {
            res.send("Could not Post Item_1000!!");
            console.error('Failed to send transaction due to error: ' + err.stack ? err
                .stack : err);
            return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
                err;
        });

    },
    invoke_iPostItemSpe(req,res){
        console.log("submit alogorithm record!");
        
        var array = req.params.aloItem.split(",");
        console.log(array)
        
        var ItemID = array[0]; var ItemRecType = array[1];
        var ItemDesc = array[2]; var ItemDetail = array[3];
        var ItemDate = array[4]; var ItemType = array[5];
        var ItemSubject = array[6]; var ItemMedia = array[7];
        var ItemSize = array[8]; var ItemPicFN = array[9];
        var ItemBasePrice = array[10]; var ItemCurrentOwnerID = array[11];
        var ItemTimestamp = array[12];
        
        var Performance = ItemMedia.replace(/slash/g,"\/");
        Performance = Performance.replace(/pa/g,"%");
        
        var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            peer_url: 'grpc://localhost:7051',
            event_url: 'grpc://localhost:7053',
            orderer_url: 'grpc://localhost:7050'
        };

        var channel = {};
        var client = null;
        var targets = [];
        var tx_id = null;
        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            var peerObj = client.newPeer(options.peer_url);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(options.orderer_url));
            targets.push(peerObj);
            return;
        }).then(() => {
            tx_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", tx_id._transaction_id);
            // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
            // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
            // send proposal to endorser
            var request = {
                targets: targets,
                chaincodeId: options.chaincode_id,
                fcn: 'iPostItemSpe',
                args: [ ItemID, ItemRecType, ItemDesc, ItemDetail, ItemDate, ItemType, ItemSubject, Performance, ItemSize, ItemPicFN, ItemBasePrice, ItemCurrentOwnerID, ItemTimestamp],
                chainId: options.channel_id,
                txId: tx_id
            };
            return channel.sendTransactionProposal(request);
        }).then((results) => {
            var proposalResponses = results[0];
            var proposal = results[1];
            var header = results[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                var transactionID = tx_id.getTransactionID();
                var eventPromises = [];
                let eh = client.newEventHub();
                eh.setPeerAddr(options.event_url);
                eh.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eh.disconnect();
                        reject();
                    }, 30000);

                    eh.registerTxEvent(transactionID, (tx, code) => {
                        clearTimeout(handle);
                        eh.unregisterTxEvent(transactionID);
                        eh.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eh._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                var sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                    console.log(' event promise all complete and testing complete');
                    return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
                }).catch((err) => {
                    console.error(
                        'Failed to send transaction and get notifications within the timeout period.'
                    );
                    return 'Failed to send transaction and get notifications within the timeout period.';
                });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        }, (err) => {
            console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
                err);
            return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
                err;
        }).then((response) => {
            if (response.status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
                res.send(tx_id.getTransactionID());
                return tx_id.getTransactionID();
            } else {
                res.send("Could not Post Specific Item!");
                console.error('Failed to order the transaction. Error code: ' + response.status);
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        }, (err) => {
            res.send("Could not Post Specific Item!!");
            console.error('Failed to send transaction due to error: ' + err.stack ? err
                .stack : err);
            return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
                err;
        });

    },
    
    invoke_iOpenAuctionRequestForBids: function(req, res){
        console.log("OpenAuctionRequestForBids!!!");
        
        var array = req.params.aloOpenAuction.split(",");
        console.log(array)
        
        var AuctionRequestID = array[0]; var RecType = array[1];
        var AuctionTime = array[2]; var TimeStamp = array[3];
        
        var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            peer_url: 'grpc://localhost:7051',
            event_url: 'grpc://localhost:7053',
            orderer_url: 'grpc://localhost:7050'
        };

        var channel = {};
        var client = null;
        var targets = [];
        var tx_id = null;
        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            var peerObj = client.newPeer(options.peer_url);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(options.orderer_url));
            targets.push(peerObj);
            return;
        }).then(() => {
            tx_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", tx_id._transaction_id);
            // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
            // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
            // send proposal to endorser
            var request = {
                targets: targets,
                chaincodeId: options.chaincode_id,
                fcn: 'iOpenAuctionForBids',
                args: [AuctionRequestID,RecType,AuctionTime,TimeStamp],
                chainId: options.channel_id,
                txId: tx_id
            };
            return channel.sendTransactionProposal(request);
        }).then((results) => {
            var proposalResponses = results[0];
            var proposal = results[1];
            var header = results[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                var transactionID = tx_id.getTransactionID();
                var eventPromises = [];
                let eh = client.newEventHub();
                eh.setPeerAddr(options.event_url);
                eh.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eh.disconnect();
                        reject();
                    }, 30000);

                    eh.registerTxEvent(transactionID, (tx, code) => {
                        clearTimeout(handle);
                        eh.unregisterTxEvent(transactionID);
                        eh.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eh._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                var sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                    console.log(' event promise all complete and testing complete');
                    return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
                }).catch((err) => {
                    console.error(
                        'Failed to send transaction and get notifications within the timeout period.'
                    );
                    return 'Failed to send transaction and get notifications within the timeout period.';
                });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        }, (err) => {
            console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
                err);
            return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
                err;
        }).then((response) => {
            if (response.status === 'SUCCESS') {
                res.send(tx_id.getTransactionID());
                console.log('Successfully sent transaction to the orderer.');
                return tx_id.getTransactionID();
            } else {
                res.send("Could not Open Auction Request For Bids!");
                console.error('Failed to order the transaction. Error code: ' + response.status);
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        }, (err) => {
            res.send("Could not Open Auction Request For Bids!!");
            console.error('Failed to send transaction due to error: ' + err.stack ? err
                .stack : err);
            return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
                err;
        });
    },
    
    invoke_iCloseOpenAuctions: function(req, res){
        console.log("CloseOpenAuctions!!!");
        
        var array = req.params.aloCloseOpenAuction.split(",");
        console.log(array)
        
        var AuctionYear = array[0]; var RecType = array[1];
        var TimeStamp = array[2];
        
        var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            peer_url: 'grpc://localhost:7051',
            event_url: 'grpc://localhost:7053',
            orderer_url: 'grpc://localhost:7050'
        };

        var channel = {};
        var client = null;
        var targets = [];
        var tx_id = null;
        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            var peerObj = client.newPeer(options.peer_url);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(options.orderer_url));
            targets.push(peerObj);
            return;
        }).then(() => {
            tx_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", tx_id._transaction_id);
            // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
            // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
            // send proposal to endorser
            var request = {
                targets: targets,
                chaincodeId: options.chaincode_id,
                fcn: 'iCloseOpenAuctions',
                args: [AuctionYear,RecType,TimeStamp],
                chainId: options.channel_id,
                txId: tx_id
            };
            return channel.sendTransactionProposal(request);
        }).then((results) => {
            var proposalResponses = results[0];
            var proposal = results[1];
            var header = results[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                var transactionID = tx_id.getTransactionID();
                var eventPromises = [];
                let eh = client.newEventHub();
                eh.setPeerAddr(options.event_url);
                eh.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eh.disconnect();
                        reject();
                    }, 30000);

                    eh.registerTxEvent(transactionID, (tx, code) => {
                        clearTimeout(handle);
                        eh.unregisterTxEvent(transactionID);
                        eh.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eh._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                var sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                    console.log(' event promise all complete and testing complete');
                    return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
                }).catch((err) => {
                    console.error(
                        'Failed to send transaction and get notifications within the timeout period.'
                    );
                    return 'Failed to send transaction and get notifications within the timeout period.';
                });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        }, (err) => {
            console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
                err);
            return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
                err;
        }).then((response) => {
            if (response.status === 'SUCCESS') {
                res.send(tx_id.getTransactionID());
                console.log('Successfully sent transaction to the orderer.');
                return tx_id.getTransactionID();
            } else {
                res.send("Could not Close OpenAuctions!");
                console.error('Failed to order the transaction. Error code: ' + response.status);
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        }, (err) => {
            res.send("Could not Close OpenAuctions!!");
            console.error('Failed to send transaction due to error: ' + err.stack ? err
                .stack : err);
            return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
                err;
        });

    },
    
    invoke_iTransferItem: function(req, res){
        console.log("in controller TransferItem!!!");
        
        var array = req.params.aloTransfer.split(",");
        console.log(array)
        
        var ItemID = array[0]; var OwnerID = array[1];
        var AES_Key = array[2]; var NewOwnerID = array[3];
        var RecType = array[4]; var TimeStamp = array[5];
        
        var NewAES_Key = AES_Key.replace(/slash/g,"\/");
        
        var options = {
            wallet_path: path.join(__dirname, './creds'),
            user_id: 'PeerAdmin',
            channel_id: 'mychannel',
            chaincode_id: 'auction',
            peer_url: 'grpc://localhost:7051',
            event_url: 'grpc://localhost:7053',
            orderer_url: 'grpc://localhost:7050'
        };

        var channel = {};
        var client = null;
        var targets = [];
        var tx_id = null;
        Promise.resolve().then(() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
        }).then((wallet) => {
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            return client.getUserContext(options.user_id, true);
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            var peerObj = client.newPeer(options.peer_url);
            channel.addPeer(peerObj);
            channel.addOrderer(client.newOrderer(options.orderer_url));
            targets.push(peerObj);
            return;
        }).then(() => {
            tx_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", tx_id._transaction_id);
            // createCar - requires 5 args, ex: args: ['CAR11', 'Honda', 'Accord', 'Black', 'Tom'],
            // changeCarOwner - requires 2 args , ex: args: ['CAR10', 'Barry'],
            // send proposal to endorser
            var request = {
                targets: targets,
                chaincodeId: options.chaincode_id,
                fcn: 'iTransferItem',
                args: [ItemID,OwnerID,NewAES_Key,NewOwnerID,RecType,TimeStamp],
                chainId: options.channel_id,
                txId: tx_id
            };
            return channel.sendTransactionProposal(request);
        }).then((results) => {
            var proposalResponses = results[0];
            var proposal = results[1];
            var header = results[2];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                    proposalResponses[0].response.status, proposalResponses[0].response.message,
                    proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };
                // set the transaction listener and set a timeout of 30sec
                // if the transaction did not get committed within the timeout period,
                // fail the test
                var transactionID = tx_id.getTransactionID();
                var eventPromises = [];
                let eh = client.newEventHub();
                eh.setPeerAddr(options.event_url);
                eh.connect();

                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        eh.disconnect();
                        reject();
                    }, 30000);

                    eh.registerTxEvent(transactionID, (tx, code) => {
                        clearTimeout(handle);
                        eh.unregisterTxEvent(transactionID);
                        eh.disconnect();

                        if (code !== 'VALID') {
                            console.error(
                                'The transaction was invalid, code = ' + code);
                            reject();
                        } else {
                            console.log(
                                'The transaction has been committed on peer ' +
                                eh._ep._endpoint.addr);
                            resolve();
                        }
                    });
                });
                eventPromises.push(txPromise);
                var sendPromise = channel.sendTransaction(request);
                return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
                    console.log(' event promise all complete and testing complete');
                    return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
                }).catch((err) => {
                    console.error(
                        'Failed to send transaction and get notifications within the timeout period.'
                    );
                    return 'Failed to send transaction and get notifications within the timeout period.';
                });
            } else {
                console.error(
                    'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
                );
                return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            }
        }, (err) => {
            console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
                err);
            return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
                err;
        }).then((response) => {
            if (response.status === 'SUCCESS') {
                res.send(tx_id.getTransactionID());
                console.log('Successfully sent transaction to the orderer.');
                return tx_id.getTransactionID();
            } else {
                res.send("Could not TransferItem!");
                console.error('Failed to order the transaction. Error code: ' + response.status);
                return 'Failed to order the transaction. Error code: ' + response.status;
            }
        }, (err) => {
            res.send("Could not TransferItem!!");
            console.error('Failed to send transaction due to error: ' + err.stack ? err
                .stack : err);
            return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
                err;
        });
    }

}
})();