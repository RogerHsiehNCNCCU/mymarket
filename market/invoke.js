'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode Invoke
 */

var Fabric_Client = require('fabric-client');
var path = require('path');//The Path module provides a way of working with directories and file paths.
var util = require('util');
var os = require('os');//The OS module provides information about the computer's operating system.

//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');//Returns a Channel instance with the given name. 
var peer = fabric_client.newPeer('grpc://localhost:7051');//Returns a Peer object with the given url and opts.
channel.addPeer(peer);//Add the peer object to the channel object. A channel object can be optionally configured with a list of peer objects
var order = fabric_client.newOrderer('grpc://localhost:7050');
channel.addOrderer(order);//Add the orderer object to the channel object, this is a client-side-only operation.

var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;

//Obtains an instance of the KeyValueStore class. By default it returns the built-in implementation, which is based on files (FileKeyValueStore).
//Abstract class for a Key-Value store. The Channel class uses this store to save sensitive information such as authenticated user's private keys, certificates, etc. 
// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	// assign the store to the fabric client //Set an optional state store to persist application states.
    //The SDK supports persisting the User objects so that the heavy-weight objects such as the certificate and private keys do not have to be passed in repeatedly.
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();//It returns a new instance of the CryptoSuite API implementation
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);//Set the cryptoKeyStore. When the application needs to use a key store other than the default, it should use the Client newCryptoKeyStore to create an instance and use this function to set the instance on the CryptoSuite.
	fabric_client.setCryptoSuite(crypto_suite);//Sets the client instance to use the CryptoSuite object for signing and hashing Creating and setting a CryptoSuite is optional because the client will construct an instance based on default configuration settings:

	// get the enrolled user from persistence, this user will sign all requests
	return fabric_client.getUserContext('user1', true);//Returns the user by the given name. //Returns: Promise for the user object corresponding to the name
}).then((user_from_store) => {
    //User.isEnrolled(): Determine if this name has been enrolled.
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user1 from persistence');
		member_user = user_from_store;
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
	}

	// get a transaction id object based on the current user assigned to fabric client
	tx_id = fabric_client.newTransactionID();//Returns a new TransactionID object. Fabric transaction ids are constructed as a hash of a nonce concatenated with the signing identity's serialized bytes. The TransactionID object keeps the nonce and the resulting id string bundled together as a coherent pair. 
	console.log("Assigning transaction_id: ", tx_id._transaction_id);

	// createCar chaincode function - requires 5 args, ex: args: ['CAR12', 'Honda', 'Accord', 'Black', 'Tom'],
	// changeCarOwner chaincode function - requires 2 args , ex: args: ['CAR10', 'Dave'],
	// must send the proposal to endorsing peers
	var request = {
		//targets: let default to the peer assigned to the client
		chaincodeId: 'market',
		fcn: 'createUser',//The function name to be returned when calling stub.GetFunctionAndParameters() in the target chaincode.
		args: ['User1','Peng','0911-123-456'],//An array of string arguments specific to the chaincode's 'Invoke' method
		chainId: 'mychannel',
		txId: tx_id
	};

	// send the transaction proposal to the peers
	return channel.sendTransactionProposal(request);//Sends a transaction proposal to one or more endorsing peers. 
}).then((results) => {
	var proposalResponses = results[0];//Array of ProposalResponse objects from the endorsing peers
	var proposal = results[1];//The original Proposal object needed when sending the transaction request to the orderer
	let isProposalGood = false;
	if (proposalResponses && proposalResponses[0].response &&
		proposalResponses[0].response.status === 200) {
			isProposalGood = true;
			console.log('Transaction proposal was good');
			console.log('watch proposal response!');
			console.log(proposalResponses);
		} else {
			console.error('Transaction proposal was bad');
		}
	if (isProposalGood) {
		console.log(util.format(
			'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			proposalResponses[0].response.status, proposalResponses[0].response.message));

		// build up the request for the orderer to have the transaction committed
		var request = {
			proposalResponses: proposalResponses,
			proposal: proposal
		};

		// set the transaction listener and set a timeout of 30 sec
		// if the transaction did not get committed within the timeout period,
		// report a TIMEOUT status
		var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
		var promises = [];

		var sendPromise = channel.sendTransaction(request);//Send the proposal responses that contain the endorsements of a transaction proposal to the orderer for further processing. This is the 2nd phase of the transaction lifecycle in the fabric.
		promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

		// get an eventhub once the fabric client has a user assigned. The user
		// is required bacause the event registration must be signed
		let event_hub = fabric_client.newEventHub();//Returns an EventHub object. An event hub object encapsulates the properties of an event stream on a peer node
		event_hub.setPeerAddr('grpc://localhost:7053');//Set peer event source url.

		// using resolve the promise so that result status may be processed
		// under the then clause rather than having the catch clause process
		// the status
		let txPromise = new Promise((resolve, reject) => {
			let handle = setTimeout(() => {
				event_hub.disconnect();
				resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			}, 3000);
			event_hub.connect();//Establishes a connection with the peer event source. 
            //Register a callback function to receive a notification when the transaction by the given id has been committed into a block. //Integer code denoting the type of message
			event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
				// this is the callback for transaction event status
				// first some clean up of event listener
				clearTimeout(handle);
				event_hub.unregisterTxEvent(transaction_id_string);//Unregister transaction event listener for the transaction id.
				event_hub.disconnect();//Disconnects the event hub from the peer event source.

				// now let the application know what happened
				var return_status = {event_status : code, tx_id : transaction_id_string};
				if (code !== 'VALID') {
					console.error('The transaction was invalid, code = ' + code);
					resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
				} else {
					console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
					resolve(return_status);
				}
			}, (err) => {
				//this is the callback if something goes wrong with the event registration or processing
				reject(new Error('There was a problem with the eventhub ::'+err));
			});
		});
		promises.push(txPromise);

		return Promise.all(promises);//參數可放入array等iterable物件，全部完成後才會接著下個then方法，實現完成後，then接收到的是陣列值
	} else {
		console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
	}
}).then((results) => {
	console.log('Send transaction promise and event listener promise have completed');
	// check the results in the order the promises were added to the promise all list
	if (results && results[0] && results[0].status === 'SUCCESS') {
		console.log('Successfully sent transaction to the orderer.');
		console.log('watch me!');
		console.log(results);
		return results[0];
	} else {
		console.error('Failed to order the transaction. Error code: ' + response.status);
	}

	if(results && results[1] && results[1].event_status === 'VALID') {
		console.log('Successfully committed the change to the ledger by the peer');
	} else {
		console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
	}
}).catch((err) => {
	console.error('Failed to invoke successfully :: ' + err);
});
