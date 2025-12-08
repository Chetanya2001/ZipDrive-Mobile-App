import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function Step4Features({ onNext, onBack }: any) {
  const [features, setFeatures] = useState("");

  return (
    <View style={{ marginTop: 20 }}>
      <TextInput
        placeholder="Features (comma separated)"
        style={styles.input}
        value={features}
        onChangeText={setFeatures}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.back} onPress={onBack}>
          <Text>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => onNext({ features: features.split(",") })}
        >
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
  row: { flexDirection: "row", gap: 10 },
  back: { padding: 15 },
  btn: { backgroundColor: "black", padding: 15, borderRadius: 8 },
  btnText: { color: "white" },
});
