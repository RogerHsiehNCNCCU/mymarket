import shim = require('fabric-shim');
import { MyMarket } from './MyMarket';

// TODO maybe we can do some setup stuff here
// My Chaincode is moved to seperate file for testing
shim.start(new MyMarket());
