import { createStackNavigator } from "@react-navigation/stack";
import HostedCarsScreen from "./index";
import CarDetailsScreen from "../../screens/car-details"; // ✅ add this

const Stack = createStackNavigator();

export default function HostedCarsLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={HostedCarsScreen} />

      <Stack.Screen name="car-details" component={CarDetailsScreen} />

      <Stack.Screen
        name="add-car"
        component={require("./add-car/index").default}
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack.Navigator>
  );
}
