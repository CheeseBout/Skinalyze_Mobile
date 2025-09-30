import { createStackNavigator } from "@react-navigation/stack";
import AboutUsScreen from "../screens/AboutUsScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;