import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { Button, Divider } from "react-native-elements";

const localStyles = StyleSheet.create({
    container: {
        padding: 15,
        height: null
    },
    cardTitle: {
        paddingTop: 15,
        color: '#2C2F33'
    },
    cardContainer: {
        padding: 0,
        margin: 5
    },
    button: {
        width: null,
        margin: 15
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
    divider: {
        backgroundColor: '#AAAAAA',
        marginTop: 15,
        marginBottom: 15
    }
});

export default class DetectionSelector extends Component {
    static navigationOptions = {
        title: 'CHOIX DE LA DÉTECTION',
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={localStyles.container}>

                <Text style={localStyles.title}> ÉMOTIONS </Text>

                <Text style={localStyles.instructions}>
                   Analyse l’expression faciale d’une photo, puis retourne la confiance d’un ensemble d’émotions pour chaque visage.
                </Text>

                <Button
                    raised
                    borderRadius={50}
                    backgroundColor="#7289DA"
                    icon={{ name: 'tag-faces' }}
                    containerViewStyle={localStyles.button}
                    title='DÉTECTION DES ÉMOTIONS & VISAGES'
                    onPress={() => this.props.navigation.navigate('ResultsAnalysisFaceView')}
                />

                <Divider style={localStyles.divider}/>

                <Text style={localStyles.title}> PERSONNES </Text>

                <Text style={localStyles.instructions}>
                   Analyse les personnes présentes sur une photo, puis retourne le nom des personnes enregistrés dans vos contacts.
                </Text>


                <Button
                    raised
                    borderRadius={50}
                    backgroundColor="#7289DA"
                    icon={{ name: 'face' }}
                    containerViewStyle={localStyles.button}
                    title='DÉTECTION DES TEXTES'
                    onPress={() => this.props.navigation.navigate('ResultsAnalysisTextView')}
                />

                <Divider style={localStyles.divider}/>

                <Text style={localStyles.title}> PAYSAGES ET OBJETS </Text>

                <Text style={localStyles.instructions}>
                    Analyse des images permettant en toute intelligence d’identifier, de légender et de décrire vos photos.
                </Text>

                <Button
                    raised
                    borderRadius={50}
                    backgroundColor="#7289DA"
                    icon={{ name: 'photo' }}
                    containerViewStyle={localStyles.button}
                    title='DÉTECTION DE PAYSAGE'
                    onPress={() => this.props.navigation.navigate('ResultsAnalysisLandscapeView')}
                />
            </ScrollView>
        );
    }
}
