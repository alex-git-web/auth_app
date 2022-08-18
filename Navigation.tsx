import React from 'react';
import HomeScreen from './screens/Home/home_screen';
import LogInScreen from './screens/LogIn/logIn_screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

type RootStackParamList = {
    // HomeScreen: { itemId: number };
    HomeScreen: undefined;
    LogInScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Navigation:React.FC = () => {
  return ( 
    <NavigationContainer> 
        <RootStack.Navigator>
            <RootStack.Screen 
                name="HomeScreen" 
                component={HomeScreen} 
                // initialParams={{ itemId: 42 }} 
                options={{headerShown: false}}/>
            <RootStack.Screen 
                name="LogInScreen" 
                component={LogInScreen} 
                options={{headerShown: false}}/>
        </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation