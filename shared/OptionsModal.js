import React from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

export default function OptionsModal(props)
{
    const animType = props.animationType === undefined ? "slide" : props.animationType;

    return (
        <Modal
            style={{height: '100%'}}
            animationType={animType}
            visible={props.visible}
        >
            <MaterialIcons
                name="close"
                size={38}
                style={styles.closeIcon}
                onPress={props.closeModal}/>

            <View style={styles.content}>
                {props.children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    closeIcon:
    {
        margin: 10,
    },
    content:
    {
        marginTop: 10,
        padding: 20,
    }
});