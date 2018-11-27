import React, { Component } from 'react';

import { View, ScrollView, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button, Divider, FormLabel, FormInput } from "react-native-elements";
import { VoiceBar } from '../components/VoiceBar';
import { getEmotions, saveFace } from "../services/Api";
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
        Dimensions.removeEventListener('change', this.onDimensionsChange);
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

        saveFace(image, name).then((returnSaveFace) => {
            this.setState({
                save: returnSaveFace
            });
            alert(save);
        }).catch((err) => alert(err + ""));
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
                    commands={[]}
                    onPressButton={() => alert('pressed')}
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