// components/ui/icon-symbol.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleProp, TextStyle } from "react-native";

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Ionicons name={name as any} size={size} color={color} style={style} />
  );
}
