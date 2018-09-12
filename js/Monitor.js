import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	TouchableHighlight,
	Button,
	NativeModules,
	NativeEventEmitter
} from 'react-native';
const TrackPlayer = NativeModules.TrackPlayerModule

//
// This is a nasty hack - I want to monitor the position of a playing track as it advances
// and as far as I can tell I do not get regular updates from TrackPlayer. So I have to
// set up a poll loop to be able to provide the feature
//
export default class Monitor {
	constructor(component, interval=1000) {
		setInterval(()=>{
			TrackPlayer.getPosition().then( (pos) => {
				component.setState((prevState) => {
					return {track_position: pos}
				})
			})
			TrackPlayer.getCurrentTrack().then( (trackId) => {
				component.setState( (prevState) => {
					return {current_track : trackId}
				})
			})
			TrackPlayer.getDuration().then( (duration) => {
				component.setState( (prevState) => {
					return {duration : duration}
				})
			})			

		}, interval)
	}

}

