import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

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

export default function MedicationScreen({
  meds,
  setMeds,
}: MedicationScreenProps) {
  const [newName, setNewName] = React.useState("");
  const [newDose, setNewDose] = React.useState("");
  const [newInstruction, setNewInstruction] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Medications</Text>
      <Text style={styles.subtitle}>
        {meds.length} medication{meds.length !== 1 ? "s" : ""} tracked.
      </Text>

<TouchableOpacity
  style={styles.primaryButton}
  onPress={() => {
    setShowForm(true);
    setEditingIndex(null);
    setNewName("");
    setNewDose("");
    setNewInstruction("");
  }}
>
  <Text style={styles.primaryButtonText}>Add Medication</Text>
</TouchableOpacity>
{showForm && (
  <>
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

   <TouchableOpacity
  style={styles.primaryButton}
  onPress={() => {
    if (!newName.trim()) return;

    setMeds((prev) => {
      if (editingIndex !== null) {
        return prev.map((item, i) =>
          i === editingIndex
            ? {
                ...item,
                name: newName,
                dose: newDose,
                instruction: newInstruction,
              }
            : item
        );
      }

      return [
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
      ];
    });

    setNewName("");
    setNewDose("");
    setNewInstruction("");
    setEditingIndex(null);
    setShowForm(false);
  }}
>
  <Text style={styles.primaryButtonText}>
    {editingIndex !== null ? "Save Changes" : "Save Medication"}
  </Text>
</TouchableOpacity>
  </>
)}

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
              setShowForm(true);
            }}
          >
            <Text style={styles.deleteButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
    Alert.alert(
      "Delete Medication",
      `Are you sure you want to delete ${med.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMeds((prev) => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
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
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
    backgroundColor: "white",
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
  medName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  medDetail: {
    fontSize: 14,
    color: "darkgray",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "lightsalmon",
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
  primaryButton: {
  backgroundColor: "#A67B5B", // light sienna tone
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: "center",
  alignSelf: "flex-start",
  marginTop: 10,
},

primaryButtonText: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "600",
},
});