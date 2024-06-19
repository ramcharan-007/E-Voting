import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../Backend/config/config";

const ElectionResults = () => {
  const [electionResults, setElectionResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Fetch results from the "Result" node
        const resultsSnapshot = await get(ref(db, "Result"));
        const resultsData = resultsSnapshot.val();

        if (resultsData) {
          // Flatten and group results by election ID
          const allResults = Object.entries(resultsData).map(
            ([electionId, data]) => {
              const candidates = Object.entries(data.candidates).map(
                ([name, details]) => ({
                  name,
                  voteCount: details.voteCount,
                })
              );

              // Find the highest vote count
              const maxVoteCount = Math.max(
                ...candidates.map((candidate) => candidate.voteCount)
              );

              // Find all candidates with the highest vote count
              const topCandidates = candidates.filter(
                (candidate) => candidate.voteCount === maxVoteCount
              );

              // Determine the winner or if it's a draw
              const winner =
                topCandidates.length === 1 ? topCandidates[0] : null;
              const isDraw = topCandidates.length > 1;

              return {
                electionId,
                candidates,
                winner,
                isDraw,
              };
            }
          );

          setElectionResults(allResults); // Update the state with the fetched results
        } else {
          setElectionResults([]); // No results available
        }
      } catch (error) {
        console.error("Error fetching election results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.electionBlock}>
      <Text style={styles.electionHeader}>Election ID: {item.electionId}</Text>

      <Text style={styles.heading}>Candidates</Text>
      {item.candidates.map((candidate, index) => (
        <View key={index} style={styles.resultCard}>
          <Text style={styles.resultText}>
            {candidate.name}: {candidate.voteCount} votes
          </Text>
        </View>
      ))}

      {item.winner ? (
        <View style={styles.winnerCard}>
          <Text style={styles.winnerText}>
            Winner: {item.winner.name} with {item.winner.voteCount} votes
          </Text>
        </View>
      ) : (
        <View style={styles.drawCard}>
          <Text style={styles.winnerText}> Result will be announced later</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Election Results</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Loading indicator
      ) : (
        <View style={{ marginBottom: 10, flex: 1 }}>
          <FlatList
            data={electionResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.electionId}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={<Text>No results available.</Text>}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    margin: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  electionBlock: {
    padding: 20,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
  },
  electionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultCard: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    margin: 10,
  },
  resultText: {
    fontSize: 18,
    textAlign: "center",
  },
  winnerCard: {
    borderColor: "gold",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    backgroundColor: "lightyellow",
  },
  winnerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  drawCard: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    backgroundColor: "lightyellow",
  },
});

export default ElectionResults;
