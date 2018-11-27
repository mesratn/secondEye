import React, { Component } from 'react';

import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Modal from "react-native-modal";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageResizer from 'react-native-image-resizer';
import Voice from 'react-native-voice';
import { VoiceBar } from '../components/VoiceBar';
import { NavigationEvents } from 'react-navigation';

const RNFS = require("react-native-fs");

import { AppStyle } from "../utils/Styles";


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
            modalVisible: false,

            voice: {
                enable: false,
                results: []
            }
        }

        // Bind Voice
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        this.onSpeechSwitch = this.onSpeechSwitch.bind(this);
    }

    componentDidMount() { }

    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
    }

    setVoiceHandlers() {
        Voice.removeAllListeners();
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        this.onSpeechSwitch = this.onSpeechSwitch.bind(this);
    }

    async onSpeechSwitch() {
        const self = {...this.state};
        self.voice.enable = !self.voice.enable;
        if (self.voice.enable == true)
            await Voice.start('fr-FR');
        else {
            await Voice.stop();
            self.voice.results = [];
        }
        await this.setState(self);
    }

    onSpeechResults(e) {
        this.onSpeechSwitch().then(() => {
            if (e.value && e.value.indexOf('photo') >= 0) {
                this.handleClickCamera();
            }
            else if (e.value && e.value.indexOf('galerie') >= 0) {
                this.handleClickLibrary();
            }
            else {
                alert('Commande non reconnue.');
            }
        });
    }

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
                ImageResizer.createResizedImage(response.uri, response.width, response.height, "JPEG", 30, 0, null).then((resized) => {
                    RNFS.readFile(resized.path, "base64").then(data => {
                        response['data'] = data;
                        response['fileName'] = resized.name;
                        response['fileSize'] = resized.size;
                        response['path'] = resized.path;
                        response['uri'] = resized.uri;
                        response['type'] = "image/jpeg";

                        this.props.navigation.navigate('DetectionSelectorView', {
                            data: response
                        });
                    });
                })
            });
        }
    }

    render() {
        const { voice } = this.state;

        return (
            <View style={localStyles.container}>
                <NavigationEvents onDidFocus={e => this.setVoiceHandlers()} />
                <Modal 
                    isVisible={this.state.modalVisible}
                    style={AppStyle.bottomModal}
                    onBackdropPress={() => this.setState({ modalVisible: false })}
                >
                    <View style={AppStyle.modalContent}>
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
                
                <VoiceBar 
                    active={voice.enable}
                    commands={['photo', 'galerie']}
                    onPressButton={() => this.onSpeechSwitch()}
                />

            </View>
        );
    }
}


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
    }
});