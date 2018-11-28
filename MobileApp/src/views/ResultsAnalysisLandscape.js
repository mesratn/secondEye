import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';
import { VoiceBar } from '../components/VoiceBar';
import { getLandscapes } from "../services/Api";
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

export default class ResultsAnalysisLandscape extends Component {
	static navigationOptions = {
		title: 'RESULTATS DE LA DETECTION',
	};

	constructor(props) {
        super(props);

        const { navigation } = this.props;
        const data = navigation.getParam('data', {});

		this.state = {
			loading: true,
            image: data,
            landscapes: [],
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
		
		getLandscapes(imageURI).then((landscapes) => {
			this.setState({
				loading:false,
				landscapes: landscapes.landscapes
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
		const { landscapes } = this.state;

        if (!landscapes[0])
            return false;

        if (c == 0) this.setState({ reading: true });

        readText(landscapes[c].message).then(() => {
            if (c < (landscapes.length) - 1)
                this.onStartReading(c + 1);
            else
                this.setState({ reading: false });
        }, () => {
            alert('Error when starting TTS.');
            this.setState({ reading: false });
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

	render(){
		const { image, imgWidth, imgHeight, landscapes, loading, width, voice } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

		return(
            <View style={localStyles.container}>
            
                <ScrollView contentContainerStyle={[AppStyle.container, { width: width, maxWidth: width, paddingBottom: 100 }]}>

                    <Text style={AppStyle.title}> LANDSCAPES </Text>

                    <Image
                        style={{ width: imgWidth, height: imgHeight, borderRadius: 50, marginBottom: 15 }}
                        source={{ uri: imageURI }}
                    />

                    {(landscapes || []).map((landscape, index) => {
                        return (
                            <Text key={index} style={AppStyle.instructions}>
                                {landscape.message}
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