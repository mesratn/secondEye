import React, { Component } from 'react';

import { ScrollView, View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button, Divider } from "react-native-elements";
import Tts from 'react-native-tts';

import { getLandscapes } from "../services/Api";
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

	constructor(props) {
        super(props);

        const { navigation } = this.props;
        const data = navigation.getParam('data', {});

		this.state = {
			loading: true,
            image: data,
			landscapes: []
		}
	}

	componentDidMount() {
		const { image } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

        // calculate image width and height 
        const screenWidth = Dimensions.get('window').width - (AppStyle.container.padding * 2)
        const scaleFactor = image.width / screenWidth
        const imageHeight = image.height / scaleFactor
		this.setState({ imgWidth: screenWidth, imgHeight: imageHeight })
		
		getLandscapes(imageURI).then((landscapes) => {
			this.setState({
				loading:false,
				landscapes: landscapes.landscapes
			});
		}).catch((err) => alert(err + ""));
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

	render(){
		const { image, imgWidth, imgHeight, landscapes, loading } = this.state;
        const imageURI = `data:${image.type};base64,${image.data}`;

		return(
			<ScrollView contentContainerStyle={localStyles.container}>

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
			);
	}

}