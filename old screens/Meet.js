import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import JitsiMeet, { JitsiMeetView, } from 'react-native-jitsi-meet';
import { Icon } from 'react-native-eva-icons';
import Rating from '../components/Rating.js';
import { serverCrm, base_url } from '../Env'
import axios from 'axios'
import SideBarMeet from '../components/SideBarMeet.js';
import { colorBetta, colorZeta } from '../Colors.js';

function Meet(props) {
  const [data, setdata] = useState(props.route.params.data);
  const url = `https://meet.jit.si/${props.route.params.key_conference}`;
  const userInfo = {
    displayName: props.route.params.data.paciente.names,
    email: props.route.params.data.paciente.email,
    avatar: 'https://wellezy.com/wp-content/uploads/2021/08/logocolor-1.png'
  };

  const [rating, setrating] = useState(false);
  const [successfull, setsuccessfull] = useState(false);
  const [Load, setLoad] = useState(false);
  const [debugID, setdebugID] = useState(0);
  const [_debugID, set_debugID] = useState(0);

  let randomCode
  if (props.route.params) {
    randomCode = props.route.params.randomCode
  } else {
    randomCode = 1
  }

  useEffect(() => {
    JitsiMeet.call(url, userInfo);
  }, [randomCode]);
  function onConferenceWillJoin(nativeEvent) {
    console.log("... integrando ...");
  }
  function onConferenceJoined(nativeEvent) {
    console.log("... integrado con exito...");
    set_debugID(nativeEvent._dispatchInstances._debugID);
  }
  function onConferenceTerminated(nativeEvent) {
    console.log("... finalizado ---");
    JitsiMeet.endCall();
    setrating(true);
    set_debugID(0);
  }
  function SetRating() {
    setrating(false);
    cambiarestado(data.code)
    props.navigation.navigate("Sala", { randomCode: Math.random() });
  }
  function GetRating(v) {
    let data = {
      id: props.route.params.data.id,
      value: v,
      type: "medic"
    }
    console.log("data->", data);
    SaveRatingValoration(data);
  }
  async function SaveRatingValoration(data) {
    setLoad(true)
    await axios.post(base_url(serverCrm, `save/rating/valoration`), data).then(function (response) {
      setsuccessfull(true);
      setLoad(false);
    })
      .catch(function (error) {
      })
  }

  useEffect(() => {
    if (successfull === true) {
      setTimeout(() => {
        setrating(false);
        setsuccessfull(false);
        cambiarestado(data.code)
        props.navigation.navigate("Sala", { randomCode: Math.random() })
      }, 3000);
    }
  }, [successfull]);



  async function RETRY() {
    await JitsiMeet.endCall();
    setTimeout(() => {
      console.log("reintentando...")
      JitsiMeet.call(url, userInfo);
    }, 1000);
  }


  async function cambiarestado(valor) {
    let data = { code: valor };
    console.log("data",data);
    await axios.post(base_url(serverCrm, `save/change/state/valoration/toThree`), data);
  }



console.log("data",data)


return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colorBetta }}>
    {
      _debugID === 0 &&
      <View style={{ position: "absolute", zIndex: 99999999, width: "100%", height: "100%", alignContent: "center", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", flex: 1 }}>
        <ActivityIndicator color="white" size={60} />
        <TouchableOpacity onPress={() => RETRY()} style={{ justifyContent: "center", alignContent: "center", alignItems: "center", height: 100, width: 100, borderRadius: 50 }}>
          <Text style={{ color: colorZeta, textAlign: "center" }}>Clíc aquí para Reintentar</Text>
        </TouchableOpacity>
      </View>
    }
    <SideBarMeet data={data} />
    <JitsiMeetView
      onConferenceTerminated={e => onConferenceTerminated(e)}
      onConferenceJoined={e => onConferenceJoined(e)}
      onConferenceWillJoin={e => onConferenceWillJoin(e)}
      style={{
        marginBottom: 0,
        height: '100%',
        width: '100%',
      }}
    />
    <Modal animationType="slide" transparent={true} visible={rating} >
      <View style={{ backgroundColor: "rgba(0,0,0,0.5)", width: "100%", height: "100%", position: "absolute", justifyContent: "center", zIndex: 999, alignContent: "center", alignItems: "center", }}>
        <View style={{ backgroundColor: "#FFF", flexDirection: "column", borderRadius: 12, overflow: "hidden", width: "90%" }} >
          <View style={{ paddingVertical: 30, paddingHorizontal: 15, backgroundColor: colorBetta }}>
            <Text style={{ textAlign: "center", color: colorZeta, fontSize: 16 }}>Por favor, valora la calidad de la video llamada</Text>
          </View>
          {
            Load &&
            <View style={{ marginVertical: 40 }}>
              <ActivityIndicator color={colorBetta} size={50} />
            </View>
          }
          {
            !Load && successfull === false &&
            <View style={{ padding: 20, flexDirection: "column" }}>
              <Rating GetRating={GetRating} SetRating={SetRating} />
            </View>
          }
          {
            !Load && successfull === true &&
            <View style={{ marginVertical: 10, justifyContent: "center", alignItems: "center", alignContent: "center", width: "100%" }}>
              <Icon name='checkmark-circle-outline' width={60} height={60} fill={colorBetta} />
              <Text style={{ textAlign: "center", fontSize: 18, color: "#555", marginVertical: 15 }}>
                Gracias por calificarnos!
              </Text>
            </View>
          }
        </View>
      </View>
    </Modal>
  </SafeAreaView>
)
}
const styles = StyleSheet.create({
  modal_warp: {
    width: "100%",
    top: 0,
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    zIndex: 999,
    alignContent: "center",
    alignItems: "center",
  },
  modal_container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    elevation: 50,
    backgroundColor: "#FFF",
    flexDirection: "column",
    borderRadius: 12,
    overflow: "hidden",
    width: "90%"
  },
  modal_head: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    backgroundColor: colorBetta
  },
  modal_head_text: {
    textAlign: "center",
    color: colorZeta,
    fontSize: 16
  }
});
export default Meet;