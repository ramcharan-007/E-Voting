import web3 from './web3';
import ElectionFactory from './builds/ElectionFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(ElectionFactory.abi),
    '0x014d07ca5c324485F55296ccdBFc68bcFdfEc963'
);