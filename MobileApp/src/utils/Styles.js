import { StyleSheet } from 'react-native';

export const AppStyle = StyleSheet.create({
    container: {
        height: null,
        padding: 15
    },
    title: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: '500',
        margin: 10,
        color: '#7289DA'
    },
    instructions: {
        textAlign: 'left',
        fontSize: 14,
        marginBottom: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    button: {
        width: null,
        margin: 15
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 50,
        paddingLeft: 15,
        paddingRight: 15
    },
    divider: {
        backgroundColor: '#AAAAAA',
        marginTop: 15,
        marginBottom: 15
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    fabButton: {
        
    }
});