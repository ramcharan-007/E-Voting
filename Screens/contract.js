import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ethers } from 'ethers';

const ElectionContractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your actual contract address

const Election = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [winner, setWinner] = useState('');

  useEffect(() => {
    const connectToEthereum = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const accounts = await provider.listAccounts();
          const electionContract = new ethers.Contract(
            ElectionContractAddress,
            ['function vote(bytes candidateName) public onlyEligibleVoters(voter)'],
            signer
          );

          setContract(electionContract);
          setAccount(accounts[0]);

          // Optional: You may want to listen for events or fetch other data here
          const result = await electionContract.getResult();
          setWinner(result);
        } catch (error) {
          console.error('Error connecting to Ethereum:', error.message);
        }
      } else {
        console.error('MetaMask not detected');
      }
    };

    connectToEthereum();
  }, []);

  const voteForCandidate = async (candidateName) => {
    try {
      // Call the vote function on the smart contract
      const transaction = await contract.vote(account, candidateName);
      await transaction.wait();

      // Update winner after the vote
      const result = await contract.getResult();
      setWinner(result);
    } catch (error) {
      console.error('Error voting:', error.message);
    }
  };

  return (
    <View>
      <Text>{`Connected Account: ${account}`}</Text>
      <Text>{`Winner: ${winner}`}</Text>
      <TouchableOpacity onPress={() => voteForCandidate('Candidate1')}>
        <Text>Vote for Candidate1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => voteForCandidate('Candidate2')}>
        <Text>Vote for Candidate2</Text>
      </TouchableOpacity>
      {/* Add more buttons for other candidates as needed */}
    </View>
  );
};

export default Election;
