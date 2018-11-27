import React, { Component } from 'react';

import { View, StyleSheet, Text } from 'react-native';
import { Button, Card } from "react-native-elements";
import Voice from 'react-native-voice';
import Pulse from 'react-native-pulse';


export class VoiceBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const PulseView = (props) => {
            if (this.props.active) {
                return (
                    <View style={[localStyles.pulseContainer]}>
                        <Pulse color='#7289DA' numPulses={3} diameter={150} speed={10} duration={2000} />
                    </View>
                )
            } else { 
                return null 
            }
        }

        return (
            <View style={[localStyles.container]}>
                {this.props.commands && 
                <View style={{ position: "absolute", right: 85, bottom: 8 }}>
                    <Card containerStyle={{ borderRadius: 50 }}>
                        <Text style={{ fontWeight: '500' }}>COMMANDES:</Text>
                        <Text>{this.props.commands.join(', ').toUpperCase()}</Text>
                    </Card>
                </View>}

                <PulseView />

                <Button
                    raised
                    large
                    borderRadius={50}
                    backgroundColor={ this.props.active ? "#F44336" : "#8BC34A"}
                    icon={{ name: 'settings-voice', size: 30 }}
                    title=''
                    buttonStyle={{ width: 80, height: 80 }}
                    textStyle={{ marginLeft: -10 }}
                    onPress={() => this.props.onPressButton()}
                />
            </View>
        );
    }
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'absolute',
        height: 100,
        width: '100%',
        bottom: 15
    },
    pulseContainer: {
        position: 'absolute',
        bottom: 40,
        right: 55
    },
});