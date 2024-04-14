import web3 from './web3';
import ElectionFactory from './builds/ElectionFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(ElectionFactory.abi),
    '0x3bBE21Ae49190eA6053c0cACB02BD99628af92E4'
);