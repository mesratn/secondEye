import React, { Component } from 'react';

import { View, ScrollView, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button, Divider, FormLabel, FormInput } from "react-native-elements";
import Voice from 'react-native-voice';
import { VoiceBar } from '../components/VoiceBar';
import { getEmotions, saveFace, getAddedFace } from "../services/Api";
import { readText } from "../services/Tts";
import { AppStyle } from "../utils/Styles";


export default class ResultsAnalysisFace extends Component {
    static navigationOptions = {
        title: 'RÉSULTATS DE LA DÉTECTION',
    };

    constructor(props) {
        super(props);

        const { navigation } = this.props;
        const data = navigation.getParam('data', {});

        this.state = {
            loading: true,
            emotions: {},
            name: '',
            returnSaveFace: {},
            image: data,
            reading: false,
            width: Dimensions.get('window').width,
            voice: {
                enable: false,
                results: []
            }
        }

        // Bind Voice
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        this.onSpeechSwitch = this.onSpeechSwitch.bind(this);
    }

    componentDidMount() {
        const { image } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

        // Width gesture
        this.onDimensionsChange();
        Dimensions.addEventListener('change', this.onDimensionsChange.bind(this));

        getEmotions(imageURI).then((emotions) => {
            this.setState({
                loading: false,
                emotions: emotions
            });
        }).catch((err) => alert(err + ""));
    }


    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
        Dimensions.removeEventListener('change', this.onDimensionsChange);
    }

    setVoiceHandlers() {
        Voice.removeAllListeners();
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        this.onSpeechSwitch = this.onSpeechSwitch.bind(this);
    }

    onDimensionsChange() {
        const { image, width } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

        // calculate image width and height 
        const screenWidth = Dimensions.get('window').width - (AppStyle.container.padding * 2);
        const scaleFactor = image.width / screenWidth;
        const imageHeight = image.height / scaleFactor;

        this.setState({ width: Dimensions.get('window').width, imgWidth: screenWidth, imgHeight: imageHeight });
    }

    onStartReading(c = 0) {
        const { emotions } = this.state;

        if (!emotions.faces[0])
            return false;

        if (c == 0) this.setState({ reading: true });

        readText(emotions.faces[c].message).then(() => {
            if (c < (emotions.faces.length) - 1)
                this.onStartReading(c + 1);
            else
                this.setState({ reading: false });
        }, () => {
            alert('Error when starting TTS.');
            this.setState({ reading: false });
        });
    }

    onStartSending() {
        const { image, name } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

        saveFace(imageURI, name).then((returnSaveFace) => {
            this.setState({
                save: returnSaveFace
            });
            alert(returnSaveFace.message);
        }).catch((err) => alert(err + ""));
    }

    onCheckFace() {
        const { image } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

        this.setState({ loading: true });
        getAddedFace(imageURI).then((name) => {
            const tmp = name.message.includes('undefined') ? "I don't reconize this person." : name.message; 
            readText(tmp).then(() => {
                this.setState({ loading: false });
            }, () => {
                this.setState({ loading: false });
            }); 
        }).catch(e => {
            readText("I don't reconize this person.").then(() => {
                this.setState({ loading: false });
            }, () => {
                this.setState({ loading: false });
            });
            this.setState({ loading: false });
        });
    }

    async onSpeechSwitch() {
        const self = this.state;
        self.voice.enable = !self.voice.enable;
        if (self.voice.enable == true)
            await Voice.start('fr-FR');
        else {
            await Voice.stop();
            self.voice.results = [];
        }
        this.setState(self);
    }

    onSpeechResults(e) {
        this.onSpeechSwitch().then(() => {
            if (e.value && e.value.indexOf('lecture') >= 0) {
                this.onStartReading(0);
            }
            else {
                alert('Commande non reconnue.');
            }
        });
    }



    render() {
        const { image, imgWidth, imgHeight, emotions, name, loading, voice, width } = this.state
        const imageURI = `data:${image.type};base64,${image.data}`;

        return (
            <View style={localStyles.container}>
            
                <ScrollView contentContainerStyle={[AppStyle.container, { width: width, maxWidth: width, paddingBottom: 100 }]}>

                    <Text style={AppStyle.title}> ÉMOTIONS </Text>

                    <Image
                        style={{ width: imgWidth, height: imgHeight, borderRadius: 50, marginBottom: 15 }}
                        source={{ uri: imageURI }}
                    />

                    {(emotions.faces || []).map((person, index) => {
                        return (
                            <Text key={index} style={AppStyle.instructions}>
                                {person.message}
                            </Text>
                        );
                    })}

                    <Button
                        raised
                        loading={loading}
                        disabled={loading}
                        borderRadius={50}
                        backgroundColor="#7289DA"
                        icon={{ name: 'play-arrow' }}
                        title='LECTURE DES DONNÉES'
                        containerViewStyle={AppStyle.button}
                        onPress={() => this.onStartReading(0)}
                    />

                    <Divider style={AppStyle.divider}/>

                    <Button
                        raised
                        loading={loading}
                        disabled={loading}
                        borderRadius={50}
                        backgroundColor="#7289DA"
                        icon={{ name: 'save' }}
                        title='VISAGE DÉJÀ ENREGISTRÉ ?'
                        containerViewStyle={AppStyle.button}
                        onPress={() => this.onCheckFace()}
                    />

                    <Divider style={AppStyle.divider}/>

                    <FormLabel>PRÉNOM</FormLabel>
                    <FormInput
                        containerStyle={AppStyle.input}
                        value={name}
                        onChangeText={(name) => this.setState({ name: name })}    
                    />

                    <Button
                        raised
                        disabled={name && name != '' ? false : true}
                        borderRadius={50}
                        backgroundColor="#7289DA"
                        icon={{ name: 'save' }}
                        title='ENREGISTRER LE VISAGE ?'
                        containerViewStyle={AppStyle.button}
                        onPress={() => this.onStartSending()}
                    />

                </ScrollView>

                <VoiceBar
                    active={voice.enable}
                    commands={['Lecture']}
                    onPressButton={() => this.onSpeechSwitch()}
                />

            </View>
        );
    }
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF'
    }
});