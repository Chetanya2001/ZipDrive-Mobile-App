import { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Step5Images({ onNext, onBack }: any) {
  const [images, setImages] = useState<string[]>([]);

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled) {
      setImages([...images, res.assets[0].uri]);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <TouchableOpacity style={styles.uploadBtn} onPress={pick}>
        <Text>Select Image</Text>
      </TouchableOpacity>

      {images.map((img, i) => (
        <Image key={i} source={{ uri: img }} style={styles.img} />
      ))}

      <View style={styles.row}>
        <TouchableOpacity style={styles.back} onPress={onBack}>
          <Text>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => onNext({ images })}>
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadBtn: {
    padding: 14,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 12,
  },
  img: { width: "100%", height: 150, marginVertical: 10, borderRadius: 8 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  back: { padding: 15 },
  btn: { backgroundColor: "black", padding: 15, borderRadius: 8 },
  btnText: { color: "white" },
});
