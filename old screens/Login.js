import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Dimensions, StatusBar, Image, StyleSheet, TextInput, ImageBackground, Text, View, TouchableOpacity, ActivityIndicator, Touchable } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import {BG1, BG2, a, b, c, d, colorAA, colorAlfa, colorBetta, colorKappa, colorZeta, colorDelta, colorOmega, } from '../Colors';
import BTN from '../components/BTN.js';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage'
import UserContext from '../contexts/UserContext'
import { serverCrm, base_url, file_server1 } from '../Env';
import axios from 'axios';
import md5 from 'md5';

export default function Login(props) {
  const { navigation } = props
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [editable, setEditable] = useState(true)
  const [BtnDisable, setBtnDisable] = useState(false)
  const [Load, setLoad] = React.useState(false)
  const { userDetails, setUserDetails } = useContext(UserContext)
  const [error, seterror] = useState(false);
  const [msg, setmsg] = useState("");

  function goToScreen(screen) {
    navigation.navigate(screen)
  }

  const [formInfo, setFormInfo] = useState({
    email: '',
    password: ''
    // email: 'dougrafic.art@gmail.com',
    // password: 'Qwerty'
  })

  function onChangeText(text, key) {
    setFormInfo({
      ...formInfo,
      [key]: text
    })
  }

  const _storeData = async (data) => {
    try {
      await AsyncStorage.setItem('@Passport', JSON.stringify(data));
      setUserDetails({ ...data })
      goToScreen("Home")
    }
    catch (error) {
      console.log("error", error)
    }
  }


  function sendForm() {
    setLoad(true)
    const data = { ...formInfo }
    let passmd5 = md5(data.password);
    data.pass = passmd5
    console.log("send form", data)



    // data.fcmToken = notificationToken
    // if (data.email === '' || data.password === '') {
    //   Toast.show("Introduce tus datos de acceso")
    //   return false;
    // }
    // setLoad(true)
    // setBtnDisable(true)
    // console.log(base_url(serverCrm, `telesalud/authenticate/medic`))

    axios.post(base_url(serverCrm, `telesalud/authenticate/medic`), data).then(function (response) {
      if (response.data[0] === true) {
        _storeData(response.data[1])
      }
      if (response.data[0] === false) {
        setmsg("Error! \n" + response.data[1]);
        seterror(true);
      }
      setLoad(false)
    })

    //   .catch(function (error) {
    //setLoad(!Load)
    //     setBtnDisable(false)
    //     console.log(error, 'Error al enviar formulario')
    //     Toast.show("Email or password was not correct")
    //   })
    //   .then(function () { });
  }

  useEffect(() => {
    if (error === true) {
      setTimeout(() => {
        setmsg("");
        seterror(false);
      }, 3000);
    }
  }, [error]);

  return (
    <LinearGradient colors={[BG1, BG2]} style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{
        position: "absolute",
        zIndex: 99,
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center"
      }}>
        <View style={{
          alignItems: "center",
          alignContent: "center",
          backgroundColor: "rgba(255,255,255,0.6)",
          flexDirection: "column",
          width: windowWidth - 40,
          maxHeight: windowHeight - 40,
          paddingHorizontal: 10,
          paddingVertical: 40,
          borderRadius: 20,
        }}>
          <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
            <TextInput
              style={{ paddingHorizontal: 10 }}
              value={formInfo.email}
              placeholder="email"
              placeholderTextColor="#777"
              keyboardType={'email-address'}
              editable={editable}
              onChangeText={text => onChangeText(text, 'email')}
            />
            <View style={{ position: "absolute", right: 10, top: 10 }}>
              <Icon name='email' width={25} height={25} fill={colorAlfa} />
            </View>
          </View>
          <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
            <TextInput
              secureTextEntry
              style={{ paddingHorizontal: 10 }}
              value={formInfo.password}
              placeholder="password"
              placeholderTextColor="#777"
              onChangeText={text => onChangeText(text, 'password')} />
            <View style={{ position: "absolute", right: 10, top: 10 }}>
              <Icon name='lock' width={25} height={25} fill={colorAlfa} />
            </View>
          </View>
          {Load &&
            <ActivityIndicator size={40} color={colorAlfa} />
          }
          {!Load &&
            <BTN icon="" text="Entrar" function={sendForm} screen="Login" data={""} w={"60%"} />
          }
        </View>
        <View style={{ flexDirection: "row", width: "100%", marginTop: 40, justifyContent: "space-around", }}>
          <BTN icon="" text="Olvidé mi contraseña" function={goToScreen} screen="Forgot" data={"Forgot"} w={"50%"} />
          <BTN icon="" text="Crear una cuenta" function={goToScreen} screen="Register" data={"Register"} w={"40%"} />
        </View>
        <View style={{ width: 250, height: 40, marginTop: 40 }}>
          <Image style={{ width: null, height: null, flex: 1, resizeMode: "cover" }} source={require("../images/logoblanco.png")} />
        </View>
      </View>
      {
        error &&
        <TouchableOpacity onPress={() => seterror(false)} style={{ alignContent: "center", alignItems: "center", position: "absolute", zIndex: 999, flex: 1, width: "100%", height: "100%", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", }}>
          <View style={{ backgroundColor: colorZeta, paddingHorizontal: 20, paddingVertical: 40, width: "80%", borderRadius: 20 }}>

            <View style={{ alignItems: "center" }}>
              <Icon name='alert-circle-outline' width={50} height={50} fill={colorDelta} />
            </View>
            <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "bold", color: "black", marginTop: 20 }}>{msg}</Text>
          </View>
        </TouchableOpacity>
      }
      <ImageBackground source={require('../images/solo-fondo.png')} style={{
        position: "absolute",
        zIndex: 1,
        flex: 1,
        justifyContent: "center",
        resizeMode: "cover",
        width: "100%",
        height: "100%",
        opacity: 0.9,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
      }}>
      </ImageBackground>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({});