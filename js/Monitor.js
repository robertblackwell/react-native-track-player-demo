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

// import TrackPlayer from "./TrackPlayerWrap"

// const TrackPlayer = require('./track_player') //NativeModules.TrackPlayerModule
// import TrackPlayer from "./track_player"
import TrackPlayer from "react-native-track-player"
//
// This is a nasty hack - I want to monitor the position of a playing track as it advances
// and as far as I can tell I do not get regular updates from TrackPlayer. So I have to
// set up a poll loop to be able to provide the feature
//
export default class Monitor {
	constructor(component, interval=5000) {
		setInterval(()=>{
			TrackPlayer.getState().then( (state) =>{
				console.log(["Monitor:: player state: ", TrackPlayer.stateAsString(state)])
				// @todo - should not call these until player is loaded with a track
				TrackPlayer.getPosition().then( (pos) => {
					component.setState((prevState) => {
						console.log(["Monitor::track_position ",component.state.track_position])
						return {track_position: pos}
					})
				})
				TrackPlayer.getCurrentTrack().then( (trackId) => {
					component.setState( (prevState) => {
						console.log(["Monitor::current_track ", trackId])
						return {current_track : trackId}
					})
				})
				TrackPlayer.getDuration().then( (duration) => {
					component.setState( (prevState) => {
						console.log(["Monitor::duration ", duration])
						return {duration : duration}
					})
				})			
			})

		}, interval)
	}

}

