import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import NewsView from "./View/NewsView";

const YourComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch(
        "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=cfdbbd1147b34611a5d5c4dd12c8de9b"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok. Status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((jsonData) => {
          setData(jsonData.articles);
          setisLoading(false);
        })
        .catch((error) => {
          setError(error.message || "An error occurred");
        });
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size={"large"}/>;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <NewsView
              author={item.author}
              description={item.description}
              imageUrl={`'${item.urlToImage}'`}
              title={item.title}
              content={item.content}
              url={item.url}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
};

export default YourComponent;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
