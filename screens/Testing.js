import React from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Storage from '../shared/Storage.js';

export default class Testing extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            text: "",
            fetchedText: "",
        };
        // this.saveData = this.saveData.bind(this);
        // this.readData = this.readData.bind(this);
    }

    componentDidMount()
    {
        this.interval = setInterval(() => this.readData(), 1000);
    }
    componentWillUnmount()
    {
        clearInterval(this.interval);
    }

    saveData()
    {
        Storage.save("hello", this.state.text);
    }
    
    async readData()
    {
        // alert(Storage.read("hello"));
        try
        {
            const storedData = await AsyncStorage.getItem("hello");
            this.setState({fetchedText: storedData});
        }
        catch(e)
        {
            return "Could not fetch data";
        }
    }

    render()
    {
        return (
            <View>
                <TextInput
                    onChangeText={newText => this.setState({text: newText})}
                    value={this.state.text}
                    multiline={true}
                    autoFocus={true}
                />
                <Button
                    title="Save Data"
                    onPress={() => this.saveData()}
                />
                <Text>{this.state.fetchedText}</Text>
            </View>
        );
    }
}