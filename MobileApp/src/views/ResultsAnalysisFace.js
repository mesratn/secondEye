import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text, Image, TextInput } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Tts from 'react-native-tts';

import { getEmotions } from "../services/Api";

const localStyles = StyleSheet.create({
    container: {
        height: null,
        padding: 15
    },
});

export default class ResultsAnalysisFace extends Component {
    static navigationOptions = {
        title: 'RÉSULTATS DE LA DÉTECTION',
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            emotions: {},
            name: '',
            returnSaveFace: {}
        }
    }

    componentDidMount() {
        getEmotions().then((emotions) => {
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
                    KEY_PARAM_STREAM: 'STREAM_MUSIC' }
                });
        });
    }

    onStartSending(){
        saveFace().then((returnSaveFace) =>{
            this.setState({
                save: returnSaveFace
            });
            alert(save);
        }).catch((err) => alert(err + ""));
    }

    render() {
        return (
            <ScrollView contentContainerStyle={localStyles.container}>

                <Text> Résultats de l analyse </Text>

                <Image
                    style={{ height: 400, width: 400}}
                    source={{ uri: 'https://pbs.twimg.com/profile_images/1007439915917938688/ZsxLbPmx_400x400.jpg' }}
                />

                <Button
                    raised
                    loading={this.state.loading}
                    disabled={this.state.loading}
                    borderRadius={50}
                    backgroundColor="#7289DA"
                    icon={{ name: 'play-arrow' }}
                    title='LECTURE DES DONNÉES'
                    containerViewStyle={{ width: '100%' }}
                    onPress={() => this.onStartReading()}
                />

                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                />

                <Button
                    raised
                    disabled={() => this.state.name && this.state.name != ''? false:true}
                    borderRadius={50}
                    backgroundColor="#7289DA"
                    title='ENREGISTRER LE VISAGE ?'
                    containerViewStyle={{ width: '100%' }}
                    onPress={() => this.onStartSending()}
                />


            </ScrollView>
        );
    }
}
