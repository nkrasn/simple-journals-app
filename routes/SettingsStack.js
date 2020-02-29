import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import SettingsScreen from '../screens/SettingsScreen';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../styles/global.js';

const screens = {
    Settings: {
        screen: SettingsScreen,
        navigationOptions: ({navigation}) => {
            return {
                headerLeft: () => <MaterialIcons name='menu' size={28} onPress={()=>navigation.openDrawer()} style={globalStyles.burgerIcon}/>,
            };
        }
    }
};

const settingsStack = createStackNavigator(screens);
export default settingsStack;
