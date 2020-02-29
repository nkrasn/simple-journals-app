import React, { useState } from 'react';
import { StyleSheet, View, Text, AsyncStorage, RefreshControl, Button, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Storage from '../shared/Storage.js';
import * as SecureStore from 'expo-secure-store';

export default function DebugScreen({navigation})
{
    const [storageStr, setStorageStr] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    let storageStrTemp = "";
    const getStorage = async () => {
        const allKeys = await AsyncStorage.getAllKeys();
        for(let i in allKeys)
        {
            const key = allKeys[i];
            const pageData = await AsyncStorage.getItem(key);
            //pageData = JSON.parse(pageData);
            let pageDataStr = pageData.replace(/,|{/g, '\n').replace('}', '');
            if(key === 'journals')
                pageDataStr = pageData.replace(/\[/g, '\n').replace(/.{/g, '\n\n{').replace(/\]/g, '\n\n');
            storageStrTemp += `${key === 'journals' ? '\n\n\njournals' : key}: ${pageDataStr}\n\n`;
        }
    }
    const refreshStorage = () => {
        setRefreshing(true);
        getStorage().then((value) => {
            setStorageStr(storageStrTemp);
            setRefreshing(false);
        }).catch((err) => {
            alert(err);
            setRefreshing(false);
        });
    };

    const clearAsyncStorage = () =>
    {
        Alert.alert(
            'Are you sure?',
            'You will not get ANY journal data back',
            [
                { text: 'Cancel', style: 'cancel', },
                {
                    text: 'OK',
                    onPress: () => {
                        //Storage.remove("journals");
                        Storage.clear();
                    }
                }
            ]
        );
    }
    const clearSecureStore = () =>
    {
        Alert.alert(
            "Are you sure?",
            "Your pin code will be gone",
            [
                { text: 'Cancel', style: 'cancel'},
                {
                    text: 'OK',
                    onPress: async () => {
                        await SecureStore.deleteItemAsync('pin');
                    }
                }
            ]
        );
    }
    //refreshStorage();

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <Button
                    title="CLEAR ASYNCSTORAGE"
                    color="red"
                    onPress={clearAsyncStorage}
                />
                <Button
                    title="CLEAR SECURESTORE"
                    color="orange"
                    onPress={clearSecureStore}
                />
            </View>

            <ScrollView
                style={styles.storageContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refreshStorage}/>
                }
            >

                <Text style={styles.header}>Storage</Text>
                <Text>
                    {storageStr}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container:
    {
        marginTop: 50,
        height: '100%',
        backgroundColor: '#ddd',
        paddingHorizontal: 20,
    },
    storageContainer:
    {
        marginTop: 10,
    },
    header:
    {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonsContainer:
    {
        flex: 1,
        flexDirection: 'row',
        minHeight: 35,
        maxHeight: 35,
    },
}); 