import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { Button, Divider } from "react-native-elements";

import { AppStyle } from "../utils/Styles";


export default class DetectionSelector extends Component {
    static navigationOptions = {
        title: 'CHOIX DE LA DÉTECTION',
    };

    constructor(props) {
        super(props);
    }

    render() {

        const { navigation } = this.props;
        const data = navigation.getParam('data', {});

        return (
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
                    onPress={() => this.props.navigation.navigate('resultsAnalysisFaceView', { data: data })}
                />

                <Divider style={AppStyle.divider}/>

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
                    onPress={() => this.props.navigation.navigate('resultsAnalysisTextView', { data: data })}
                />

                <Divider style={AppStyle.divider}/>

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
                    onPress={() => this.props.navigation.navigate('resultsAnalysisLandscapeView', { data: data })}
                />
            </ScrollView>
        );
    }
}
