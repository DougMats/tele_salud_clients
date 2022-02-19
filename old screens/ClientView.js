import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Head from '../components/Head.js';
import Menu from '../components/Menu.js';
import { serverCrm, base_url, file_server1 } from '../Env'
import axios from 'axios'
import UserContext from '../contexts/UserContext'
import LinearGradient from 'react-native-linear-gradient';
import {BG1,BG2, a, b, c, d, colorAA, colorAlfa, colorBetta, colorKappa, colorZeta, colorDseta, colorDelta, colorOmega, colorTau, colorEpsilon, } from '../Colors';
import BTN from '../components/BTN.js';
import { Icon } from 'react-native-eva-icons';
import NewMeet from '../components/NewMeet.js';
import Small from '../components/Time/Small.js';
import md5 from 'md5';
import Share from 'react-native-share';

function ClientView(props) {
  const [Load, setLoad] = useState(true);
  const [NewCita, setNewCita] = useState(false);
  const [ViewList, setViewList] = useState(false);
  const [List, setList] = useState([]);
  const [editing, setediting] = useState(false);
  const [ViewMore, setViewMore] = useState(false);

  let randomCode
  if (props.route.params) {
    randomCode = props.route.params.randomCode
  } else {
    randomCode = 1
  }

  useEffect(() => {
    GetList(props.route.params.data.id)
  }, [randomCode]);

  async function GetList(id) {
    let list
    //console.log(base_url(serverCrm, `get/list/valorations/client/${id}`))
    await axios.get(base_url(serverCrm, `get/list/valorations/client/${id}`)).then(function (response) {
      list = response.data
    })
      .catch(function (error) { console.log("?", error) })
      .then(function () { });
    setList(list)
    setLoad(false)
  }

  function goToScreen(screen, key_conference) {
    let from = "ClientView"
    props.navigation.navigate(screen, { randomCode: Math.random(), key_conference, from })
  }

  function goToQuotation(screen, key_conference) {
    //console.log("enviando ...: ", key_conference)
    let from = "ClientView"
    props.navigation.navigate(screen, { randomCode: Math.random(), key_conference, from})
  }





  function ViewHistory() {
    if (ViewList === false) {
      GetList(props.route.params.data.id)
    }
    setViewList(!ViewList)
  }

  function NewC() {
    setNewCita(!NewCita)

  }




function share(){
  console.log("share")
// Share.open(options)
// .then((res) => {
//   console.log(res);
// })
// .catch((err) => {
//   err && console.log(err);
// });
}





  return (
    <SafeAreaView style={{ flex: 1 }} >
      <StatusBar barStyle="dark-content" backgroundColor={colorZeta} />
      <LinearGradient colors={[BG1,BG2]} style={styles.imageBackground}>
        <Head props={props} from={props.route.params.from} />
        <ScrollView>
          <View style={styles.wrapper}>
            <View style={styles.wrap}>
              <View style={styles.row}>
                <Text style={styles.label}>Nombres:</Text>
                <Text style={styles.text}>{props.route.params.data.names}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Apellidos:</Text>
                <Text style={styles.text}>{props.route.params.data.surnames}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Identificación:</Text>
                <Text style={styles.text}>{props.route.params.data.identification}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.text}>{props.route.params.data.phone}</Text>
              </View>
              {ViewMore === true &&
                <>
                  <View style={styles.hr}></View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Edad:</Text>
                    <Text style={styles.text}>{props.route.params.data.age}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Fecha de Cumpleaños: </Text>
                    <Text style={styles.text}>{props.route.params.data.dateBirthDay}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Genero: </Text>
                    <Text style={styles.text}>{props.route.params.data.gender===1?"Másulino":"Femenino"}</Text>
                  </View>
                  <View style={styles.hr}></View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Ocupación:</Text>
                    <Text style={styles.text}>{props.route.params.data.occupation}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Estarto Social:</Text>
                    <Text style={styles.text}>{props.route.params.data.socialStratum}</Text>
                  </View>
                  <View style={styles.hr}></View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Usuario desde:</Text>
                    <Text style={styles.text}>{props.route.params.data.created_at}</Text>
                  </View>
                </>
              }
              <View style={{ width: "100%", alignItems: "center", alignContent: "center" }}>
                <TouchableOpacity
                  onPress={() => setViewMore(!ViewMore)}
                  style={{ paddingHorizontal: 20, paddingVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: colorDseta }}>
                  {ViewMore === true ?
                    <Text style={{ color: colorDseta, textAlign: "center", fontSize: 14 }}>Ver menos</Text>
                    :
                    <Text style={{ color: colorDseta, textAlign: "center", fontSize: 14 }}>Ver más</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
            {
              ViewList === false &&
              <BTN icon="list-outline" text="Historial de citas" function={ViewHistory} w={"90%"} data={'adcd'} />
            }
            {
              ViewList === true &&
              <View style={{ width: "100%", flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <BTN icon="close-outline" text="Historial de citas" function={ViewHistory} w={"90%"} data={'adcd'} />
                <View style={{ marginTop: 20, width: "100%", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                  {List.length === 0 &&
                    <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", borderColor: colorBetta, flexDirection: "column", borderWidth: 1, paddingVertical: 15, width: "80%", borderStyle: "dashed", borderRadius: 20 }}>
                      <Icon name="alert-triangle-outline" fill={colorBetta} width={40} height={40} />
                      <Text style={{ fontSize: 14, marginTop: 10, color: colorBetta, textAlign: "center" }}>No se han encontrado registros.</Text>
                    </View>
                  }
                  {
                    List.map((i, key) => {
                      return (
                        <View key={key} style={{ borderRightColor: colorBetta, borderRightWidth: 50, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 8.84, elevation: 5, borderRadius: 20, backgroundColor: "white", width: "90%", paddingHorizontal: 20, paddingVertical: 20 }}>
                         
                          <TouchableOpacity onPress={() => goToScreen("AdminMeet", i.code)} style={{ zIndex: 99999999, position: "absolute", top: 10, justifyContent: "center", alignContent: "center", alignItems: "center", right: -50, height: 40, width: 50, padding: 5, }}>
                            <Icon name='edit-outline' height={30} width={30} fill={colorZeta} />
                          </TouchableOpacity>
                          {/* 
                          <TouchableOpacity onPress={() =>share(i.code)} style={{ zIndex: 99999999, position: "absolute", top: 60, justifyContent: "center", alignContent: "center", alignItems: "center", right: -50, height: 40, width: 50, padding: 5, }}>
                            <Icon name='share-outline' height={30} width={30} fill={colorZeta} />
                          </TouchableOpacity>
                          */}
                          {i.state === 1 && i.photos === "no" &&
                            <TouchableOpacity onPress={() => goToScreen("Sala", i.code)} style={{ zIndex: 99999999, position: "absolute", bottom: 15, justifyContent: "center", alignContent: "center", alignItems: "center", right: -50, height: 40, width: 50, padding: 5, }}>
                              <Icon name='video-outline' height={30} width={30} fill={colorZeta} />
                            </TouchableOpacity>
                          }
                          {i.state === 2 && i.photos === "si" &&
                            <TouchableOpacity onPress={() => goToScreen("Sala", i.code)} style={{ zIndex: 99999999, position: "absolute", bottom: 15, justifyContent: "center", alignContent: "center", alignItems: "center", right: -50, height: 40, width: 50, padding: 5, }}>
                              <Icon name='video-outline' height={30} width={30} fill={colorZeta} />
                            </TouchableOpacity>
                          }
                          {i.state === 3 &&
                            <TouchableOpacity onPress={() => goToQuotation("Quotation", i.code)} style={{ zIndex: 99999999, position: "absolute", bottom: 15, justifyContent: "center", alignContent: "center", alignItems: "center", right: -50, height: 40, width: 50, padding: 5, }}>
                              <Icon name='clipboard-outline' height={30} width={30} fill={colorZeta} />
                            </TouchableOpacity>
                          }
                          <Text>Título: {i.name}</Text>
                          <Text>Código ó llave de entrada: {i.code}</Text>
                          <Text>Requiere fotografias: {i.photos}</Text>
                          <Text>Estado:
                            {i.state === 3 && <Text style={{ textTransform: "capitalize", fontSize: 14, fontWeight: "bold", color: "blue" }}> realizada</Text>}
                            {i.state === 4 && <Text style={{ textTransform: "capitalize", fontSize: 14, fontWeight: "bold", color: "red" }}> cancelada</Text>}
                            {i.photos === "si" && i.state === 0 && <Text style={{ textTransform: "capitalize", fontSize: 14, fontWeight: "bold", color: "orange" }}> pendiente por historial clínico</Text>}
                            {i.photos === "si" && i.state === 1 && <Text style={{ textTransform: "capitalize", fontSize: 14, fontWeight: "bold", color: "orange" }}> pendiente por subir fotos</Text>}
                            {i.photos === "si" && i.state === 2 && <Text style={{ textTransform: "capitalize", fontSize: 14, fontWeight: "bold", color: "green" }}> por realizar</Text>}
                            {i.photos === "no" && i.state === 0 && <Text style={{ textTransform: "capitalize", fontSize: 14, fontWeight: "bold", color: "orange" }}> pendiente por historial clínico</Text>}
                            {i.photos === "no" && i.state === 1 && <Text style={{ textTransform: "capitalize", fontSize: 14, fontWeight: "bold", color: "green" }}> por realizar</Text>}
                            {/*i.photos === "no" && i.state === 2 && <Text style={{ textTransform: "capitalize", fontSize: 14, fontWeight: "bold", color: "orange" }}>pendiente por historial clínico</Text>*/}
                          </Text>
                          <Text>Fecha programada: {i.scheduled_day}</Text>
                          <Text>Hora programada: {i.scheduled_time}</Text>
                          {i.state === 1 && i.photos === "no" &&
                            <Small days={i.scheduled_day} hours={i.scheduled_time} size={14} color={"#f00"} w={"100%"} />
                          }
                          {i.state === 2 && i.photos === "si" &&
                            <Small days={i.scheduled_day} hours={i.scheduled_time} size={14} color={"#f00"} w={"100%"} />
                          }
                        </View>
                      )
                    })
                  }
                </View>
              </View>
            }
            <View style={{ marginTop: 20 }} />
            {
              NewCita === false &&
              <BTN icon="calendar-outline" text="Registrar nueva cita" function={NewC} w={"90%"} data={'adcd'} />
            }
            {NewCita === true &&
              <View style={{ top: -40 }}>
                <TouchableOpacity onPress={() => setNewCita(!NewCita)} style={{ position: "absolute", right: 5, top: 55, zIndex: 999 }}>
                  <Icon name='close-circle-outline' height={30} width={30} fill={colorBetta} />
                </TouchableOpacity>
                <NewMeet user={props.route.params.data} hidden={() => setNewCita(!NewCita)} />
              </View>
            }
          </View>
        </ScrollView>
        <Menu props={props} option={2} />
      </LinearGradient>
    </SafeAreaView>
  )
}
export default ClientView;
const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
    width: "100%",
    height: "100%"
  },
  wrapper: {
    paddingTop: 50,
    paddingBottom: 60,
    width: "100%",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center"
  },
  wrap: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    flexDirection: "column",
    elevation: 5,
    borderRadius: 20,
    backgroundColor: "white",
    width: "90%",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15
  },
  btn: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    backgroundColor: colorAlfa,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 12,
    paddingVertical: 10,
    width: "90%",
    marginBottom: 20
  },
  btnText: {
    textTransform: "uppercase",
    marginLeft: 10,
    color: colorZeta,
    fontWeight: "bold",
    fontSize: 16
  },
  row: {
    flexDirection: "column"
  },
  label: {
    color: colorAlfa,
    fontSize: 14
  },
  text: {
    color: "#777",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15
  },
  hr: {
    width: "100%",
    borderBottomColor: "#eee",
    marginVertical: 10,
    borderBottomWidth: 1
  }
});