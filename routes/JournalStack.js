import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Journals from '../screens/Journals.js';
import Pages from '../screens/Pages.js';
import Page from '../screens/Page.js';

import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../styles/global.js';
import Lock from '../shared/Lock.js';

const screens = {
    Journals: {
        screen: Journals,
        navigationOptions: ({navigation}) => {
            return {
                // headerTitle: () => <JournalsHeader navigation={navigation}/>,
                // headerTitleStyle: {width: '100%', flex: 1,}
                headerLeft: () => <MaterialIcons name='menu' size={28} onPress={()=>navigation.openDrawer()} style={globalStyles.burgerIcon}/>,
                headerRight: () => <Lock navigation={navigation}/>,
            };
        }
    },
    Pages: {
        screen: Pages,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('targetJournalName'),
                headerStyle: {
                    backgroundColor: navigation.getParam('color'),
                }
            };
        }
    },
    Page: {
        screen: Page,
        navigationOptions: {
            title: "",
        }
    }
};

const journalStack = createStackNavigator(screens);
export default journalStack;
