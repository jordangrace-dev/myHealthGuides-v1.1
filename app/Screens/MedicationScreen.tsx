import React from "react";
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { DEFAULT_MEDS } from "../../lib/defaultMeds";

type Medication = {
  name: string;
  dose: string;
  instruction: string;
  doses: {
    time: string;
    status: string;
    notes: never[];
    showNotes: boolean;
  }[];
  reminderOn: boolean;
  reminderTime: string;
  showPreview: boolean;
};

type MedicationScreenProps = {
  meds: Medication[];
  setMeds: React.Dispatch<React.SetStateAction<Medication[]>>;
};

export default function MedicationScreen({ meds, setMeds }: MedicationScreenProps) {
const [newName, setNewName] = React.useState("");
const [newDose, setNewDose] = React.useState("");
const [newInstruction, setNewInstruction] = React.useState("");
const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Medications</Text>
      <Text style={styles.subtitle}>
        {meds.length} medication{meds.length !== 1 ? "s" : ""} tracked.
      </Text>
<TextInput
  style={styles.input}
  placeholder="Medication Name"
  value={newName}
  onChangeText={setNewName}
/>

<TextInput
  style={styles.input}
  placeholder="Dose (e.g., 10 mg)"
  value={newDose}
  onChangeText={setNewDose}
/>

<TextInput
  style={styles.input}
  placeholder="Instructions (e.g., Take once daily)"
  value={newInstruction}
  onChangeText={setNewInstruction}
/>
      <Button
        title="Add Medication"
onPress={() => {
  if (!newName.trim()) return;

  setMeds((prev) => [
    ...prev,
    {
      name: newName,
      dose: newDose,
      instruction: newInstruction,
      doses: [],
      reminderOn: false,
      reminderTime: "",
      showPreview: false,
    },
  ]);

  setNewName("");
  setNewDose("");
  setNewInstruction("");
}}
/>

     {meds.map((med, index) => (
  <View key={index} style={styles.medCard}>
    <Text style={styles.medName}>{med.name}</Text>
    <Text style={styles.medDetail}>Dose: {med.dose}</Text>
    <Text style={styles.medDetail}>Instruction: {med.instruction}</Text>

<TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
    setNewName(med.name);
    setNewDose(med.dose);
    setNewInstruction(med.instruction);
    setEditingIndex(index);
  }}
>

  <Text style={styles.deleteButtonText}>Edit</Text>
</TouchableOpacity>

   <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${med.name}?`
  );
  if (!confirmed) return;

  setMeds((prev) => prev.filter((_, i) => i !== index));
}}
>
  <Text style={styles.deleteButtonText}>Delete</Text>
</TouchableOpacity>
      </View>
    ))}
  </ScrollView>
);
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  deleteButton: {
  marginTop: 10,
  backgroundColor: "red",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  alignSelf: "flex-start",
},
deleteButtonText: {
  color: "white",
  fontWeight: "600",
  fontSize: 14,
},
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
  borderWidth: 1,
  borderColor: "ccc",
  borderRadius: 6,
  padding: 10,
  marginTop: 10,
  backgroundColor: "white",
},
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  medCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  medDetail: {
    fontSize: 14,
    color: "darkgray",
  },
});