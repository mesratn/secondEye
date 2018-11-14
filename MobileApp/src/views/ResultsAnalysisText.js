import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Tts from 'react-native-tts';

import { getTexts } from "../services/Api";
import { readText } from "../services/Tts";
import { AppStyle } from "../utils/Styles";

const localStyles = StyleSheet.create({
    container: {
        height: null,
        padding: 15
    },
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
            texts: ""
        }
    }

    componentDidMount() {
        const { image } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

        // calculate image width and height 
        const screenWidth = Dimensions.get('window').width - (AppStyle.container.padding * 2);
        const scaleFactor = image.width / screenWidth;
        const imageHeight = image.height / scaleFactor;
        this.setState({ imgWidth: screenWidth, imgHeight: imageHeight });

        getTexts(imageURI).then((texts) => {
            this.setState({
                loading: false,
                texts: texts.message
            });
        }).catch((err) => alert(err + ""));
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

    render() {
        const { image, imgWidth, imgHeight, texts, loading } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;
        return (
            <ScrollView contentContainerStyle={localStyles.container}>

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
        );
    }
}
