import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function JournalsHeader({navigation})
{
    const [lockIcon, setLockIcon] = useState('lock');

    const openMenu = () =>
    {
        navigation.openDrawer();
    };

    return (
        <View style={styles.header}>
            <MaterialIcons name='menu' size={28} onPress={()=>navigation.openDrawer()} style={styles.burgerIcon}/>
            <Text style={styles.headerText}>Journals</Text>
            {/* <Lock/> */}
            <MaterialIcons name={lockIcon} size={28} onPress={openMenu} style={styles.lockIcon}/>
        </View>
    );
}

const styles = StyleSheet.create({
    header:
    {
        flex: 1,
        flexDirection: 'row',
        width: 300,
        height: '100%',
        alignItems: 'flex-start',
        //justifyContent: 'center',
        color: '#333',
        backgroundColor: '#f66',
    },
    headerText:
    {
        fontSize: 20,
    },
    burgerIcon:
    {
        paddingRight: 30,
    },
    lockIcon:
    {
        flex: 1,
        alignSelf: 'flex-end',
    },
});
