import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';
import { VoiceBar } from '../components/VoiceBar';
import { getTexts } from "../services/Api";
import { readText } from "../services/Tts";
import { AppStyle } from "../utils/Styles";

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF'
    }
});

export default class ResultsAnalysisText extends Component {
    static navigationOptions = {
        title: 'RÉSULTATS DE LA DÉTECTION',
    };

    constructor(props) {
        super(props);

        const { navigation } = this.props;
        const data = navigation.getParam('data', {});

        this.state = {
            loading: true,
            image: data,
            texts: "",
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

        getTexts(imageURI).then((texts) => {
            this.setState({
                loading: false,
                texts: texts.message
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

    onStartReading() {
        const self = this.state;
        Tts.setDefaultLanguage('en-US');
        Tts.getInitStatus().then(() => {
            Tts.speak(self.texts, {
                androidParams: {
                    KEY_PARAM_PAN: -1,
                    KEY_PARAM_VOLUME: 1,
                    KEY_PARAM_STREAM: 'STREAM_MUSIC' }
                });
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
        const { image, imgWidth, imgHeight, texts, loading, width, voice } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;
        
        return (
            <View style={localStyles.container}>
            
                <ScrollView contentContainerStyle={[AppStyle.container, { width: width, maxWidth: width, paddingBottom: 100 }]}>

                    <Text style={AppStyle.title}> TEXT </Text>

                    <Image
                        style={{ width: imgWidth, height: imgHeight, borderRadius: 50, marginBottom: 15 }}
                        source={{ uri: imageURI }}
                    />

                    <Text style={AppStyle.instructions}>
                        {texts}
                    </Text>

                    <Button
                        raised
                        loading={loading}
                        disabled={loading}
                        borderRadius={50}
                        backgroundColor="#7289DA"
                        icon={{ name: 'play-arrow' }}
                        title='LECTURE DES DONNÉES'
                        containerViewStyle={AppStyle.button}
                        onPress={() => this.onStartReading()}
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
