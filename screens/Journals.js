import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, AsyncStorage, Alert, TextInput, Picker, CheckBox } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import OptionsModal from '../shared/OptionsModal.js';
import globalStyles from '../styles/global.js';
import Storage from '../shared/Storage.js';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class Journals extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            journals: [],
            
            createJournalDialogVisible: false,
            newJournalName: "",
            newJournalColor: "#fff",
            newJournalPrivate: false,
            
            journalOptionsVisible: false,
            journalOptionsTarget: 0,

            showPrivateJournals: false,
        };

        this.allowPrivateJournals = this.allowPrivateJournals.bind(this);
        this.createNewJournal = this.createNewJournal.bind(this);
        this.editJournal = this.editJournal.bind(this);
        this.initializeEditingJournal = this.initializeEditingJournal.bind(this);
        this.reloadJournals = this.reloadJournals.bind(this);
        this.deleteJournal = this.deleteJournal.bind(this);
        this.pageCard = this.pageCard.bind(this);

        this.props.navigation.setParams({allowPrivateJournals: this.allowPrivateJournals});
    }

    componentDidMount()
    {
        this.reloadJournals();
    }

    // Will be used by header lock, which will access it through navigation.getParam
    async allowPrivateJournals(value)
    {
        await this.setState({showPrivateJournals: value});
        await this.reloadJournals();
    }

    async reloadJournals()
    {
        let newJournals = [];

        try
        {
            // AsyncStorage stores the "journals" item as a stringified array of objects
            let journals = await Storage.get("journals");

            // if AsyncStorage did not have a "journals" item, make an empty one
            if(journals === null)
            {
                journals = [];
                Storage.save("journals", journals);
            }
            
            for(let i in journals)
                newJournals.push(journals[i]);
        }
        catch(e)
        {
            alert(e.message);
        }

        this.setState({journals: newJournals});
    }

    createNewJournal()
    {
        if(this.state.newJournalName.trim() === "")
        {
            alert("You forgot to name the journal!");
            return;
        }
        const rn = new Date();
        const d = new Date(rn.getTime() - (rn.getTimezoneOffset() * 60000)).toISOString();
        let newJournal = {
            name: this.state.newJournalName,
            color: this.state.newJournalColor,
            key: d,
        };
        if(this.state.newJournalPrivate)
            newJournal.private = true;

        let journals = this.state.journals;
        journals.push(newJournal);
        Storage.save("journals", journals);
        
        this.setState({
            journals: journals,
            createJournalDialogVisible: false,
        });
    }

    editJournal()
    {
        if(this.state.newJournalName.trim() === "")
        {
            alert("You forgot to name the journal!");
            return;
        }

        let editedJournal = this.state.journals.filter(x => x.key === this.state.journalOptionsTarget)[0];
        editedJournal.name = this.state.newJournalName;
        editedJournal.color = this.state.newJournalColor;
        if(this.state.newJournalPrivate)
            editedJournal.private = this.state.newJournalPrivate
        else if(editedJournal.private !== undefined)
            delete editedJournal.private;
        
        let journals = this.state.journals;
        for(let i in journals)
        {
            if(journals[i].key === this.state.journalOptionsTarget)
            {
                journals[i] = editedJournal;
                break;
            }
        }
        
        Storage.save("journals", journals);
        this.setState({
            journals: journals,
            journalOptionsVisible: false,
        });
    }

    initializeEditingJournal(item)
    {
        this.setState({
            journalOptionsVisible: true,
            journalOptionsTarget: item.key,
            newJournalName: item.name,
            newJournalColor: item.color,
            newJournalPrivate: item.private == true,
        });
    }

    async deleteJournal()
    {
        let newJournals = this.state.journals;
        for(let i in this.state.journals)
        {
            if(newJournals[i].key === this.state.journalOptionsTarget)
            {
                newJournals.splice(i, 1);
                break;
            }
        }
        Storage.save("journals", newJournals);

        // Delete all pages associated with journal
        const allKeys = await AsyncStorage.getAllKeys();
        // AsyncStorage.multiGet(allKeys) was acting strange, look at it again later
        for(let i in allKeys)
        {
            const key = allKeys[i];
            let pageData = await Storage.get(key);

            if(pageData.journal === this.state.journalOptionsTarget)
                Storage.remove(key);
        }

        this.reloadJournals();

        this.setState({
            journalOptionsVisible: false
        })
    }
    
    pageCard({item})
    {
        return (
            <TouchableOpacity 
                style={{...globalStyles.cardContainer, backgroundColor: item.color}}
                onPress={() => this.props.navigation.navigate('Pages', {targetJournal: item.key, targetJournalName: item.name, color: item.color})}
                onLongPress={() => this.initializeEditingJournal(item)}
            >    
                <Text style={globalStyles.cardTitleText}>
                    {item.name.trim() === "" ? "-" : item.name}
                </Text>
                {item.private ? <MaterialIcons name="lock-open" size={28} style={{alignSelf: 'flex-end'}}/> : null}
            </TouchableOpacity>
        );
    }

    render()
    {
        // for render item: make the parent do key={item.key} or whatever
        return (
            <View style={styles.container}>
                {/* Create new journal dialog */}
                <OptionsModal
                    visible={this.state.createJournalDialogVisible}
                    closeModal={() => this.setState({createJournalDialogVisible: false})}
                >
                    <TextInput
                        style={styles.journalTitleEntry}
                        onChangeText={newJournalName => this.setState({newJournalName: newJournalName})}
                        value={this.state.newJournalName}
                        placeholder={"Title"}
                    />
                    
                    <View style={styles.colorPickerContainer}>
                        <Text style={styles.colorPickerHeader}>Color</Text>
                        <Picker
                            selectedValue={this.state.newJournalColor}
                            onValueChange={(col) => this.setState({newJournalColor: col})}
                            style={styles.colorPicker}
                        >
                            <Picker.Item label="White"  value={journalColors.white.light}     color={journalColors.white.dark}/>
                            <Picker.Item label="Red"    value={journalColors.red.light}       color={journalColors.red.dark}/>
                            <Picker.Item label="Orange" value={journalColors.orange.light}    color={journalColors.orange.dark}/>
                            <Picker.Item label="Yellow" value={journalColors.yellow.light}    color={journalColors.yellow.dark}/>
                            <Picker.Item label="Green"  value={journalColors.green.light}     color={journalColors.green.dark}/>
                            <Picker.Item label="Blue"   value={journalColors.blue.light}      color={journalColors.blue.dark}/>
                            <Picker.Item label="Gray"   value={journalColors.gray.light}      color={journalColors.gray.dark}/>
                        </Picker>
                    </View>

                    <View style={{...globalStyles.checkboxContainer, ...styles.privateCheckboxContainer}}>
                        <CheckBox
                            value={this.state.newJournalPrivate}
                            onChange={() => this.setState({newJournalPrivate: !this.state.newJournalPrivate})}
                        />
                        <Text style={globalStyles.checkboxLabel}>Private</Text>
                    </View>

                    <Button
                        title="Create"
                        onPress={this.createNewJournal}
                    />
                </OptionsModal>

                {/* Journal settings dialog */}
                <OptionsModal
                    visible={this.state.journalOptionsVisible}
                    closeModal={() => this.setState({journalOptionsVisible: false})}
                >
                    <TextInput
                        style={styles.journalTitleEntry}
                        onChangeText={newJournalName => this.setState({newJournalName: newJournalName})}
                        value={this.state.newJournalName}
                        placeholder={"Title"}
                    />
                    
                    <View style={styles.colorPickerContainer}>
                        <Text style={styles.colorPickerHeader}>Color</Text>
                        <Picker
                            selectedValue={this.state.newJournalColor}
                            onValueChange={(col) => this.setState({newJournalColor: col})}
                            style={styles.colorPicker}
                        >
                            <Picker.Item label="White"  value={journalColors.white.light}     color={journalColors.white.dark}/>
                            <Picker.Item label="Red"    value={journalColors.red.light}       color={journalColors.red.dark}/>
                            <Picker.Item label="Orange" value={journalColors.orange.light}    color={journalColors.orange.dark}/>
                            <Picker.Item label="Yellow" value={journalColors.yellow.light}    color={journalColors.yellow.dark}/>
                            <Picker.Item label="Green"  value={journalColors.green.light}     color={journalColors.green.dark}/>
                            <Picker.Item label="Blue"   value={journalColors.blue.light}      color={journalColors.blue.dark}/>
                            <Picker.Item label="Gray"   value={journalColors.gray.light}      color={journalColors.gray.dark}/>
                        </Picker>
                    </View>

                    <View style={{...globalStyles.checkboxContainer, ...styles.privateCheckboxContainer}}>
                        <CheckBox
                            value={this.state.newJournalPrivate}
                            onChange={() => this.setState({newJournalPrivate: !this.state.newJournalPrivate})}
                        />
                        <Text style={globalStyles.checkboxLabel}>Private</Text>
                    </View>

                    <View style={{marginBottom: 20}}>
                        <Button
                            title="DONE"
                            onPress={this.editJournal}
                        />
                    </View>

                    <View>
                        <Button
                            title='DELETE'
                            color='red'
                            onPress={() => {
                                Alert.alert(
                                    'Are you sure?',
                                    'This journal and all its pages will be gone forever',
                                    [
                                        { text: 'Cancel', style: 'cancel', },
                                        {
                                            text: 'OK',
                                            onPress: () => this.deleteJournal(),
                                        }
                                    ]
                                );
                            }}
                        />
                    </View>
                </OptionsModal>
                {/* Available journals */}
                <FlatList
                    style={styles.list}
                    data={ this.state.journals.filter(journal => !journal.private || (journal.private && this.state.showPrivateJournals)) }
                    renderItem={this.pageCard}
                />
                {this.state.journals.length === 0 ? <Text style={globalStyles.noEntriesText}>No journals yet...{'\n'}Add one using the button below!</Text> : null}
                <TouchableOpacity style={styles.bottomBar} onPress={() => {
                            this.setState({
                                newJournalName: "",
                                newJournalColor: "#fff",
                                newJournalPrivate: false,
                                createJournalDialogVisible: true,
                            });
                        }
                    }
                >
                    <MaterialIcons name='add' size={38} style={styles.addIcon}/>
                </TouchableOpacity>
            </View>
        );  
    }
}

const journalColors = {
    white:  { light: '#ffffff', dark: '#000000' },
    red:    { light: '#ff9aa2', dark: '#ff4555' },
    orange: { light: '#ffdac1', dark: '#ff9b57' },
    yellow: { light: '#fffebd', dark: '#dedb28' },
    green:  { light: '#b5ead7', dark: '#31f593' },
    blue:   { light: '#c7ceea', dark: '#4953e3' },
    gray:   { light: '#c3c3c3', dark: '#454545' },
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
        marginTop: 32,
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

    journalTitleEntry:
    {
        fontSize: 20,
        textAlign: 'center',
        paddingBottom: 10,
        borderColor: '#aaa',
        borderBottomWidth: 1,
    },
    colorPickerContainer:
    {
        marginTop: 30,

        borderColor: '#aaa',
        borderBottomWidth: 1,
    },
    colorPickerHeader:
    {
        textAlign: 'center',
        fontSize: 17,
    },
    colorPicker:
    {
        marginTop: -10,
        //marginBottom: 10,
    },
    privateCheckboxContainer:
    {
        marginVertical: 20,
    },
});