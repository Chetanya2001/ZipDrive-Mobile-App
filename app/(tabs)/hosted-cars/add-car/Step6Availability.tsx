import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function Step6Availability({ onNext, onBack }: any) {
  const [data, setData] = useState({
    availableFrom: "",
    availableTo: "",
    pricePerDay: "",
  });

  return (
    <View style={{ marginTop: 20 }}>
      <TextInput
        placeholder="Available From"
        style={styles.input}
        value={data.availableFrom}
        onChangeText={(v) => setData({ ...data, availableFrom: v })}
      />
      <TextInput
        placeholder="Available To"
        style={styles.input}
        value={data.availableTo}
        onChangeText={(v) => setData({ ...data, availableTo: v })}
      />
      <TextInput
        placeholder="Price Per Day"
        style={styles.input}
        value={data.pricePerDay}
        onChangeText={(v) => setData({ ...data, pricePerDay: v })}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.back} onPress={onBack}>
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => onNext(data)}>
          <Text style={styles.btnText}>Finish</Text>
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
