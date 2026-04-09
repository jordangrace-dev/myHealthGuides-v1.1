import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SignalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signals</Text>
      <Text style={styles.subtitle}>
        This is where daily signals will go.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});