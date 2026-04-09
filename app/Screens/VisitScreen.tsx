import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VisitScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visit Prep</Text>
      <Text style={styles.subtitle}>
        This is where visit questions and prep will go.
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