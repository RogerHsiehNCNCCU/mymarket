import shim = require('fabric-shim');
import { MyChaincode } from './MyChaincode';

// TODO maybe we can do some setup stuff here
// My Chaincode is moved to seperate file for testing
shim.start(new MyChaincode());
