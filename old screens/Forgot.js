import React, { useState } from 'react';
import { Dimensions, StatusBar, Image, StyleSheet, TextInput, ImageBackground, View, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { BG1, BG2, colorAlfa, } from '../Colors';
import BTN from '../components/BTN.js';
import LinearGradient from 'react-native-linear-gradient';

export default function Forgot(props) {
  const { navigation } = props
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [editable, setEditable] = useState(false)
  const [BtnDisable, setBtnDisable] = useState(false)
  const [Load, setLoad] = React.useState(false)


  const [formInfo, setFormInfo] = useState({
    email: '',
    password: 'qwerty'
  })

  function onChangeText(text, key) {
    setFormInfo({
      ...formInfo,
      [key]: text
    })
  }

  function goToScreen(screen) {
    navigation.navigate(screen)
  }

  function sendForm() {

    // const data = {
    //   ...formInfo
    // }
    // data.fcmToken = notificationToken
    // if (data.email === '' || data.password === '') {
    //   Toast.show("Introduce tus datos de acceso")
    //   return false;
    // }
    // setLoad(true)
    // setBtnDisable(true)
    // console.log(base_url(serverCrm, `wellezy/authMed`))
    // axios.post(base_url(serverCrm, `wellezy/authMed`), data).then(function (response) {
    //   console.log(response.data, "SAAS")
    //   _storeData(response.data)
    //   setLoad(false)
    //   setBtnDisable(false)
    // })
    //   .catch(function (error) {
    //setLoad(!Load)
    //     setBtnDisable(false)
    //     console.log(error, 'Error al enviar formulario')
    //     Toast.show("Email or password was not correct")
    //   })
    //   .then(function () { });
  }


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
              // editable={editable}
              onChangeText={text => onChangeText(text, 'email')}
            />
            <View style={{ position: "absolute", right: 10, top: 10 }}>
              <Icon name='email' width={25} height={25} fill={colorAlfa} />
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
          <BTN icon="" text="Iniciar" function={goToScreen} screen="Login" data={"Login"} w={"45%"} />
          <BTN icon="" text="Registrar" function={goToScreen} screen="Register" data={"Register"} w={"45%"} />

          {/* <TouchableOpacity onPress={() => goToScreen('Register')} style={{ width: "45%", paddingVertical: 10, paddingHorizontal: 10, borderColor: "white", borderWidth: 0, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 12 }}>
            <Text style={{ color: "white", fontSize: 14, textAlign: "center", fontWeight: "bold" }}>Registrarme</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => goToScreen('Login')} style={{ width: "45%", paddingVertical: 10, paddingHorizontal: 10, borderColor: "white", borderWidth: 0, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 12 }}>
            <Text style={{ color: "white", fontSize: 14, textAlign: "center", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{ width: 250, height: 40, marginTop: 40 }}>
          <Image style={{ width: null, height: null, flex: 1, resizeMode: "cover" }} source={require("../images/logoblanco.png")} />
        </View>
      </View>
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