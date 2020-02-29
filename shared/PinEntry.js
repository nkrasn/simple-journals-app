import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PinView from 'react-native-pin-view';
import * as SecureStore from 'expo-secure-store';

export default function PinEntry(props)
{
    const pinView = useRef(null);
    
    const [showFail, setShowFail] = useState(false);
    const [pinEntered, setPinEntered] = useState('');

    const pinLength = 4;

    const onValueChange = async (value) => {
        setPinEntered(value);
        
        // skip pin checking if you need to manually submit
        if(props.requireSubmit)
            return; 

        if(value.length === pinLength)
        {
            const pin = await SecureStore.getItemAsync('pin');

            if(value === pin)
            {
                props.success(value, pinView);
            }
            else
            {
                pinView.current.clearAll();
                setShowFail(true);
            }
        }
    };
    
    return (
        <View>
            <Text style={styles.pinHeader}>{props.header}</Text>
            <Text style={showFail && !props.requireSubmit ? styles.failVisible : styles.failInvisible}>Incorrect pin</Text>
            <PinView
                pinLength={pinLength}
                onValueChange={value => onValueChange(value)}
                ref={pinView}
                buttonTextStyle='#000'
                buttonSize={70}
                buttonViewStyle={{borderWidth: 1, borderColor: '#000'}}
                onButtonPress={key => {
                    if(key === 'custom_left')
                        pinView.current.clear();
                    if(key === 'custom_right' && props.requireSubmit && pinEntered.length === pinLength)
                        props.submit(pinEntered, pinView);
                }}
                customLeftButton={<MaterialIcons name="backspace" size={24}/>}
                customRightButton={props.requireSubmit && pinEntered.length === pinLength ? <Text style={{fontSize: 23, fontWeight: 'bold',}}>OK</Text> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    pinHeader:
    {
        textAlign: 'center',
        fontSize: 20,
    },
    failVisible:
    {
        color: 'red',
        fontSize: 20,
        textAlign: 'center',
    },
    failInvisible:
    {
        color: 'rgba(0,0,0,0)',
        fontSize: 20,
    },
});
