'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Enroll the admin user
 */

//module.exports = (function(){
//return{
//    enrollAdmin: function(req,res){
        var Fabric_Client = require('fabric-client');
        var Fabric_CA_Client = require('fabric-ca-client');//Client for communciating with the Fabric CA APIs

        var path = require('path');
        var util = require('util');
        var os = require('os');

        //
        var fabric_client = new Fabric_Client();
        var fabric_ca_client = null;
        var admin_user = null;
        var member_user = null;
        var store_path = path.join(__dirname, 'hfc-key-store');
        console.log(' Store path:'+store_path);

        // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
        Fabric_Client.newDefaultKeyValueStore({ path: store_path
        }).then((state_store) => {
            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);
            var	tlsOptions = {
                trustedRoots: [],//Array of PEM-encoded trusted root certificates
                verify: false//Determines whether or not to verify the server certificate when using TLS
            };
            // be sure to change the http to https when the CA is running TLS enabled
            //protocol hostname tlsoptions caname
            fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', tlsOptions , 'ca.example.com', crypto_suite);

            // first check to see if the admin is already enrolled
            return fabric_client.getUserContext('admin2', true);
        }).then((user_from_store) => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log('Successfully loaded admin from persistence');
                admin_user = user_from_store;
                return null;
            } else {
                // need to enroll it with CA server
                return fabric_ca_client.enroll({//Enroll a registered user in order to receive a signed X509 certificate
                  enrollmentID: 'admin2',//The registered ID to use for enrollment
                  enrollmentSecret: 'adminpw'//The secret associated with the enrollment ID
                }).then((enrollment) => {
                  console.log('Successfully enrolled admin user "admin"');
                  return fabric_client.createUser(
                      {username: 'admin2',
                          mspid: 'Org1MSP',
                          cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }//the private key and certificate
                      });//Returns: Promise for the user object.
                }).then((user) => {
                  admin_user = user;
                  return fabric_client.setUserContext(admin_user);//Sets an instance of the User class as the security context of this client instance.
                }).catch((err) => {
                  console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
                  throw new Error('Failed to enroll admin');
                });
            }
        }).then(() => {
            console.log('Assigned the admin user to the fabric client ::' + admin_user.toString());
        }).catch((err) => {
            console.error('Failed to enroll admin: ' + err);
        });
 //   }
    
//}
//})();