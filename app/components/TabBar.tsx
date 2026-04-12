import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Screen } from "../../types";
import { COLORS } from "../../lib/colors";

type TabItem = {
  key: Screen;
  label: string;
};

type TabBarProps = {
  active: Screen;
  onPress: (screen: Screen) => void;
  tabs: TabItem[];
};

const TabBar: React.FC<TabBarProps> = ({ active, onPress, tabs }) => {
  const icons: Record<Screen, string> = {
    home: "⌂",
    signals: "◎",
    insight: "✦",
    medications: "✚",
    visit: "✉",
  };

  return (
    <View style={tabStyles.bar}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={tabStyles.tabItem}
            onPress={() => onPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[tabStyles.icon, isActive && tabStyles.active]}>
              {icons[tab.key]}
            </Text>
            <Text style={[tabStyles.label, isActive && tabStyles.active]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.warmGrey100,
    backgroundColor: COLORS.warmWhite,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  icon: {
    fontSize: 20,
    color: COLORS.warmGrey200,
  },
  label: {
    fontSize: 12,
    color: COLORS.warmGrey200,
    marginTop: 2,
  },
  active: {
    color: COLORS.sage,
    fontWeight: "600",
  },
});

export default TabBar;