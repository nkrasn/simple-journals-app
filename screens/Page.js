import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, KeyboardAvoidingView, Keyboard, Button, AppState } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Storage from '../shared/Storage.js';

export default class Page extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            pageData: {
                date: this.props.navigation.getParam("key"),
                idx: this.props.navigation.getParam("idx"),
                journal: this.props.navigation.getParam("journal"),
                title: this.props.navigation.getParam("title"),
                text: this.props.navigation.getParam("text"),
                color: this.props.navigation.getParam("color"),
            },
            usingKeyboard: true,
            keyboardHeight: 0,
            appState: AppState.currentState,
        };
        this.reloadSinglePage = this.props.navigation.getParam("reloadSinglePage");
        this.deletePage = this.props.navigation.getParam("deletePage");

        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.handleKeyboardDidShow = this.handleKeyboardDidShow.bind(this);
        this.handleKeyboardDidHide = this.handleKeyboardDidHide.bind(this);
        this.savePage = this.savePage.bind(this);

        AppState.addEventListener('change', this.handleAppStateChange);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }

    componentWillUnmount()
    {
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();

        if(this.state.pageData.title.trim() === "" && this.state.pageData.text.trim() === "")
        {
            this.deletePage(this.state.pageData.date);
        }
        else
        {
            this.savePage();
            this.reloadSinglePage(this.state.pageData.date);
        }
    }

    // will run when app suspended, since 
    handleAppStateChange(nextAppState)
    {
        if(this.state.appState.match(/active/) && nextAppState.match(/inactive|background/))
            this.savePage();
        this.setState({appState: nextAppState});
    }
    
    handleKeyboardDidShow(event)
    {
        this.setState({keyboardHeight: event.endCoordinates.height});
    }

    handleKeyboardDidHide(event)
    {
        this.setState({keyboardHeight: 0});
    }

    savePage()
    {
        const newPageData = {...this.state.pageData};
        delete newPageData.date;
        delete newPageData.idx;

        Storage.save(this.state.pageData.date, newPageData);
    }

    render()
    {
        return (
            <View style={{...styles.container, paddingBottom: this.state.keyboardHeight}}>
                <TextInput
                    onChangeText={newTitle => {
                            let newPageData = {...this.state.pageData};
                            newPageData.title = newTitle;
                            this.setState({pageData: newPageData});
                        }
                    }
                    value={this.state.pageData.title}
                    style={styles.titleInput}
                    placeholder={"Title"}
                />
                <View style={styles.typingView}>
                    <TextInput
                        onChangeText={newText => {
                                let newPageData = {...this.state.pageData};
                                newPageData.text = newText;
                                this.setState({pageData: newPageData});
                            }
                        }
                        value={this.state.pageData.text}
                        multiline={true}
                        autoFocus={true}
                        style={styles.textInput}
                        placeholder={"text"}
                        placeholderTextColor={"#aaa"}
                    />
                </View>
                <Button
                        title="Done"
                        onPress={() => this.props.navigation.navigate('Pages')}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: 
    {
        flex: 1,
        height: '100%',
    },
    textInput:
    {
        flex: 1,
        paddingHorizontal: 15,
        textAlignVertical: 'top',
        height: '100%',
        paddingVertical: 10,

        borderTopWidth: 1.5,
        borderTopColor: '#777',

        backgroundColor: '#ddd',
    },
    titleInput:
    {
        fontSize: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        textAlign: 'center',
    },
    typingView:
    {
        flex: 1,
        height: '100%',
    }
});