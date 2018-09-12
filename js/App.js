/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View, NativeModules} from 'react-native';

// const TrackPlayer = NativeModules.TrackPlayerModule

// import { StackNavigator } from 'react-navigation';

// import TestScreen from './TestScreen';

// const RootStack = StackNavigator({
//   Landing: {
//     screen: TestScreen,
//   },

// }, { initialRouteName: 'Landing' })

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

import trackList1 from './playlist1'
import trackList2 from './playlist2'
import Monitor from "./Monitor"
import EventHandlerClass from "./EventHandler"

const TrackPlayer = NativeModules.TrackPlayerModule

export default class App extends Component {
  // static navigationOptions = {
  //   title: 'RN Track Player Test App',
  // };
  // navigateTo = path => {
  //     this.props.navigation.navigate(path);
  //   };

  constructor(props) {
    super(props)
    
    this.eventHandler = new EventHandlerClass(this)

    this.state = {
      player_state : "not set",
      track_position : 0.0,
      current_track : "",
      duration: 0,
      skipToId : "ZZZZ"
    }
    this.progressWatcher = new Monitor(this)
    this.onPressAdd4Tracks = this.onPressAdd4Tracks.bind(this)
    this.onPressSeekPlus10 = this.onPressSeekPlus10.bind(this)
    this.onPressSeekTo70 = this.onPressSeekTo70.bind(this)

    this.onSkipToNext = this.onSkipToNext.bind(this)
    this.onSkipToPrev = this.onSkipToPrev.bind(this)
    this.onSkipTo = this.onSkipTo.bind(this)
    this.onSkipIdChange = this.onSkipIdChange.bind(this)
  }

  onPressSetupTrackPlayer() {
    TrackPlayer.setupPlayer({})
  }
  onPressAdd4Tracks() {
    let self = this
    console.log("onPressLoad4Tracks")
    TrackPlayer.add(trackList1, null)
    .then(()=>{
      //
      // note can get the current track here and update state
      // but its better to let the event handler do it
      // just did it this way for demo purposes
      //
      TrackPlayer.getCurrentTrack().then( (id) => {
        console.log(`TrackPlayer.add.then id: {id}`)
        self.setState( (PrevState) => {
          console.log(`after add tracks new id is : ${id}`)
          return {current_track : id}
        })
      })
    })
    .catch(()=>{
      throw new Error("add tracks failed")
      console.log("CATCH")
    })
  }
  onPressPlay() {
    TrackPlayer.play()
  }
  onPressPause() {
    TrackPlayer.pause()
  }
  onPressResume() {
    TrackPlayer.resume()
  }
  //
  // The next three functions kickoff seek operations. You will have to watch the event handler to see that
  // the seek completes successfully.
  //
  // In each case we are relying on the ProgressWatcher to keep this.state.track_position close to current
  //
  onPressSeekPlus10() {
    let cp = this.state.track_position;
    let new_cp = cp + 10.0
    console.log(`seek plus 10 current position is : ${this.state.track_position}`)
    TrackPlayer.seekTo(new_cp)
    // let pos = TrackPlayer.getPosition().then( (cp) => {
    //  TrackPlayer.seek(cp + 10)
    // })
  }
  onPressSeekMinus10() {
    let cp = this.state.track_position;
    let new_cp = cp - 10.0
    if (new_cp < 0.0) {new_cp = 0.0}
    console.log(`seek minus 10 current position is : ${this.state.track_position}`)
    TrackPlayer.seekTo(new_cp)
    // let pos = TrackPlayer.getPosition().then( (cp) => {
    //  TrackPlayer.seek(cp + 10)
    // })
  } 
  onPressSeekTo70() {
    let cp = this.state.track_position;
    let new_cp = 70.0
    console.log(`seek to 70 the current position is : ${this.state.track_position}`)
    TrackPlayer.seekTo(new_cp)
  }


  onSkipToNext() {
    TrackPlayer.skipToNext()
    .then( ()=>{
      console.log(`skiptonext then`)
    })
    .catch((m1, m2, obj)=>{
      console.log(`skiptonext catch ${m1} ${m2}`)
    })
    console.log(`skip to next current is : ${this.state.current_track}`)
  }
  
  onSkipToPrev() {
    TrackPlayer.skipToPrevious()
    .then( ()=>{
      console.log(`skiptoprevioius then`)
    })
    .catch((m1, m2, obj)=>{
      console.log(`skiptoprevious catch ${m1} ${m2}`)
    })
    console.log(`skip to previous current is : ${this.state.current_track}`)  
  }
  
  onSkipIdChange(text) {
    let sk = this.state.skipToId
    console.log(`onSkipIdChange was: ${sk}  is now : ${text}`)
    this.setState( (prevState) => {
      return {skipToId :text}
    })
  }

  onSkipTo() {
    console.log(`skipTo ${this.state.skipToId} `)
    let toId = this.state.skipToId
    TrackPlayer.skip(toId)
    .then( ()=>{
      console.log(`skipto then toId : ${toId}`)
    })
    .catch((m1, m2, obj)=>{
      console.log(`skipto error toId: ${toId} errCode : ${m1} errorMsg : ${m2}`)
    })

  }


  render() {
    let player_state = this.state.player_state
    let track_position = this.state.track_position.toFixed(4)
    let current_track_id = this.state.current_track
    let duration = this.state.duration.toFixed(2)
    return (
      <View style={styles.container}>
        <View style={{width:400, borderBottomWidth:1, borderBottomColor:"#222222", marginTop:30}}>
          <Text style={{textAlign:"center", fontSize:20, fontWeight:"bold"}}>RN Track Player Test App</Text>
        </View>

        <View style={{width:400, flexDirection: "row", borderWidth:0, borderColor:"#222222"}}>
          <View style={{width:200, paddingLeft:20}}>
            <Text style={styles.status}>
              Player state : {player_state}     
            </Text>
            <Text style={styles.status}>
              Current Track : {current_track_id}
            </Text>
          </View>
          <View style={{width:200, paddingLeft:20}}>
            <Text style={styles.status}>
              track position: {track_position}
            </Text>
            <Text style={styles.status}>
              Track duration : {duration}   
            </Text>
          </View>
        </View>
        <TouchableHighlight style={styles.button} onPress={this.onPressSetupTrackPlayer} >
           <Text>Setup RNTrackPlayer</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.onPressAdd4Tracks} >
           <Text>Add 4 tracks</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.onPressPlay} >
           <Text>Play</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.onPressPause} >
           <Text>Pause</Text>
        </TouchableHighlight>       
        <TouchableHighlight style={styles.button} onPress={this.onPressResume} >
           <Text>Resume</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.onPressSeekPlus10} >
           <Text>Seek + 10 seconds</Text>
        </TouchableHighlight>        
        <TouchableHighlight style={styles.button} onPress={this.onPressSeekMinus10} >
           <Text>Seek - 10 seconds</Text>
        </TouchableHighlight>        
        <TouchableHighlight style={styles.button} onPress={this.onPressSeekTo70} >
           <Text>Seek to 70 secs</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.onPressPlayCurrentTrack} >
           <Text>Play current Track</Text>
        </TouchableHighlight>
        <View style={styles.rowContainer}>
          <TouchableHighlight style={styles.rowButton} onPress={this.onSkipToNext} >
             <Text>Skip to next</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.rowButton} onPress={this.onSkipToPrev} >
             <Text>Skip to previous</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.rowContainer}>
          <TouchableHighlight style={styles.rowButton} onPress={this.onSkipTo} >
            <Text style={styles.textRowLabel}>Click here to skip to track ID : </Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.rowButton} >
            <TextInput style={styles.textInputRow} 
              placeholder="enter track id"
              onChangeText={this.onSkipIdChange}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rowContainer: {
      flexDirection: 'row',
    // backgroundColor: '#DDDDDD',
    // padding: 10,
    marginBottom:5,
    width:400,
    // borderWidth:1,
    // borderColor:'black'
    },
    textRowLabel : {
      width: 150,
      paddingLeft: 10,
      paddingRight: 10
    },
    textRow : {
      backgroundColor : '#F5FCFF',
      width: 200,
      paddingLeft: 10,
      paddingRight: 10
    },
    textInputRow : {
      backgroundColor : '#F5FCFF',
      width: 150,
      marginLeft:20,
      paddingLeft: 10,
      paddingRight: 10
    },
  rowButton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom:5,
    width:200,
    borderWidth:1,
    borderColor:'black'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom:5,
    width:400,
    borderWidth:1,
    borderColor:'black'
  },
  links : {
    // alignItems: 'left'
  },
  action: {
    textAlign: 'left',
    color: '#FF0000'
  },
  header: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  status: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'normal',
    textAlign: 'left',
  },  
});



//   constructor(props) {
//     super(props)

//   }
//   debugger
//   render() {
//     return (
//       <RootStack />
//     );
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
