import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import AboutUsScreen from '../screens/AboutUsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        
        <Stack.Screen 
          name="AboutUs" 
          component={AboutUsScreen}
          options={{
            headerShown: true,
            title: 'About Us'
          }}
        />

        <Stack.Screen 
          name="Profile"
          component={AboutUsScreen} 
          options={{
            headerShown: true,
            title: 'Profile'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}