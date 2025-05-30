import React from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AddGoalScreen from './screens/AddGoalScreen';
import { RootStackParamList } from './types';
import { GoalProvider } from './GoalContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ActionSheetProvider> 
      <GoalProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddGoal" component={AddGoalScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GoalProvider>
    </ActionSheetProvider>
  );
}
