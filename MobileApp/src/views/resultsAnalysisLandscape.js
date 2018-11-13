import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text, Image } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Tts from 'react-native-tts';

import { getLanscapes } from "../services/Api";
import { readText } from "../services/Tts";
import { AppStyle } from "../utils/Styles";

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

		const { navigation } = this.props;
        const data = navigation.getParam('data', {});

		this.state = {
			loading: true,
            image: data,
			landscapes: {}
		}
	}

	ComponentDidMount(){
		const { image } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

        // calculate image width and height 
        const screenWidth = Dimensions.get('window').width - (AppStyle.container.padding * 2)
        const scaleFactor = image.width / screenWidth
        const imageHeight = image.height / scaleFactor
        this.setState({ imgWidth: screenWidth, imgHeight: imageHeight })
        
		getLanscapes(imageURI).then((landscapes) => {
			this.setState({
				loading:false,
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
                    style={{ width: imgWidth, height: imgHeight, borderRadius: 50, marginBottom: 15 }}
                    source={{ uri: imageURI }}
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