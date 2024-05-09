const HDWalletProvider = require('@truffle/hdwallet-provider');
const {Web3} = require('web3'); // Use 'Web3' instead of '{Web3}'
const compiledElection = require('./builds/ElectionFactory.json');
const { stringify } = require('querystring');

const provider = new HDWalletProvider(
    'stone thrive bacon twenty badge stomach power pony retreat pair friend token',
    'http://127.0.0.1:8545'
);

const web3 = new Web3(provider);
const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();

        console.log('Attempting to deploy from account', accounts[0]);
        
        const result = await new web3.eth.Contract(
            compiledElection.abi
        )
            .deploy({
                data: compiledElection.evm.bytecode.object,
                arguments: [
                    [
                        "0x616c696365000000000000000000000000000000000000000000000000000000",
                        "0x626f620000000000000000000000000000000000000000000000000000000000"
                    ],
                    [
                        '0x223ec760F6d59062B3ba0344fD78C80221330422',
                        '0x22eD96dC2E00A9cc71bd87ac379eFd82D9218bAE',
                        '0x7Dbd3aa1Bc32113f6159aF46778896a325Cb465D'
                    ]
                ]
            })
            .send({
                gas: '3000000', // Increased gas limit
                from: accounts[0],
                gasPrice: '30000000000' // Increased gas price
            });

        console.log('Contract deployed to', result.options.address);
    } catch (error) {
        console.error('Error deploying contract:', error);
    }
};

deploy();