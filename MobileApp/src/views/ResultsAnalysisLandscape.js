import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text, Image } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Tts from 'react-native-tts';

import { getLandscapes } from "../services/Api";

const localStyles = StyleSheet.create({
	container: {
		height: null,
		padding: 15
	},
});

export default class ResultsAnalysisLandscape extends Component {
	static navigationOptions = {
		title: 'RESULTATS DE LA DETECTION',
	};

	constructor(props){
		super(props);

		this.state = {
			loading: true,
			landscapes: {}
		}
	}

	componentDidMount(){
		getLandscapes().then((landscapes) => {
			this.setState({
				loading: false,
				landscapes: landscapes
			});
		}).catch((err) => alert(err + ""));
	}

	onStartReading(){
		const self = this.state;
		Tts.setDefaultLanguage('en-US');
		Tts.getInitStatus().then(() => {
			Tts.speak(self.landscapes.message, {
				androidParams: {
					KEY_PARAM_PAN: -1,
					KEY_PARAM_VOLUME: 1,
					KEY_PARAM_STREAM: 'STREAM_MUSIC'
				}
			});
		});
	}

	render(){
		return(
			<ScrollView contentContainerStyle={localStyles.container}>

                <Text> Résultats de l analyse </Text>

                <Image
                    style={{ height: 400, width: 400}}
                    source={{ uri: 'https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?auto=compress&cs=tinysrgb&h=350' }}
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

            </ScrollView>
			);
	}

}