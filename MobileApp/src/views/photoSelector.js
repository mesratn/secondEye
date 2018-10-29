import React, { Component } from 'react';

import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Modal from "react-native-modal";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const localStyles = StyleSheet.create({
    containerImage: {
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF'
    },
    logo: {
        position: 'absolute',
        top: '5%',
        width: '100%',
        textAlign: 'center',
        color: '#7289DA',
        fontWeight: 'bold',
        fontSize: 38
    },
    logoSmall: {
        color: '#23272A',
        fontWeight: 'normal'
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        margin: 10,
        color: '#7289DA'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
        padding: 50
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
    }
});

const pickerOptions = {
    title: 'Choix de la photo',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

export default class PhotoSelector extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        }
    }

    componentDidMount() { }

    handleClickLibrary = () => {
        launchImageLibrary(pickerOptions, this.handleResult);
    }

    handleClickCamera = () => {
        launchCamera(pickerOptions, this.handleResult);
    }

    handleResult = (response) => {
        if (response.didCancel)
            return;
        else if (response.error)
            alert(JSON.stringify(response.error));
        else {
            this.setState({ modalVisible: false }, () => {
                this.props.navigation.navigate('detectionSelectorView', {
                    data: response
                });
            });
        }
    }

    render() {
        return (
            <View style={localStyles.container}>
                <Modal 
                    isVisible={this.state.modalVisible}
                    style={localStyles.bottomModal}
                    onBackdropPress={() => this.setState({ modalVisible: false })}
                >
                    <View style={localStyles.modalContent}>
                        <Button
                            raised
                            borderRadius={50}
                            backgroundColor="#7289DA"
                            icon={{ name: 'photo-library' }}
                            title='DEPUIS VOTRE LIBRAIRIE'
                            containerViewStyle={{ width: '100%' }}
                            onPress={() => launchImageLibrary(pickerOptions, this.handleResult)}
                        />

                        <Text style={[localStyles.title, { marginTop: 15, marginBottom: 15 }]}>
                            OU
                        </Text>

                        <Button
                            raised
                            borderRadius={50}
                            backgroundColor="#7289DA"
                            icon={{ name: 'photo-camera' }}
                            title='PRENDRE UNE PHOTO'
                            containerViewStyle={{ width: '100%' }}
                            onPress={() => launchCamera(pickerOptions, this.handleResult)}
                        />

                        <Divider style={{ marginTop: 15, marginBottom: 15, height: 1, backgroundColor: '#2C2F33' }} />

                        <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }}>
                            <Text style={{ color: 'red' }}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Text style={localStyles.logo}> <Text style={localStyles.logoSmall}>Second</Text>Eye</Text>

                <Text style={localStyles.title}> SELECTION DE LA PHOTO À ANALYSER </Text>
                <Text style={localStyles.instructions}> Choisissez une photo de votre librairie ou prenez-en une maintenant pour pouvoir la faire analyser ! </Text>

                <Button
                    raised
                    borderRadius={50}
                    backgroundColor="#7289DA"
                    icon={{ name: 'photo' }}
                    title='CHOIX DE LA PHOTO'
                    onPress={() => this.setState({ modalVisible: true })}
                />
            </View>
        );
    }
}
