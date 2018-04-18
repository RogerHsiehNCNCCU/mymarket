/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
//import { init, query } from './hlfClient.js';
var hlf = require('./hlfClient.js');

var semver = require('semver');
// Install chaincode on target peers

var path = require('path');
var util = require('util');
var os = require('os');

//logger.debug('==================== INSTALL CHAINCODE ==================');
console.debug('==================== INSTALL CHAINCODE ==================');
var peers = ['peer0.org1.example.com'];

var chaincodeName = 'market';
var chaincodePath = 'github.com/example_cc/node';
var chaincodeType = 'node';


hlf.init('mychannel', `grpc://localhost:7051`, `grpc://localhost:7050`, path.resolve(__dirname, '..', 'config', `creds`))
    .then(() => {
        return hlf.query('getVersion', 'market');
    })
    .then(version => {

    });

hlf.query('peer0.org1.example.com', 'mychannel', 'market', [], 'getVersion', 'jsmith', 'Org1')
    .then(version => {
        console.log(version.toString().replace('v', ''));
        const chaincodeVersion = `v${semver.inc(version.toString().replace('v', ''), 'patch')}`;

        console.log(`Installing version ${chaincodeVersion}`);

        Promise.all([
            hlf.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, 'jsmith', 'Org1'),
            hlf.installChaincode(peers2, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, 'Barry', 'Org2')
        ])
            .then(() => {
                console.log('UPGRADE');

                return hlf.install.upgradeChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, 'jsmith', 'Org1');
            }).then(() => {
            console.log('DONE');

        });
    });

