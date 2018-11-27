import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { Button, Divider } from "react-native-elements";

import Voice from 'react-native-voice';
import { VoiceBar } from '../components/VoiceBar';

import { AppStyle } from "../utils/Styles";


export default class DetectionSelector extends Component {
    static navigationOptions = {
        title: 'CHOIX DE LA DÉTECTION',
    };

    constructor(props) {
        super(props);

        this.state = {
            voice: {
                enable: false,
                results: []
            }
        }

        // Bind Voice
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
    }

    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
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
            if (e.value && e.value.indexOf('visage') >= 0) {
                this.navigateTo('ResultsAnalysisFaceView');
            }
            else if (e.value && e.value.indexOf('texte') >= 0) {
                this.navigateTo('ResultsAnalysisTextView');
            }
            else if (e.value && e.value.indexOf('paysage') >= 0) {
                this.navigateTo('ResultsAnalysisLandscapeView');
            }
            else {
                alert('Commande non reconnue.');
            }
        });
    }

    navigateTo(view) {
        const { navigation } = this.props;
        const data = navigation.getParam('data', {});
        navigation.navigate(view, { data: data });
    }

    render() {
        const { voice } = this.state;

        return (
            <View style={localStyles.container}>
                <ScrollView contentContainerStyle={AppStyle.container}>

                    <Text style={AppStyle.title}> ÉMOTIONS </Text>

                    <Text style={AppStyle.instructions}>
                        Analyse l’expression faciale d’une photo, puis retourne la confiance d’un ensemble d’émotions pour chaque visage.
                    </Text>

                    <Button
                        raised
                        borderRadius={50}
                        backgroundColor="#7289DA"
                        icon={{ name: 'tag-faces' }}
                        containerViewStyle={AppStyle.button}
                        title='DÉTECTION DES ÉMOTIONS & VISAGES'
                        onPress={() => this.navigateTo('ResultsAnalysisFaceView')}
                    />

                    <Divider style={AppStyle.divider} />

                    <Text style={AppStyle.title}> PERSONNES </Text>

                    <Text style={AppStyle.instructions}>
                        Analyse les personnes présentes sur une photo, puis retourne le nom des personnes enregistrés dans vos contacts.
                    </Text>


                    <Button
                        raised
                        borderRadius={50}
                        backgroundColor="#7289DA"
                        icon={{ name: 'face' }}
                        containerViewStyle={AppStyle.button}
                        title='DÉTECTION DES TEXTES'
                        onPress={() => this.navigateTo('ResultsAnalysisTextView')}
                    />

                    <Divider style={AppStyle.divider} />

                    <Text style={AppStyle.title}> PAYSAGES ET OBJETS </Text>

                    <Text style={AppStyle.instructions}>
                        Analyse des images permettant en toute intelligence d’identifier, de légender et de décrire vos photos.
                    </Text>

                    <Button
                        raised
                        borderRadius={50}
                        backgroundColor="#7289DA"
                        icon={{ name: 'photo' }}
                        containerViewStyle={AppStyle.button}
                        title='DÉTECTION DE PAYSAGE'
                        onPress={() => this.navigateTo('ResultsAnalysisLandscapeView')}
                    />
                </ScrollView>
                <VoiceBar
                    active={voice.enable}
                    commands={['Visage', 'Texte', 'Paysage']}
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