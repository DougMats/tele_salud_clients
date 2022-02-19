import React, { useState, useContext, useEffect } from 'react';
import { StatusBar, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity, View, Text, TextInput, Image } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import md5 from 'md5';
import { serverCrm, base_url } from '../Env'
import axios from 'axios'
import { colorAA, colorAlfa, colorBetta, colorBettaLight, colorDelta, } from '../Colors';
import JitsiMeet, { JitsiMeetView, JitsiMeetEvents } from 'react-native-jitsi-meet';
import UserContext from '../contexts/UserContext'
function Sala(props) {
  const [Status, setStatus] = useState("off");
  const [Code, setCode] = useState({ code: "" }); //MkD2A
  const [ViewKey, setViewKey] = useState(true);
  const [data, setdata] = useState(null);
  const [ready, setready] = useState(false);
  const [totalInfo, settotalInfo] = useState(null);
  const { userDetails, setUserDetails } = useContext(UserContext)

  let randomCode
  if (props.route.params) {
    randomCode = props.route.params.randomCode
  } else {
    randomCode = 1
  }

  useEffect(() => {
    JitsiMeet.endCall();
    if (props.route.params !== undefined) {
      onChangeText(props.route.params.key_conference, 'code')
      //setCode(""+props.route.params.key_conference+"")
    }
  }, [randomCode]);

  function onChangeText(text, key) {
    setCode({
      ...Code,
      [key]: text
    })
  }

  async function sendCode() {
    if (Code.code === "") {
      Toast.show("No se admiten campos vacios.")
    }
    else {
      setStatus("wait")
      let data;
      let check = await checkCodeValoration(Code.code);
      if (check[0] === true) {
        setdata(check[1])
      }
      else { setStatus("error") }
    }
  }

  async function checkCodeValoration(code) {
    let check
    console.log()
    await axios.get(base_url(serverCrm, `search/code/meet/${code}`)).then(function (response) {
      check = response.data
    })
      .catch(function (error) { console.log("?", error) })
      .then(function () { });
    return check;
  }

  async function Get(code) {
    axios.get(base_url(serverCrm, `get/cita/${code}`)).then(function (response) {
      settotalInfo(response.data)
    })
      .catch(function (error) { console.log("?", error) })
  }

  useEffect(() => {
    if (totalInfo !== null) {
      goToScreenMeet(totalInfo)
    }
  }, [totalInfo]);

  function goToScreenMeet(data) {
    setStatus("off")
    let key_conference = md5(data.code);
    console.log("send key: ", key_conference);
    props.navigation.navigate("Meet", { randomCode: Math.random(), key_conference, data })
  }

  function goToScreen(screen, data) {
    setStatus("off")
    props.navigation.navigate(screen, { randomCode: Math.random(), data })
  }
  useEffect(() => {
    if (data !== null) {
      if (data.state === 3) {
        console.log("realizada")
        setStatus("done");
        setready(false);
      }
      if (data.state === 4) {
        console.log("cancelada")
        setStatus("cancel");
        setready(false);
      }
      if (data.photos === "si" && data.state === 0) {
        console.log("pendiente por historial clínico");
        setStatus("successful");
        setready(false);
        setTimeout(() => { goToScreen("Historyclinic", data) }, 3000);
      }
      if (data.photos === "si" && data.state === 1) {
        console.log("pendiente por subir fotos");
        setStatus("successful");
        setready(false);
        setTimeout(() => { goToScreen("UploadPhotos", data) }, 3000);
      }
      if (data.photos === "si" && data.state === 2) {
        console.log("por realizar");
        setStatus("successful");
        setready(true);
        setTimeout(() => { Get(data.code); }, 1000);
      }
      if (data.photos === "no" && data.state === 0) {
        console.log("pendiente por historial clínico");
        setStatus("successful");
        setready(false);
        setTimeout(() => { goToScreen("Historyclinic", data) }, 3000);
      }
      if (data.photos === "no" && data.state === 1) {
        console.log("por realizar");
        setStatus("successful");
        setready(true);
        setTimeout(() => { Get(data.code); }, 1000);
      }
    }
  }, [data]);
  function simpleText(text) {
    var separa = text.split(" ");
    var text = separa[0];
    return text;
  }

  useEffect(() => {
    if (Status === "off") {
      //setCode({ code: "" });
    }
  }, [Status]);

  try {

  } catch (error) {
    console.log(error)
  }

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="ligth-content" />
      <LinearGradient
        colors={[colorAA, colorAlfa, colorBetta, colorBettaLight, colorAlfa]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.wrapper}
      >
        <View style={{ width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center", height: "100%" }}>
          {Status === "off" &&
            <View style={styles.card}>
              <Text style={{ width: "90%", textAlign: "center" }}>Ingrese el código de invitación para acceder a la sala de conferencia virtual.</Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  onChangeText={text => onChangeText(text, 'code')}
                  placeholder="Código"
                  value={Code.code}
                  secureTextEntry={ViewKey}
                  style={{
                    borderRadius: 8, textAlign: "center", marginVertical: 10, borderWidth: 1, borderColor: "#00A7B4", width: "80%", height: 40
                  }}>
                </TextInput>
                <TouchableOpacity onPress={() => setViewKey(!ViewKey)} style={{ right: 5, top: 20, position: "absolute", zIndex: 999, }}>
                  <Icon name={ViewKey ? "eye-outline" : "eye-off-outline"} fill='silver' height={20} width={20} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => sendCode()} style={{ justifyContent: "center", backgroundColor: "#00A7B4", width: "60%", height: 30, borderRadius: 8 }}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "bold", textAlign: "center" }}>Acceder</Text>
              </TouchableOpacity>
            </View>
          }
          {
            Status === "wait" &&
            <View style={styles.card}>
              <Text style={{ lineHeight: 60 }}>
                Por favor espere...
              </Text>
              <ActivityIndicator size="large" color='#00AFE8' />
              <TouchableOpacity onPress={() => setStatus("off")} style={{ marginTop: 20 }}>
                <Text style={{ color: colorBetta }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          }
          {Status === "error" &&
            <View style={styles.card}>
              <Icon name="alert-triangle-outline" fill={colorBetta} height={60} width={60} />
              <Text style={{ textAlign: "center", margin: 20, fontWeight: "600", fontSize: 14 }}>
                Error, código no autorizado.
              </Text>
              <TouchableOpacity
                onPress={() => setStatus("off")}
                style={{ backgroundColor: colorBetta, borderRadius: 12, width: "80%", paddingVertical: 10 }}>
                <Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 14 }}>
                  Reintentar con otro código
                </Text>
              </TouchableOpacity>
            </View>
          }
          {Status === "cancel" &&
            <View style={styles.card}>
              <Icon name="alert-triangle-outline" fill={"red"} height={60} width={60} />
              <Text style={{ color: "#555", textAlign: "center", marginHorizontal: 20, marginVertical: 15, lineHeight: 20, fontWeight: "bold", fontSize: 14 }}>
                Hola {simpleText(data.names)}, esta video valoración fue cancelada.
              </Text>
              <TouchableOpacity
                onPress={() => setStatus("off")}
                style={{ backgroundColor: colorBetta, borderRadius: 12, width: "80%", paddingVertical: 10 }}>
                <Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 14 }}>
                  Reintentar con otro código
                </Text>
              </TouchableOpacity>
            </View>
          }
          {Status === "done" &&
            <View style={styles.card}>
              <Icon name="alert-triangle-outline" fill={colorDelta} height={60} width={60} />
              <Text style={{ color: "#555", textAlign: "center", marginHorizontal: 20, marginVertical: 15, lineHeight: 20, fontWeight: "bold", fontSize: 14 }}>
                Hola {simpleText(data.names)}, esta video Valoración ya fue realizada
              </Text>
              <TouchableOpacity
                onPress={() => setStatus("off")}
                style={{ backgroundColor: colorBetta, borderRadius: 12, width: "80%", paddingVertical: 10 }}>
                <Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 14 }}>
                  Reintentar con otro código
                </Text>
              </TouchableOpacity>
            </View>
          }
          {Status === "successful" && data !== null &&
            <View style={[styles.card, { width: "90%" }]}>
              <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "bold", color: "#555", textTransform: "capitalize" }}>Hola! {data.surnames} {data.names}</Text>
              {ready === true ?
                <>
                  <View style={{ width: 160, height: 160 }}>
                    <Image
                      style={{ width: null, height: null, resizeMode: "cover", flex: 1 }}
                      source={require("../images/formThree.png")}
                    />
                  </View>
                  <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, width: "90%", marginVertical: 10 }}>Has completado los requisitos para entrar a la video valoración.</Text>
                </>
                :
                <>
                  <View style={{ width: 160, height: 160 }}>
                    <Image
                      style={{ width: null, height: null, resizeMode: "cover", flex: 1 }}
                      source={require("../images/formOne.png")}
                    />
                  </View>
                  <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, width: "90%", marginVertical: 10 }}>Aun no has completado los requisitos para entrar a la video valoración. {"\n"} Sólo falta un paso.</Text>
                </>
              }
            </View>
          }
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    width: 250,
    paddingVertical: 20,
    marginTop: "-10%"
  },
})
export default Sala;

