import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import { hs, ms, vs } from "../../utils/responsive";

// Theme Colors
const COLORS = {
  background: "#0a1220",
  button: "#01d28e",
  buttonDark: "#2d3748",
  text: "#ffffff",
  textMuted: "#a0aec0",
  border: "#2d3748",
  iconBg: "#1a2332",
} as const;

// ============ COMPONENTS ============

// Header Component
const Header = ({ onBack }: { onBack: () => void }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Text style={styles.backIcon}>←</Text>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Trip Details</Text>
    <View style={styles.headerSpacer} />
  </View>
);

// Progress Bar Component
const ProgressBar = () => (
  <View style={styles.progressContainer}>
    <View style={styles.progressRow}>
      <Text style={styles.stepText}>Step 1 of 3</Text>
      <Text style={styles.stepLabel}>Car Selection</Text>
    </View>
    <View style={styles.progressBarBg}>
      <View style={styles.progressBarFill} />
    </View>
  </View>
);

// Location Input Component
const LocationInput = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <Text style={styles.inputIcon}>{icon}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  </View>
);

// Date Time Picker Component
const DateTimePicker = ({
  label,
  icon,
  value,
  onPress,
}: {
  label: string;
  icon: string;
  value: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.dateTimeContainer} onPress={onPress}>
    <Text style={styles.dateTimeIcon}>{icon}</Text>
    <Text style={styles.dateTimeValue}>{value}</Text>
  </TouchableOpacity>
);

// Toggle Option Component
const ToggleOption = ({
  title,
  subtitle,
  value,
  onValueChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => (
  <View style={styles.optionCard}>
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.border, true: COLORS.button }}
      thumbColor={COLORS.text}
      ios_backgroundColor={COLORS.border}
    />
  </View>
);

// ============ MAIN SCREEN ============
const ZipYourTrip = () => {
  const [pickupLocation, setPickupLocation] = React.useState(
    "San Francisco International Airport"
  );
  const [dropoffLocation, setDropoffLocation] = React.useState("");
  const [differentDropoff, setDifferentDropoff] = React.useState(false);
  const [pickupDate, setPickupDate] = React.useState("Aug 24, 2024");
  const [pickupTime, setPickupTime] = React.useState("10:00 AM");
  const [dropoffDate, setDropoffDate] = React.useState("Aug 27, 2024");
  const [dropoffTime, setDropoffTime] = React.useState("10:00 AM");
  const [insureTrip, setInsureTrip] = React.useState(false);
  const [driverRequired, setDriverRequired] = React.useState(false);

  const handleBack = () => console.log("Back");
  const handleSearch = () => console.log("Search");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Header onBack={handleBack} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>

          <LocationInput
            label="PICK-UP"
            icon="📍"
            placeholder="Enter pick-up location"
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              Drop-off at different location
            </Text>
            <Switch
              value={differentDropoff}
              onValueChange={setDifferentDropoff}
              trackColor={{ false: COLORS.border, true: COLORS.button }}
              thumbColor={COLORS.text}
              ios_backgroundColor={COLORS.border}
            />
          </View>

          {differentDropoff && (
            <LocationInput
              label="DROP-OFF"
              icon="📍"
              placeholder="Drop-off City or Airport"
              value={dropoffLocation}
              onChangeText={setDropoffLocation}
            />
          )}
        </View>

        {/* Schedule Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>

          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.inputLabel}>PICK-UP DATE</Text>
              <DateTimePicker
                label="PICK-UP DATE"
                icon="📅"
                value={pickupDate}
                onPress={() => console.log("Pick date")}
              />
            </View>

            <View style={styles.dateTimeColumn}>
              <Text style={styles.inputLabel}>TIME</Text>
              <DateTimePicker
                label="TIME"
                icon="🕐"
                value={pickupTime}
                onPress={() => console.log("Pick time")}
              />
            </View>
          </View>

          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.inputLabel}>DROP-OFF DATE</Text>
              <DateTimePicker
                label="DROP-OFF DATE"
                icon="📅"
                value={dropoffDate}
                onPress={() => console.log("Drop date")}
              />
            </View>

            <View style={styles.dateTimeColumn}>
              <Text style={styles.inputLabel}>TIME</Text>
              <DateTimePicker
                label="TIME"
                icon="🕐"
                value={dropoffTime}
                onPress={() => console.log("Drop time")}
              />
            </View>
          </View>
        </View>

        {/* Options Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options</Text>

          <ToggleOption
            title="Insure Trip"
            subtitle="Full coverage for $15/day"
            value={insureTrip}
            onValueChange={setInsureTrip}
          />

          <ToggleOption
            title="Driver Required"
            subtitle="Chauffeur service included"
            value={driverRequired}
            onValueChange={setDriverRequired}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingBottom: vs(30),
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: hs(20),
    paddingTop: vs(8),
    paddingBottom: vs(12),
  },

  backButton: {
    width: hs(40),
    height: hs(40),
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: ms(24),
    color: COLORS.text,
  },

  headerTitle: {
    fontSize: ms(20),
    fontWeight: "700",
    color: COLORS.text,
  },

  headerSpacer: {
    width: hs(40),
  },

  // Progress Bar
  progressContainer: {
    paddingHorizontal: hs(20),
    paddingBottom: vs(16),
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(8),
  },

  stepText: {
    fontSize: ms(14),
    fontWeight: "600",
    color: COLORS.text,
  },

  stepLabel: {
    fontSize: ms(14),
    color: COLORS.textMuted,
  },

  progressBarBg: {
    height: vs(4),
    backgroundColor: COLORS.border,
    borderRadius: hs(2),
    overflow: "hidden",
  },

  progressBarFill: {
    width: "33%",
    height: "100%",
    backgroundColor: COLORS.button,
    borderRadius: hs(2),
  },

  // Section
  section: {
    paddingHorizontal: hs(20),
    marginBottom: vs(24),
  },

  sectionTitle: {
    fontSize: ms(22),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: vs(16),
  },

  // Input Group
  inputGroup: {
    marginBottom: vs(16),
  },

  inputLabel: {
    fontSize: ms(11),
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: vs(8),
    letterSpacing: 0.5,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.buttonDark,
    borderRadius: hs(12),
    paddingHorizontal: hs(16),
    paddingVertical: vs(14),
  },

  inputIcon: {
    fontSize: ms(20),
    marginRight: hs(12),
  },

  input: {
    flex: 1,
    fontSize: ms(15),
    color: COLORS.text,
    padding: 0,
  },

  // Toggle Row
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(16),
  },

  toggleLabel: {
    fontSize: ms(15),
    color: COLORS.text,
  },

  // Date Time
  dateTimeRow: {
    flexDirection: "row",
    gap: hs(12),
    marginBottom: vs(16),
  },

  dateTimeColumn: {
    flex: 1,
  },

  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.buttonDark,
    borderRadius: hs(12),
    paddingHorizontal: hs(16),
    paddingVertical: vs(14),
  },

  dateTimeIcon: {
    fontSize: ms(20),
    marginRight: hs(12),
  },

  dateTimeValue: {
    fontSize: ms(15),
    color: COLORS.text,
  },

  // Option Card
  optionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.buttonDark,
    borderRadius: hs(12),
    paddingHorizontal: hs(16),
    paddingVertical: vs(16),
    marginBottom: vs(12),
  },

  optionTextContainer: {
    flex: 1,
    marginRight: hs(12),
  },

  optionTitle: {
    fontSize: ms(15),
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: vs(4),
  },

  optionSubtitle: {
    fontSize: ms(13),
    color: COLORS.textMuted,
  },

  // Search Button
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.button,
    marginHorizontal: hs(20),
    marginTop: vs(8),
    paddingVertical: vs(16),
    borderRadius: hs(12),
  },

  searchIcon: {
    fontSize: ms(20),
    marginRight: hs(8),
  },

  searchText: {
    fontSize: ms(17),
    fontWeight: "700",
    color: COLORS.background,
  },
});

export default ZipYourTrip;
