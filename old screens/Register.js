import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, Dimensions, StatusBar, ScrollView, Image, StyleSheet, TextInput, ImageBackground, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { BG1, BG2, a, b, c, d, colorAA, colorAlfa, colorBetta, colorKappa, colorZeta, colorDelta, colorOmega, } from '../Colors';
import BTN from '../components/BTN.js';
import LinearGradient from 'react-native-linear-gradient';
import { serverCrm, base_url, file_server1 } from '../Env';
import axios from 'axios';
import md5 from 'md5';
import AsyncStorage from '@react-native-community/async-storage'
import UserContext from '../contexts/UserContext'


export default function Register(props) {
  const { navigation } = props
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [editable, setEditable] = useState(false)
  const [BtnDisable, setBtnDisable] = useState(false)
  const [Load, setLoad] = React.useState(false)
  const [error, seterror] = useState(false);
  const [msg, setmsg] = useState("");
  const { userDetails, setUserDetails } = useContext(UserContext)
  const [formInfo, setFormInfo] = useState({ title: "", name: "", surname: "", identification: "", phone: "", email: "", password: "", password2: "" })
  //  const [formInfo, setFormInfo] = useState({ title: "ing", name: "douglas jesus", surname: "matos parra", identification: "18868371", phone: "3124348384", email: "dougrafic.art@gmail.com", password: "123456", password2: "123456" })
  function onChangeText(text, key) { setFormInfo({ ...formInfo, [key]: text }) }
  function goToScreen(screen) { navigation.navigate(screen) }

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
    console.log("formInfo: ", formInfo);
    if (formInfo.title === "" || formInfo.name === "" || formInfo.surname === "" || formInfo.identification === "" || formInfo.phone === "" || formInfo.email === "" || formInfo.password === "" || formInfo.password2 === "") {
      console.log("1")
      setmsg("Error! \n Debe completar el formulario.");
      seterror(true);
    }
    else {
      console.log("2")
      if (formInfo.password !== formInfo.password2) {
        console.log("3")
        setmsg("Error! \n Las contraseñas no coinciden.");
        seterror(true);
      }
      else {
        console.log("4")
        setLoad(true)
        const data = { ...formInfo }
        let passmd5 = md5(data.password);
        data.pass = passmd5
        axios.post(base_url(serverCrm, `telesalud/register/medic`), data).then(function (response) {
          setLoad(false)
          if (response.data[0] === true) {
            console.log("registro exitoso")
            _storeData(response.data[1])
          }
          if (response.data[0] === false) {
            setmsg("Error! \n" + response.data[1]);
            seterror(true);
          }

        })
      }
    }
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
      }}>
        <ScrollView>
          <View style={{
            width: "100%", marginVertical: "10%", alignItems: "center",
            alignContent: "center",
            justifyContent: "center"
          }}>
            <View style={{
              marginTop: "15%",
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
                <TextInput style={{ paddingHorizontal: 10, width: "90%" }} placeholderTextColor="#777"
                  value={formInfo.title} placeholder="Ing / Lic / Dr / etc..." onChangeText={text => onChangeText(text, 'title')} />
              </View>
              <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
                <TextInput style={{ paddingHorizontal: 10, width: "90%" }} placeholderTextColor="#777"
                  value={formInfo.name} placeholder="Nombres" onChangeText={text => onChangeText(text, 'name')} />
              </View>
              <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
                <TextInput style={{ paddingHorizontal: 10, width: "90%" }} placeholderTextColor="#777"
                  value={formInfo.surname} placeholder="Apellidos" onChangeText={text => onChangeText(text, 'surname')} />
              </View>
              <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
                <TextInput style={{ paddingHorizontal: 10, width: "90%" }} placeholderTextColor="#777"
                  value={formInfo.identification} placeholder="Identificación" onChangeText={text => onChangeText(text, 'identification')} />
              </View>
              <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
                <TextInput style={{ paddingHorizontal: 10, width: "90%" }} placeholderTextColor="#777"
                  value={formInfo.phone} placeholder="Teléfono" onChangeText={text => onChangeText(text, 'phone')} />
              </View>
              <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
                <TextInput style={{ paddingHorizontal: 10, width: "90%" }} placeholderTextColor="#777"
                  value={formInfo.email} placeholder="E-mail" onChangeText={text => onChangeText(text, 'email')}
                  keyboardType={'email-address'} />
              </View>
              <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
                <TextInput style={{ paddingHorizontal: 10, width: "90%" }} placeholderTextColor="#777"
                  value={formInfo.password} placeholder="Contraseña" onChangeText={text => onChangeText(text, 'password')}
                  secureTextEntry />
              </View>
              <View style={{ borderRadius: 12, width: "85%", marginBottom: 20, flexDirection: "row", backgroundColor: "rgba(255,255,255,1)" }}>
                <TextInput style={{ paddingHorizontal: 10, width: "90%" }} placeholderTextColor="#777"
                  value={formInfo.password2} placeholder="Repetir Contraseña" onChangeText={text => onChangeText(text, 'password2')}
                  secureTextEntry />
              </View>
              <BTN icon="" text="Registrar" function={sendForm} screen="Login" data={""} w={"60%"} />
            </View>
            <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 10, marginTop: 40, justifyContent: "space-around", }}>


              <BTN icon="" text="Iniciar" function={goToScreen} screen="Login" data={"Login"} w={"45%"} />


              <BTN icon="" text="Recuperar" function={goToScreen} screen="Forgot" data={"Forgot"} w={"45%"} />
              {/* 

           <TouchableOpacity onPress={() => goToScreen('Login')} style={{ width: "45%", paddingVertical: 10, paddingHorizontal: 10, borderColor: "white", borderWidth: 0, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 12 }}>
                <Text style={{ color: "white", fontSize: 14, textAlign: "center", fontWeight: "bold" }}>Login</Text>
              </TouchableOpacity> 
              <TouchableOpacity onPress={() => goToScreen('Forgot')} style={{ width: "45%", paddingVertical: 10, paddingHorizontal: 10, borderColor: "white", borderWidth: 0, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 12 }}>
                <Text style={{ color: "white", fontSize: 14, textAlign: "center", fontWeight: "bold" }}>Olvidé mi contraseña</Text>
              </TouchableOpacity>
            */}
            </View>
            <View style={{ width: 250, height: 40, marginTop: 40 }}>
              <Image style={{ width: null, height: null, flex: 1, resizeMode: "cover" }} source={require("../images/logoblanco.png")} />
            </View>
          </View>
        </ScrollView>
      </View>
      {
        Load &&
        <View style={{ position: "absolute", zIndex: 999, flex: 1, width: "100%", height: "100%", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", }}>
          <ActivityIndicator size={60} color={colorZeta} />
          <Text style={{ textAlign: "center", color: colorZeta, marginTop: 20 }}>Por favor espere...</Text>
        </View>
      }
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
        opacity: 0.5,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
      }}>
      </ImageBackground>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({});