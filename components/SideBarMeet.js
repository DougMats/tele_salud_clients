import React, { useCallback, useState, useRef, useEffect } from "react";
import { AppRegistry, TouchableOpacity, Animated, Text, Image, View, Alert, ActivityIndicator, StyleSheet, Button, Dimensions, SafeAreaView, ScrollView } from "react-native";
import { Icon } from 'react-native-eva-icons';
import { colorAlfa, colorBetta } from '../Colors.js';
import { serverCrmTestDrawer, serverCrm, base_url, file_server1 } from '../Env'
import RNFetchBlob from "rn-fetch-blob";
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas'; // canvas advanced
import socketIOClient from 'socket.io-client/dist/socket.io.js'
var RNFS = require('react-native-fs')




const SideBar = (props) => {
  const screen = Dimensions.get("window");
  const [Show, setShow] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [socket, setsocket] = useState(false);
  const [displayDrawer, setdisplayDrawer] = useState(null);
  const [photoSelected, setphotoSelected] = useState(null);
  const [viewListImg, setviewListImg] = useState(false);
  const [cero, setcero] = useState(false);
  const [one, setone] = useState(false);
  const [tools, settools] = useState(false);
  const [listphotos, setlistphotos] = useState(props.data.images)
  const [downloading, setDownloading] = React.useState(true)

  React.useEffect(() => {
    console.log(['. . . . . . . . . .  SOCKET SERVER CONNECTING . . . . . . . . . . . . . . ']);
    setsocket(socketIOClient("http://31.220.60.218:3000"))
  }, [])


  React.useEffect(() => {
    if (socket) {
      console.log(['. . . . . . . . . .  POSTS SERVER PROVISIONING . . . . . . . . . . . . . . '])
      socket.on('askForUserId', () => {
        console.log(['. . . . . . . . . .  POSTS SERVER CONNECTED123 . . . . . . . . . . . . . . '])
        socket.emit('userIdReceived', props.data.id_client);
      })
      socket.on('displayImage', (data) => {
        console.log(['______________________________ get la imagen ______________________________']);
        console.log("uri ->", data.uri);
        setdisplayDrawer(data.uri);
      })
      socket.on('disconnect', () => {
        console.log(['. . . . . . . . . . . . . . . . . . . POSTS SERVER DISCONNECTED  . . . . . . . . . . . . . . . . . . .'])
      })
    }
  }, [socket])


  useEffect(() => {
    if (displayDrawer !== null) {
      //setShow(true);
      fadeIn()
      console.log("view image in web")
      console.log(`http://31.220.60.218:3000/${displayDrawer}`)
    }
  }, [displayDrawer]);


  const fadeIn = () => {
    console.log("in")
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start();
    setShow(true);
  };


  const fadeOut = () => {
    console.log("out")
    Animated.timing(fadeAnim, {
      toValue: screen.width,
      duration: 100,
      useNativeDriver: true
    }).start();
    setShow(false);
  };

  useEffect(() => {
    setviewListImg(false)
  }, [photoSelected]);

  return (
    <SafeAreaView style={
      {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 9999,
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        width: Show === false ? 50 : screen.width,
        height: Show === false ? 50 : screen.height,
      }}>



      {Show === false &&
        <TouchableOpacity onPress={fadeIn}
          style={{backgroundColor:"white", width:50, height:50, borderRadius:25, justifyContent:"center",alignContent:"center", alignItems:"center", position: "absolute", right: 10, top: 10, zIndex: 999 }}>
          <Icon name="more-vertical-outline" width={30} height={30} fill="#000" />
        </TouchableOpacity>
      }
      {Show === true &&
        <TouchableOpacity onPress={fadeOut}
          style={{backgroundColor:"white", width:50, height:50, borderRadius:25, justifyContent:"center",alignContent:"center", alignItems:"center", position: "absolute", right: 10, top: 10, zIndex: 999 }}>
          <Icon name="close-outline" width={30} height={30} fill="#000" />
        </TouchableOpacity>
      }



      <Animated.View
        style={{
          transform: [{ translateX: fadeAnim }],
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: "100%",
          width: "100%",
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 9,
          backgroundColor: "rgba(0,0,0,0)"

        }}>
        {Show && displayDrawer !== null &&
          <View style={{ width: "100%", height: "110%", top: 30, backgroundColor: "white", }}>
            <Image source={{ uri: `http://31.220.60.218:3000/${displayDrawer}` }} style={{ flex: 1, width: null, height: null, resizeMode: "cover" }} />
            <View style={{ position: "absolute", zIndex: -1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
              <ActivityIndicator size={20} color={"#777"} />
              <Text style={{ color: "#777", fontSize: 12, marginTop: 10 }}>Cargando imagen...</Text>
            </View>
          </View>
        }
        {Show && displayDrawer === null &&
          <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.5)", padding: 20, borderRadius: 20 }}>
            <Icon name="image-outline" width={200} height={200} fill="#333" />
            <Text style={{ width: "100%", color: "#333", textAlign: "center", fontSize: 20 }}>No haz recibido nunguna imagen!</Text>
          </View>
        }
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    zIndex: 9999,
    position: "absolute",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center"
  },
  sidebar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    width: "100%",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 9,
    backgroundColor: "rgba(0,0,0,0)"
  },
  btnDrawer: {
    marginHorizontal: 5,
    marginVertical: 8,
    height: 35,
    width: 60,
    backgroundColor: colorAlfa,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  btnDrawer2: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 35,
    height: 35,
    borderRadius: 15,
  }
});
export default SideBar;
