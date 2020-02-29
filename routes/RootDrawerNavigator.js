import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import journalStack from './JournalStack.js';
import settingsStack from './SettingsStack.js';
import DebugScreen from '../screens/DebugScreen.js';

const rootDrawerNavigation = createDrawerNavigator({
    Journals: {
        screen: journalStack
    },
    Settings: {
        screen: settingsStack
    },
    Debug: {
        screen: DebugScreen
    }
});

export default createAppContainer(rootDrawerNavigation);