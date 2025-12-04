import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface CollapsibleProps extends PropsWithChildren {
  title: string;
  style?: ViewStyle;
}

export function Collapsible({ children, title, style }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "light" ? Colors.light.icon : Colors.dark.icon;

  return (
    <ThemedView style={style}>
      <TouchableOpacity
        style={styles.heading}
        activeOpacity={0.8}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <IconSymbol
          name="chevron-forward" // Ionicons name
          size={18}
          color={iconColor}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>

      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
