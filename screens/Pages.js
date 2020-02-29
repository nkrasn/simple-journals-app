import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, AsyncStorage, Modal, Alert } from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import OptionsModal from '../shared/OptionsModal.js';
import globalStyles from '../styles/global.js';
import Storage from '../shared/Storage.js';

export default class Pages extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            journalPages: [],
            pageOptionsVisible: false,
            pageOptionsTarget: null,
        };

        this.targetJournal = this.props.navigation.getParam('targetJournal');
        this.color = this.props.navigation.getParam('color');

        this.compareDates = this.compareDates.bind(this);
        this.createNewPage = this.createNewPage.bind(this);
        this.reloadPages = this.reloadPages.bind(this);
        this.reloadSinglePage = this.reloadSinglePage.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.pageCard = this.pageCard.bind(this);
    }

    componentDidMount()
    {
        this.reloadPages();
    }

    compareDates(a,b)
    {
        return new Date(a) < new Date(b);
    }

    async reloadPages()
    {
        let newJournalPages = [];

        try
        {
            const allKeys = await AsyncStorage.getAllKeys();

            // AsyncStorage.multiGet(allKeys) was acting strange, look at it again later
            for(let i in allKeys)
            {
                const key = allKeys[i];
                if(key === "journals")
                    continue;
                
                let pageData = await Storage.get(key);
                if(pageData.journal !== this.targetJournal)
                    continue;
                
                pageData.key = key;
                pageData.idx = newJournalPages.length;
                newJournalPages.push(pageData);
                //alert(JSON.stringify(newJournalPages));
            }
        }
        catch(e)
        {
            alert(e.message);
        }

        this.setState({journalPages: newJournalPages.sort(this.compareDates)});
    }

    async reloadSinglePage(key)
    {
        let newJournalPages = this.state.journalPages.slice(0);

        try
        {
            let pageData = await Storage.get(key);
            pageData.key = key;
            for(let i in newJournalPages)
            {
                if(newJournalPages[i].key === key)
                {
                    newJournalPages[i] = pageData;
                    break;
                }
            }
            //newJournalPages[pageData.idx] = pageData;
        }
        catch(e)
        {
            alert(e.message);
        }

        this.setState({journalPages: newJournalPages});
    }

    createNewPage()
    {
        const rn = new Date();
        const d = new Date(rn.getTime() - (rn.getTimezoneOffset() * 60000)).toISOString();
        let newPageData = {
            journal: this.targetJournal,
            title: "",
            text: "",
        };
        Storage.save(d, newPageData);

        newPageData.key = d;
        newPageData.idx = this.state.journalPages.length;

        const newJournalPages = [...this.state.journalPages, newPageData];
        this.setState({journalPages: newJournalPages.sort(this.compareDates)});

        const pageProps = {...newPageData, reloadSinglePage: this.reloadSinglePage, deletePage: this.deletePage};
        this.props.navigation.navigate('Page', pageProps);
    }

    deletePage(targetKey = null)
    {
        //const key = this.state.journalPages[this.state.pageOptionsTarget].key;
        const key = (targetKey === null) ? this.state.pageOptionsTarget : targetKey;
        Storage.remove(key);

        this.reloadPages();
        alert()

        this.setState({
            pageOptionsVisible: false
        })
    }

    createPreviewText(text)
    {
        const MAX_LINES = 5;
        const MAX_LENGTH = 128;

        const lines = text.split('\n'); // all lines
        const previewLines = lines.slice(0, MAX_LINES); // first few lines
        const previewJoined = previewLines.join('\n'); // first few lines as a string
        const suffix = (text.length > MAX_LENGTH || lines.length > MAX_LINES) ? '\n...' : '';

        const result = previewJoined + suffix;
        return result;
    }
    
    pageCard({item})
    {
        return (
            <TouchableOpacity 
                style={globalStyles.cardContainer}
                onPress={() => this.props.navigation.navigate('Page', {...item, reloadSinglePage: this.reloadSinglePage, deletePage: this.deletePage})}
                onLongPress={() => {
                    this.setState({
                        pageOptionsVisible: true,
                        pageOptionsTarget: item.key
                    })
                }}
            >    
                <Text style={globalStyles.cardTitleText}>
                    {item.title.trim() === "" ? "" : item.title}
                </Text>
                <Text style={globalStyles.cardPreviewText}>
                    {item.text.trim() === "" ? "No content here" : this.createPreviewText(item.text)}{"\n\n"}
                </Text>
                <Text>
                    {(new Date(item.key)).toDateString()}
                </Text>
            </TouchableOpacity>
        );
    }

    render()
    {
        // for render item: make the parent do key={item.key} or whatever
        return (
            <View style={styles.container}>
                <OptionsModal
                    visible={this.state.pageOptionsVisible}
                    closeModal={() => this.setState({pageOptionsVisible: false})}
                >
                    <Button
                        title='DELETE'
                        color='red'
                        onPress={() => {
                            Alert.alert(
                                'Are you sure?',
                                'This page will be gone forever',
                                [
                                    { text: 'Cancel', style: 'cancel', },
                                    {
                                        text: 'OK',
                                        onPress: () => this.deletePage(),
                                    }
                                ]
                            );
                        }}
                    />
                </OptionsModal>

                <FlatList
                    style={styles.list}
                    data={ this.state.journalPages }
                    renderItem={this.pageCard}
                />
                {this.state.journalPages.length === 0 ? <Text style={globalStyles.noEntriesText}>No pages yet...{'\n'}Add one!</Text> : null}
                <TouchableOpacity style={{...styles.bottomBar, backgroundColor: this.color}} onPress={this.createNewPage}>
                    <MaterialIcons name='add' size={38} style={styles.addIcon}/>
                </TouchableOpacity>
            </View>
        );  
    }
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        alignItems: 'center',
    },
    list:
    {
        width: '100%',
    },
    bottomBar: 
    {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',

        minHeight: 50,
        maxHeight: 50,
        width: '100%',
        
        backgroundColor: '#fff',
    },
    addIcon:
    {
        paddingRight: 20,
    },
});