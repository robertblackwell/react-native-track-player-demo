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
} from 'react-native'

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

const TrackPlayer = NativeModules.TrackPlayerModule

console.log(["track_player.js ", TrackPlayer])

TrackPlayer.testfunction = function() {
	console.log("TrackPplayer::testfunction")
}

function resolveAsset(uri) {
    if(!uri) return undefined;
    return resolveAssetSource(uri);
}

function resolveUrl(url) {
    if(!url) return undefined;
    return resolveAssetSource(url) || url;
}

function setupPlayer(options) {
    return TrackPlayer.setupPlayer(options || {});
}

function updateOptions(data) {
    // Clone the object before modifying it, so we don't run into problems with immutable objects
    data = Object.assign({}, data);

    // Resolve the asset for each icon
    data.icon = resolveAsset(data.icon);
    data.playIcon = resolveAsset(data.playIcon);
    data.pauseIcon = resolveAsset(data.pauseIcon);
    data.stopIcon = resolveAsset(data.stopIcon);
    data.previousIcon = resolveAsset(data.previousIcon);
    data.nextIcon = resolveAsset(data.nextIcon);

    return TrackPlayer.updateOptions(data);
}

function add(tracks, insertBeforeId) {
    if(!Array.isArray(tracks)) {
        tracks = [tracks];
    }

    for(let i = 0; i < tracks.length; i++) {
        // Clone the object before modifying it
        tracks[i] = Object.assign({}, tracks[i]);

        // Resolve the URLs
        tracks[i].url = resolveUrl(tracks[i].url);
        tracks[i].artwork = resolveUrl(tracks[i].artwork);
    }

    return TrackPlayer.add(tracks, insertBeforeId);
}

function remove(tracks) {
    if(!Array.isArray(tracks)) {
        tracks = [tracks];
    }

    return TrackPlayer.remove(tracks);
}

function warpEventResponse(handler, event, payload) {
    // transform into headlessTask format and return to handler
    const additionalKeys = payload || {};
    handler({ type: event, ...additionalKeys });
}

function registerEventHandler(handler) {
    if (Platform.OS !== 'android') {
        const emitter = new NativeEventEmitter(TrackPlayer);

        const events = [
            'playback-state',
            'playback-error',
            'playback-queue-ended',
            'playback-track-changed',
            'playback-seek-complete',

            'remote-play',
            'remote-pause',
            'remote-stop',
            'remote-next',
            'remote-previous',
            'remote-jump-forward',
            'remote-jump-backward',
        ];

        for (let i = 0; i < events.length; i++) {
            emitter.addListener(events[i], warpEventResponse.bind(null, handler, events[i]));
        }
    } else {
        AppRegistry.registerHeadlessTask('TrackPlayer', () => handler);
    }
}

function stateAsString(state) 
{
	if (state == TrackPlayer.STATE_NONE) {
		return "STATE_NONE"
	} else if (state == TrackPlayer.STATE_PAUSED) {
		return "STATE_PAUSED"
	} else if (state == TrackPlayer.STATE_PLAYING) {
		return "STATE_PLAYING"
	} else if (state == TrackPlayer.STATE_STOPPED) {
		return "STATE_STOPPED"
	} else if (state == TrackPlayer.STATE_BUFFERING) {
		return "STATE_BUFFERING"
	} else {
		return "STATE_UNKNOWN"
	}
}

// Events
var TrackPlayerWrapper = {}

TrackPlayerWrapper.EVENT_PLAYBACK_ERROR = "playback-error"
TrackPlayerWrapper.EVENT_PLAYBACK_QUEUE_ENDED = "playback-queue-ended"
TrackPlayerWrapper.EVENT_PLAYBACK_TRACK_CHANGED = "playback-track-changed"
TrackPlayerWrapper.EVENT_PLAYBACK_STATE = "playback-state-changed"
TrackPlayerWrapper.EVENT_PLAYBACK_SEEK_COMPLETE = "playback-seek-complete"

TrackPlayerWrapper.EVENT_REMOTE_PLAY = "remote-play"
TrackPlayerWrapper.EVENT_REMOTE_PAUSE = "remote-pause"
TrackPlayerWrapper.EVENT_REMOTE_STOP = "remote-stop"
TrackPlayerWrapper.EVENT_REMOTE_NEXT = "remote-next"
TrackPlayerWrapper.EVENT_REMOTE_PREVIOUS = "remote-previous"
TrackPlayerWrapper.EVENT_REMOTE_JUMP_FORWARD = "remote-jump-forward"
TrackPlayerWrapper.EVENT_REMOTE_JUMP_BACKWARDS = "remote-jump-backwards"


// States
TrackPlayerWrapper.STATE_NONE = TrackPlayer.STATE_NONE;
TrackPlayerWrapper.STATE_PLAYING = TrackPlayer.STATE_PLAYING;
TrackPlayerWrapper.STATE_PAUSED = TrackPlayer.STATE_PAUSED;
TrackPlayerWrapper.STATE_STOPPED = TrackPlayer.STATE_STOPPED;
TrackPlayerWrapper.STATE_BUFFERING = TrackPlayer.STATE_BUFFERING;

// Capabilities
TrackPlayerWrapper.CAPABILITY_PLAY = TrackPlayer.CAPABILITY_PLAY;
TrackPlayerWrapper.CAPABILITY_PLAY_FROM_ID = TrackPlayer.CAPABILITY_PLAY_FROM_ID;
TrackPlayerWrapper.CAPABILITY_PLAY_FROM_SEARCH = TrackPlayer.CAPABILITY_PLAY_FROM_SEARCH;
TrackPlayerWrapper.CAPABILITY_PAUSE = TrackPlayer.CAPABILITY_PAUSE;
TrackPlayerWrapper.CAPABILITY_STOP = TrackPlayer.CAPABILITY_STOP;
TrackPlayerWrapper.CAPABILITY_SEEK_TO = TrackPlayer.CAPABILITY_SEEK_TO;
TrackPlayerWrapper.CAPABILITY_SKIP = TrackPlayer.CAPABILITY_SKIP;
TrackPlayerWrapper.CAPABILITY_SKIP_TO_NEXT = TrackPlayer.CAPABILITY_SKIP_TO_NEXT;
TrackPlayerWrapper.CAPABILITY_SKIP_TO_PREVIOUS = TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS;
TrackPlayerWrapper.CAPABILITY_JUMP_FORWARD = TrackPlayer.CAPABILITY_JUMP_FORWARD;
TrackPlayerWrapper.CAPABILITY_JUMP_BACKWARD = TrackPlayer.CAPABILITY_JUMP_BACKWARD;
TrackPlayerWrapper.CAPABILITY_SET_RATING = TrackPlayer.CAPABILITY_SET_RATING;

// Pitch algorithms
TrackPlayerWrapper.PITCH_ALGORITHM_LINEAR = TrackPlayer.PITCH_ALGORITHM_LINEAR;
TrackPlayerWrapper.PITCH_ALGORITHM_MUSIC = TrackPlayer.PITCH_ALGORITHM_MUSIC;
TrackPlayerWrapper.PITCH_ALGORITHM_VOICE = TrackPlayer.PITCH_ALGORITHM_VOICE;

// Rating Types
TrackPlayerWrapper.RATING_HEART = TrackPlayer.RATING_HEART;
TrackPlayerWrapper.RATING_THUMBS_UP_DOWN = TrackPlayer.RATING_THUMBS_UP_DOWN;
TrackPlayerWrapper.RATING_3_STARS = TrackPlayer.RATING_3_STARS;
TrackPlayerWrapper.RATING_4_STARS = TrackPlayer.RATING_4_STARS;
TrackPlayerWrapper.RATING_5_STARS = TrackPlayer.RATING_5_STARS;
TrackPlayerWrapper.RATING_PERCENTAGE = TrackPlayer.RATING_PERCENTAGE;

// Cast States
TrackPlayerWrapper.CAST_NO_DEVICES_AVAILABLE = TrackPlayer.CAST_NO_DEVICES_AVAILABLE;
TrackPlayerWrapper.CAST_NOT_CONNECTED = TrackPlayer.CAST_NOT_CONNECTED;
TrackPlayerWrapper.CAST_CONNECTING = TrackPlayer.CAST_CONNECTING;
TrackPlayerWrapper.CAST_CONNECTED = TrackPlayer.CAST_CONNECTED;

// General
TrackPlayerWrapper.setupPlayer = setupPlayer;
TrackPlayerWrapper.destroy = TrackPlayer.destroy;
TrackPlayerWrapper.updateOptions = updateOptions;
// TrackPlayerWrapper.registerEventHandler = registerEventHandler;

// Player Queue Commands
TrackPlayerWrapper.add = add;
TrackPlayerWrapper.remove = remove;
TrackPlayerWrapper.skip = TrackPlayer.skip;
TrackPlayerWrapper.getQueue = TrackPlayer.getQueue;
TrackPlayerWrapper.skipToNext = TrackPlayer.skipToNext;
TrackPlayerWrapper.skipToPrevious = TrackPlayer.skipToPrevious;
TrackPlayerWrapper.removeUpcomingTracks = TrackPlayer.removeUpcomingTracks;

// Player Playback Commands
TrackPlayerWrapper.reset = TrackPlayer.reset;
TrackPlayerWrapper.play = TrackPlayer.play;
TrackPlayerWrapper.pause = TrackPlayer.pause;
TrackPlayerWrapper.stop = TrackPlayer.stop;
TrackPlayerWrapper.seekTo = TrackPlayer.seekTo;
TrackPlayerWrapper.seekToPromise = TrackPlayer.seekToPromise;
TrackPlayerWrapper.setVolume = TrackPlayer.setVolume;
TrackPlayerWrapper.setRate = TrackPlayer.setRate;

// Player Getters
TrackPlayerWrapper.getTrack = TrackPlayer.getTrack;
TrackPlayerWrapper.getCurrentTrack = TrackPlayer.getCurrentTrack;
TrackPlayerWrapper.getVolume = TrackPlayer.getVolume;
TrackPlayerWrapper.getDuration = TrackPlayer.getDuration;
TrackPlayerWrapper.getPosition = TrackPlayer.getPosition;
TrackPlayerWrapper.getBufferedPosition = TrackPlayer.getBufferedPosition;
TrackPlayerWrapper.getState = TrackPlayer.getState;
TrackPlayerWrapper.getRate = TrackPlayer.getRate;
TrackPlayerWrapper.registerEventHandler = registerEventHandler;
TrackPlayerWrapper.getStateDescription = function() {
	return stateAsString(TrackPlayer.getState())
}
  
console.log(["TTTTT track_player ", TrackPlayerWrapper]);  

// Cast Getters
// TrackPlayerWrapper.getCastState = TrackPlayer.getCastState;

// Components
// TrackPlayerWrapper.ProgressComponent = require('./ProgressComponent');

// if(TrackPlayer.CAST_SUPPORT_AVAILABLE) {
//     TrackPlayerWrapper.CastButton = require('./CastButton');
// } else {
//     TrackPlayerWrapper.CastButton = View; // Cast Unavailable
// }
export default TrackPlayerWrapper