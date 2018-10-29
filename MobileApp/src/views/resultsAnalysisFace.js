import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button, Divider, FormLabel, FormInput } from "react-native-elements";
import Tts from 'react-native-tts';

import { getEmotions } from "../services/Api";

const localStyles = StyleSheet.create({
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
        // marginTop: 15,
        // marginBottom: 15
    }
});

export default class resultsAnalysisFace extends Component {
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
            image: data
        }
    }

    componentDidMount() {
        const image = this.state.image;
        const imageURI = `data:${image.type};base64,${image.data}`;

        // calculate image width and height 
        const screenWidth = Dimensions.get('window').width - (localStyles.container.padding * 2)
        const scaleFactor = image.width / screenWidth
        const imageHeight = image.height / scaleFactor
        this.setState({ imgWidth: screenWidth, imgHeight: imageHeight })

        getEmotions(imageURI).then((emotions) => {
            this.setState({
                loading: false,
                emotions: emotions
            });
        }).catch((err) => alert(err + ""));
    }

    onStartReading() {
        const self = this.state;
        // VERSION TEST - NE PAS SUPPRIMER
        // Tts.setDefaultLanguage('bn-IN');
        Tts.setDefaultLanguage('en-US');
        Tts.getInitStatus().then(() => {
            Tts.speak(self.emotions.faces[0].message, {
                androidParams: {
                    KEY_PARAM_PAN: -1,
                    KEY_PARAM_VOLUME: 1,
                    KEY_PARAM_STREAM: 'STREAM_MUSIC'
                }
            });
        });
    }

    onStartSending() {
        saveFace().then((returnSaveFace) => {
            this.setState({
                save: returnSaveFace
            });
            alert(save);
        }).catch((err) => alert(err + ""));
    }

    render() {
        const emotions = this.state.emotions;
        const image = this.state.image;
        const imageURI = `data:${image.type};base64,${image.data}`;
        const { imgWidth, imgHeight } = this.state

        return (
            <ScrollView contentContainerStyle={localStyles.container}>

                <Text style={localStyles.title}> ÉMOTIONS </Text>

                <Image
                    style={{ width: imgWidth, height: imgHeight, borderRadius: 50, marginBottom: 15 }}
                    source={{ uri: imageURI }}
                />

                {(emotions.faces || []).map((person, index) => {
                    return (
                        <Text key={index} style={localStyles.instructions}>
                            {person.message}
                        </Text>
                    );
                })}

                <Button
                    raised
                    loading={this.state.loading}
                    disabled={this.state.loading}
                    borderRadius={50}
                    backgroundColor="#7289DA"
                    icon={{ name: 'play-arrow' }}
                    title='LECTURE DES DONNÉES'
                    containerViewStyle={localStyles.button}
                    onPress={() => this.onStartReading()}
                />

                <Divider style={localStyles.divider}/>

                <FormLabel>PRÉNOM</FormLabel>
                <FormInput
                    containerStyle={localStyles.input}
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name: name })}    
                />

                <Button
                    raised
                    disabled={this.state.name && this.state.name != '' ? false : true}
                    borderRadius={50}
                    backgroundColor="#7289DA"
                    icon={{ name: 'save' }}
                    title='ENREGISTRER LE VISAGE ?'
                    containerViewStyle={localStyles.button}
                    onPress={() => this.onStartSending()}
                />


            </ScrollView>
        );
    }
}
