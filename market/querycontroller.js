'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Hyperledger Fabric Sample Query Program
 */

var express = require('express');

var hfc = require('fabric-client');
var path = require('path');

var util = require('util');
var os = require('os');

module.exports = (function(){
return{
    
    query_queryAllDatas: function(req, res){
        console.log("controller queryAllDatas: ");
        
        var options = {
            wallet_path: path.join(__dirname, './hfc-key-store'),
            user_id: 'user1',
            channel_id: 'mychannel',
            chaincode_id: 'market',
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

        var crypto_suite = hfc.newCryptoSuite();
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = hfc.newCryptoKeyStore({path: options.wallet_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        client.setCryptoSuite(crypto_suite);

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
            fcn: 'queryAllDatas',
            args: ['']
        };
        return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log("returned from query");
        if (!query_responses.length) {
            res.send("Could not queryAllDatas");
            console.log("No payloads were returned from query");
        } else {
            console.log("Query result count = ", query_responses.length)
        }
        if (query_responses[0] instanceof Error) {
            res.send("Could not queryAllDatas");
            console.error("error from query = ", query_responses[0]);
        }
        //return response!!!
        console.log("Response is ", query_responses[0].toString());
        res.json(JSON.parse(query_responses[0].toString()));
        }).catch((err) => {
            console.error("Caught Error", err);
        });
    },
    
    query_queryData_Data1: function(req, res){
        console.log("controller queryData_Data1: ");
        
        var options = {
            wallet_path: path.join(__dirname, './hfc-key-store'),
            user_id: 'user1',
            channel_id: 'mychannel',
            chaincode_id: 'market',
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

        var crypto_suite = hfc.newCryptoSuite();
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = hfc.newCryptoKeyStore({path: options.wallet_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        client.setCryptoSuite(crypto_suite);

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
            fcn: 'queryData',
            args: ['Data1']
        };
        return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log("returned from query");
        if (!query_responses.length) {
            res.send("Could not queryAllDatas");
            console.log("No payloads were returned from query");
        } else {
            console.log("Query result count = ", query_responses.length)
        }
        if (query_responses[0] instanceof Error) {
            res.send("Could not queryAllDatas");
            console.error("error from query = ", query_responses[0]);
        }
        //return response!!!
        console.log("Response is ", query_responses[0].toString());
        res.json(JSON.parse(query_responses[0].toString()));
        }).catch((err) => {
            console.error("Caught Error", err);
        });
    },
    
    query_queryData_Spe: function(req, res){
		console.log("controller queryData_Spe: ");
        
        var DataKey = req.params.DataKey;
        
        var options = {
            wallet_path: path.join(__dirname, './hfc-key-store'),
            user_id: 'user1',
            channel_id: 'mychannel',
            chaincode_id: 'market',
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

        var crypto_suite = hfc.newCryptoSuite();
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = hfc.newCryptoKeyStore({path: options.wallet_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        client.setCryptoSuite(crypto_suite);

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
                fcn: 'queryData',
                args: [DataKey]
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

	}

}    
})();