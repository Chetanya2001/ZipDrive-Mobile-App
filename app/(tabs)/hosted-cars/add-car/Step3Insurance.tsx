import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function Step3Insurance({ onNext, onBack }: any) {
  const [data, setData] = useState({
    insuranceNumber: "",
    insuranceExpiry: "",
  });

  return (
    <View style={{ marginTop: 20 }}>
      <TextInput
        placeholder="Insurance Number"
        style={styles.input}
        value={data.insuranceNumber}
        onChangeText={(v) => setData({ ...data, insuranceNumber: v })}
      />
      <TextInput
        placeholder="Expiry (YYYY-MM-DD)"
        style={styles.input}
        value={data.insuranceExpiry}
        onChangeText={(v) => setData({ ...data, insuranceExpiry: v })}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.back} onPress={onBack}>
          <Text>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => onNext(data)}>
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
