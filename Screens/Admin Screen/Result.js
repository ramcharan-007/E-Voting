import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, get } from 'firebase/database';
import { db } from '../../Backend/config/config';

const ElectionResults = () => {
  const [electionResults, setElectionResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Fetch results from the "Result" node
        const resultsSnapshot = await get(ref(db, 'Result'));
        const resultsData = resultsSnapshot.val();

        if (resultsData) {
          // Flatten and group results by election ID
          const allResults = Object.entries(resultsData).map(([electionId, data]) => {
            const candidates = Object.entries(data.candidates).map(([name, details]) => ({
              name,
              voteCount: details.voteCount,
            }));

            // Find the candidate with the highest vote count
            const winner = candidates.reduce(
              (highest, candidate) =>
                candidate.voteCount > (highest?.voteCount || -1) ? candidate : highest,
              null
            );

            return {
              electionId,
              candidates,
              winner,
            };
          });

          setElectionResults(allResults); // Update the state with the fetched results
        } else {
          setElectionResults([]); // No results available
        }
      } catch (error) {
        console.error('Error fetching election results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Election Results</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Loading indicator
      ) : electionResults.length === 0 ? (
        <Text>No results available.</Text>
      ) : (
        electionResults.map((result) => (
          <View key={result.electionId} style={styles.electionBlock}>
            <Text style={styles.electionHeader}>
              Election ID: {result.electionId}
            </Text>

            <Text style={styles.heading}>Candidates</Text>
            {result.candidates.map((candidate, index) => (
              <View key={index} style={styles.resultCard}>
                <Text style={styles.resultText}>
                  {candidate.name}: {candidate.voteCount} votes
                </Text>
              </View>
            ))}

            {result.winner && (
              <View style={styles.winnerCard}>
                <Text style={styles.winnerText}>
                  Winner: {result.winner.name} with {result.winner.voteCount} votes
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  electionBlock: {
    padding: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 10,
    width: '90%',
  },
  electionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultCard: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    margin: 10,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
  },
  winnerCard: {
    borderColor: 'gold',
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    backgroundColor: 'lightyellow',
  },
  winnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ElectionResults;
