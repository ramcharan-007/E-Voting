const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'builds');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'Election.sol');

const source = fs.readFileSync(contractPath, 'utf-8');
const input = {
    language: 'Solidity',
    sources: {
        'Election.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
if (output.errors) {
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
    });
    process.exit(1);
}

fs.ensureDirSync(buildPath);
const contract = output.contracts['Election.sol']
for (let contractFileName in contract) {
    const ans = contract[contractFileName];

    fs.outputJsonSync(
        path.resolve(buildPath, contractFileName + '.json'),ans
    );
}
