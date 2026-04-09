import React from "react";
import { View, Text, Image } from "react-native";

export default function Header() {
  return (
    <View style={{ alignItems: "center", marginTop: 40 }}>
      <Image
       source={require("../../assets/logo.png")}
        style={{ width: 80, height: 80 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 10 }}>
        My Health Guide
      </Text>
    </View>
  );
}