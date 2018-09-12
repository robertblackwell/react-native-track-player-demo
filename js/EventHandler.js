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
const emitter = new NativeEventEmitter(TrackPlayer);


export default class EventHandlerClass
{
	constructor(component)
	{
		this.component = component
		this.handler = this.handler.bind(this)
		this.registerForEvents(this.handler)
	}
	registerForEvents(handler)
	{
		const events = [
			'playback-state', 'playback-error', 'playback-queue-ended', 'playback-track-changed',
// /* NOTE new one */			'playback-seek-complete',
			'remote-play','remote-pause','remote-stop','remote-next','remote-previous','remote-jump-forward','remote-jump-backward',
		];

		for (let i = 0; i < events.length; i++) {
			emitter.addListener(events[i], (data) => {
				let ev = events[i];
				let ev_data = {	type : ev,	data: data}
				handler(ev_data)
			});
		}
	}
	handler(data)
	{
		console.log("event handler")
		console.log(["handler", data])
		if (data.type === 'playback-state') 
		{
			let s = data.data.state
			this.component.setState((prevState) => {
				return {player_state : s}
			})
			console.log(`player state changed to ${s}`)
		} 
		else if (data.type === 'playback-seek-complete') 
		{
			let s = "seek complete"
			this.component.setState((prevState) => {
				return {player_state : s}
			})
			console.log(`player state changed to ${s}`)
		} 
		else if(data.type == 'playback-error') 
		{
			console.log("state playback error")
			throw new Error("got a playback error")
		} 
		else if(data.type == 'playback-queue-ended') 
		{
			console.log("state queue ended")
		} 
		else if(data.type == 'playback-track-changed') 
		{
			//
			// note the comment under add track
			//
			let newTrack = TrackPlayer.getCurrentTrack().then( (id) =>{
				console.log(`new track is ${id}`)
				this.component.setState( (prevState) => {
					return {current_track: id}
				})
			})
			console.log("state track changed")
		} 
		else if(data.type == 'remote-play') 
		{ /* TrackPlayer.play()*/	}
		else if(data.type == 'remote-pause') 
		{/* TrackPlayer.pause()*/} 
		else if(data.type == 'remote-next') 
		{/* TrackPlayer.skipToNext()*/} 
		else if(data.type == 'remote-previous') 
		{		} 
		else 
		{
			console.log(["unknown event: ", data.type])
		}
	}
}

