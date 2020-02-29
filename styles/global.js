import { StyleSheet } from 'react-native';

const global = StyleSheet.create({
    parentView:
    {
        backgroundColor: '#222226',
    },
    childView:
    {
        backgroundColor: '#333337',
    },
    text:
    {
        color: '#eee',
    },
    noEntriesText:
    {
        flex: 1, 
        textAlign: 'center', 
        textAlignVertical: 'top',
        fontSize: 18,
    },
    checkboxContainer:
    {
        flexDirection: 'row',
    },
    checkboxLabel:
    {
        textAlignVertical: 'center',
    },


    cardContainer:
    {
        marginHorizontal: 20,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
        
        /*borderWidth: 1,
        borderColor: '#556',
        borderRadius: 6,*/

        elevation: 3,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    cardTitleText:
    {
        fontSize: 20,
        marginBottom: 10,
    },
    cardPreviewText:
    {
        color: "#888",
        fontSize: 14,
        paddingLeft: 10,
    },

    
    burgerIcon:
    {
        paddingLeft: 20,
    },
    lockIcon:
    {
        paddingRight: 20,
    },
});

export default global;