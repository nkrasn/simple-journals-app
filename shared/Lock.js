import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import OptionsModal from './OptionsModal.js';
import PinEntry from './PinEntry.js';
import * as SecureStore from 'expo-secure-store';

export default function Lock(props)
{
    const [lockIcon, setLockIcon] = useState('lock');
    const [showUnlocker, setShowUnlocker] = useState(false);
    const allowPrivateJournals = props.navigation.getParam("allowPrivateJournals");

    const onPress = async () => {
        const pin = await SecureStore.getItemAsync('pin');
        if(pin === null)
        {
            setLockIcon('lock');
            allowPrivateJournals(false);
            alert("No pin code has been made.\nCreate one in the settings page.");
            return;
        }

        if(lockIcon === 'lock')
        {
            setShowUnlocker(true);
        }
        else
        {
            Alert.alert(
                "Confirm",
                "Do you want to hide your private journals?",
                [
                    { text: 'Cancel', style: 'cancel', },
                    {
                        text: 'OK',
                        onPress: () => {
                            setLockIcon('lock');
                            allowPrivateJournals(false);
                        }
                    }
                ]
            );
        }
    };

    const success = () => {
        setShowUnlocker(false);
        setLockIcon('lock-open');
        allowPrivateJournals(true);
    };

    const isLocked = () => {
        return lockIcon === 'lock';
    }

    return (
        <View>
            <OptionsModal
                visible={showUnlocker}
                closeModal={() => setShowUnlocker(false)}
            >
                <PinEntry header="Enter your pin to unlock private journals" success={success}/>
            </OptionsModal>

            <MaterialIcons name={lockIcon} size={28} onPress={onPress} style={styles.lockIcon}/>
        </View>
    );
}

const styles = StyleSheet.create({
    lockIcon:
    {
        paddingRight: 20,
    },
});