const assert = require('assert');
const ganache = require('ganache-core');
const { Web3 } = require('web3');
const compiledFactory = require('../Ethereum/builds/ElectionFactory.json');
const compiledElection = require('../Ethereum/builds/Election.json');

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let electionAddress; 
let election;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    console.log(compiledFactory.abi)
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000', gasPrice: '100000000' });

    console.log('Factory methods:', factory);
    console.log('Factory getAccounts method:', factory.getAccounts);

    await factory.methods.createElection(
        ["0x616c696365000000000000000000000000000000000000000000000000000000", "0x626f620000000000000000000000000000000000000000000000000000000000"],
        [
            accounts[3],
            accounts[4],
            accounts[5],
            accounts[6]
        ]
    ).send({
        from: accounts[0],
        gas: '1000000',
        gasPrice: '100000000'
    });
    console.log('here')

    const addresses = await factory.methods.getDeployedElections().call();
    console.log(JSON.parse(addresses))
    electionAddress = addresses[0];
    console.log(electionAddress)
    election = await new web3.eth.Contract(
        JSON.parse(compiledElection.interface),
        electionAddress
    );

    console.log('Accounts:', accounts);
    console.log('Election:', election);
    console.log('Factory:', factory);
    console.log('Election Address:', electionAddress);
});

describe('ElectionFactory', () => {
    it('deploys a factory and an election', () => {
        console.log('Election:', election);
        console.log('Factory:', factory);
        // assert.ok(election.options.address);
        // assert.ok(factory.options.address);
    });
});