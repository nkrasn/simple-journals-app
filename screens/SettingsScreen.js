import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OptionsModal from '../shared/OptionsModal.js';
import PinEntry from '../shared/PinEntry.js';
import * as SecureStore from 'expo-secure-store';

export default function SettingsScreen({navigation})
{
    const [showPinEntry, setShowPinEntry] = useState(false);
    /*
        Pin setting stages:
        0: verify current pin if one exists
        1: set new pin
        2: verify new pin
     */
    const [pinSetStage, setPinSetStage] = useState(1);
    const [pinSetHeader, setPinSetHeader] = useState("no message yet");
    const [newPin, setNewPin] = useState('9999');

    const showPinCodeSetter = async () => {

        //alert(navigation.getParam('color'));
        let savedPinCode = await SecureStore.getItemAsync('pin');
        if(savedPinCode !== null)
        {
            setPinSetHeader("Enter your current pin to continue");
            setPinSetStage(0);
        }
        else
        {
            setPinSetHeader("Enter the pin you want to use");
            setPinSetStage(1);
        }
        setShowPinEntry(true);
    };

    const onVerifyOldPin = (pinEntered, pinRef) => {
        setPinSetHeader("Enter your new pin");
        pinRef.current.clearAll();
        setPinSetStage(1);
    }

    const onPinEnter = async (pinEntered, pinRef) => {
        //setShowPinEntry(false);
        switch(pinSetStage)
        {
            case 1:
                setPinSetHeader("Enter your new pin again to verify");
                setNewPin(pinEntered);
                pinRef.current.clearAll();
                setPinSetStage(2);
                break;
            case 2:
                if(pinEntered === newPin)
                {
                    await SecureStore.setItemAsync('pin', newPin);
                    setShowPinEntry(false);
                }
                else
                {
                    setPinSetHeader("Pin did not match, try again or restart");
                    pinRef.current.clearAll();
                }
                break;
            default:
                alert("unknown stage");
                setPinSetStage(0);
                break;
        }
        //alert("okay");
    }

    return (
        <View>
            <OptionsModal
                visible={showPinEntry}
                closeModal={() => setShowPinEntry(false)}
            >
                <PinEntry 
                    header={pinSetHeader}
                    success={onVerifyOldPin}
                    submit={onPinEnter}
                    requireSubmit={pinSetStage !== 0}
                />
            </OptionsModal>
            <ScrollView>
                <Button
                    title="Set pin code"
                    onPress={showPinCodeSetter}
                />
            </ScrollView>
        </View>
    );
}