import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
const STORAGE_KEY = 'MY_HEALTH_GUIDE_MEDICATIONS';

type Medication = {
  id: string;
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
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

React.useEffect(() => {
  const loadMedications = async () => {
    try {
      const storedMeds = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMeds) {
        setMeds(
  JSON.parse(storedMeds).map((med: any, index: number) => ({
    ...med,
    id: med.id ?? `${Date.now()}-${index}`,
  }))
);
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  loadMedications();
}, []);


React.useEffect(() => {
  if (!isLoaded) return;

  const saveMedications = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(meds)
      );
    } catch (error) {
      console.error('Error saving medications:', error);
    }
  };

  saveMedications();
}, [meds, isLoaded]);

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
    setEditingId(null);
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
    if (editingId !== null) {
  return prev.map((item) =>
    item.id === editingId
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
    id: Date.now().toString(),
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
    setEditingId(null);
    setShowForm(false);
  }}
>
  <Text style={styles.primaryButtonText}>
    {editingId !== null ? "Save Changes" : "Save Medication"}
  </Text>
</TouchableOpacity>
  </>
)}

     {meds.map((med, index) => (
  <View key={med.id} style={styles.medCard}>
          <Text style={styles.medName}>{med.name}</Text>
          <Text style={styles.medDetail}>Dose: {med.dose}</Text>
          <Text style={styles.medDetail}>Instruction: {med.instruction}</Text>

        <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => {
    setNewName(med.name);
    setNewDose(med.dose);
    setNewInstruction(med.instruction);
    setEditingId(med.id);
    setShowForm(true);
  }}
>
  <Text style={styles.deleteButtonText}>Edit</Text>
</TouchableOpacity>

     <TouchableOpacity
  style={styles.deleteButton}
  activeOpacity={0.7}
onPress={() => {
  setMeds((prev) => prev.filter((item) => item.id !== med.id));
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
  zIndex: 1,
  elevation: 1, // For Android
},
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  primaryButton: {
  backgroundColor: "light sienna", // light sienna tone
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: "center",
  alignSelf: "flex-start",
  marginTop: 10,
},

primaryButtonText: {
  color: "White",
  fontSize: 14,
  fontWeight: "600",
},
});