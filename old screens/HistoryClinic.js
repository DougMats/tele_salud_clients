import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, ScrollView, StyleSheet, TextInput, Modal, Text, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import Head from '../components/Head.js';
import Menu from '../components/Menu.js';
import BTN from '../components/BTN.js';
import {BG1, BG2, a, b, c, d, colorKappa, colorAA, colorAlfa, colorBetta, colorZeta, colorDseta, colorDelta } from '../Colors';
import { Icon } from 'react-native-eva-icons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { base_url, serverCrm } from '../Env.js';
import Toast from 'react-native-simple-toast';
import { counterEvent } from 'react-native/Libraries/Performance/Systrace';

function Historyclinic(props) {
  const { navigation } = props
  const [fuma, setfuma] = useState(false);
  const [hijos, sethijos] = useState(0);
  const [gethijos, setgethijos] = useState(false);
  const [alcohol, setalcohol] = useState(false);

  function countHijos(v) {
    let valor = hijos + v
    if (valor <= 0) {
      sethijos(1);
      Toast.show("Valor mínimo debe ser 1.")
    }
    else {
      sethijos(valor)
    }
  }

  function onChangeText(text, key) {
    console.log(text, " ", key)
    setformInfo({
      ...formInfo,
      [key]: text
    })
  }

  {/* ----------------------------------------------------------- */ }
  const [operacionesGet, setoperacionesGet] = useState(false);
  const [operacionesLista, setoperacionesLista] = useState([]);
  const [operacion, setoperacion] = useState({ name: "" });
  function onChangeTextoperaciones(text, key) {
    setoperacion({
      ...operacion,
      [key]: text
    })
  }
  function operacionAdd() {
    if (operacion.name === "") {
      Toast.show("Debe ingresar la descripción.")
    }
    else {
      let count = operacionesLista.length + 1
      let array = { id: count, descripcion: operacion.name }
      setoperacionesLista([...operacionesLista, array])
      onChangeTextoperaciones("", 'name')
      console.log("array ", array)
    }
  }
  function operacionDel(e) {
    console.log(e)
    let update = []
    for (var i in operacionesLista) {
      if (operacionesLista[i].id !== e) {
        update = [...update, operacionesLista[i]]
      }
    }
    setoperacionesLista(update)
  }
  {/* ----------------------------------------------------------- */ }
  const [medicamentosGet, setmedicamentosGet] = useState(false);
  const [medicamentosLista, setmedicamentosLista] = useState([]);
  const [medicamento, setmedicamento] = useState({ name: "" });
  function onChangeTextmedicamentos(text, key) {
    setmedicamento({
      ...medicamento,
      [key]: text
    })
  }
  function medicamentoAdd() {
    if (medicamento.name === "") {
      Toast.show("Debe ingresar la descripción.")
    }
    else {
      let count = medicamentosLista.length + 1
      let array = { id: count, descripcion: medicamento.name }
      setmedicamentosLista([...medicamentosLista, array])
      onChangeTextmedicamentos("", 'name')
      console.log("array ", array)
    }
  }
  function medicamentoDel(e) {
    console.log(e)
    let update = []
    for (var i in medicamentosLista) {
      if (medicamentosLista[i].id !== e) {
        update = [...update, medicamentosLista[i]]
      }
    }
    setmedicamentosLista(update)
  }
  {/* ----------------------------------------------------------- */ }
  const [enfermedadesGet, setenfermedadesGet] = useState(false);
  const [enfermedadesLista, setenfermedadesLista] = useState([]);
  const [enfermedad, setenfermedad] = useState({ name: "" });
  function onChangeTextenfermedades(text, key) {
    setenfermedad({
      ...enfermedad,
      [key]: text
    })
  }
  function enfermedadAdd() {
    if (enfermedad.name === "") {
      Toast.show("Debe ingresar la descripción.")
    }
    else {
      let count = enfermedadesLista.length + 1
      let array = { id: count, descripcion: enfermedad.name }
      setenfermedadesLista([...enfermedadesLista, array])
      onChangeTextenfermedades("", 'name')
      console.log("array ", array)
    }
  }
  function enfermedadDel(e) {
    console.log(e)
    let update = []
    for (var i in enfermedadesLista) {
      if (enfermedadesLista[i].id !== e) {
        update = [...update, enfermedadesLista[i]]
      }
    }
    setenfermedadesLista(update)
  }
  {/* ----------------------------------------------------------- */ }
  const [alergiasGet, setalergiasGet] = useState(false);
  const [alergiasLista, setalergiasLista] = useState([]);
  const [alergia, setalergia] = useState({ name: "" });
  function onChangeTextalergias(text, key) {
    setalergia({
      ...alergia,
      [key]: text
    })
  }
  function alergiaAdd() {
    if (alergia.name === "") {
      Toast.show("Debe ingresar la descripción.")
    }
    else {
      let count = alergiasLista.length + 1
      let array = { id: count, descripcion: alergia.name }
      setalergiasLista([...alergiasLista, array])
      onChangeTextalergias("", 'name')
      console.log("array ", array)
    }
  }
  function alergiaDel(e) {
    console.log(e)
    let update = []
    for (var i in alergiasLista) {
      if (alergiasLista[i].id !== e) {
        update = [...update, alergiasLista[i]]
      }
    }
    setalergiasLista(update)
  }
  {/* ----------------------------------------------------------- */ }

  async function save() {
    setmodal(true)
    setLoad(true)
    console.log("saving ...");
    let data = {
      id_cita: props.route.params.data.id,
      id_medic: props.route.params.data.id_medic,
      id_client: props.route.params.data.id_client,
      hijos: hijos,
      fuma: fuma === true ? 'si' : 'no',
      alcohol: alcohol === true ? 'si' : 'no',
      peso: float.peso,
      altura: float.altura,
      operaciones: operacionesGet === true ? 'si' : 'no',
      operacionesLista: operacionesGet === true ? operacionesLista : 'N/A',
      medicamentos: medicamentosGet === true ? 'si' : 'no',
      medicamentosLista: medicamentosGet === true ? medicamentosLista : 'N/A',
      enfermedades: enfermedadesGet === true ? 'si' : 'no',
      enfermedadesLista: enfermedadesGet === true ? enfermedadesLista : 'N/A',
      alergias: alergiasGet === true ? 'si' : 'no',
      alergiasLista: alergiasGet === true ? alergiasLista : 'N/A'
    }
    await axios.post(base_url(serverCrm, `save/historia/clinica`), data).then(function (response) {
      setdataActual(response.data[1])
    })
      .catch(function (error) {
        console.log("? error", error);
      })
  }

  const [float, setfloat] = useState({
    altura: 150000,
    peso: 50000
  });

  function decimal(num) {
    let res = (Math.round((num / 1000) * 100) / 100).toFixed(2);
    return res
  }

  function onChangedFloat(text, key) {
    setfloat({
      ...float,
      [key]: text
    })
  }

  function CALC(v, key) {
    let valor = float.[key] + v
    console.log("valor: ", valor);
    if (valor <= 0) {
      onChangedFloat(100, key)
      Toast.show("Valor mínimo debe ser 0.10")
    }
    else {
      onChangedFloat(valor, key)
    }
  }

  const [modal, setmodal] = useState(false);
  const [Load, setLoad] = useState(false);
  const [dataActual, setdataActual] = useState(null);
  const [successful, setsuccessful] = useState(false);

  useEffect(() => {
    if (dataActual !== null) {
      setLoad(false)
      console.log(dataActual)

      if (dataActual.state === 3) {
        setsuccessful("done");
        setTimeout(() => {
          goToScreen("Sala")
        }, 5000);
      } 

      if (dataActual.state === 4) {
        setsuccessful("cancel");
        setTimeout(() => {
          goToScreen("Dashboard")
        }, 5000);
      }

      if (dataActual.photos === "si" && dataActual.state === 0) {
        setsuccessful("hc");
        setTimeout(() => {
          goToScreen("HistoryClinic")
        }, 5000);
      }

      if (dataActual.photos === "si" && dataActual.state === 1) {
        setsuccessful("ph");
        setTimeout(() => {
          goToScreen("UploadPhotos")
        }, 5000);
      }

      if (dataActual.photos === "si" && dataActual.state === 2) {
        setsuccessful("ready");
        setTimeout(() => {
          goToScreen("Sala")
        }, 5000);
      } 

      if (dataActual.photos === "no" && dataActual.state === 0) {
        setsuccessful("hc");
        setTimeout(() => {
          goToScreen("HistoryClinic")
        }, 5000);
      }

      if (dataActual.photos === "no" && dataActual.state === 1) {
        setsuccessful("ready");
        setTimeout(() => {
          goToScreen("Sala")
        }, 5000);
      } 
    }
    else { console.log("dataActual null"); }
  }, [dataActual]);

  function goToScreen(screen) {
    let data = dataActual
    navigation.navigate(screen, { randomCode: Math.random(), data })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal animationType="slide" transparent={true} visible={modal} >
        <View style={{ backgroundColor: colorKappa, width: "100%", height: "100%", position: "absolute", zIndex: 999, justifyContent: "center", alignContent: "center", alignItems: "center", }}>
          <View style={{ backgroundColor: colorZeta, borderRadius: 20, width: "80%", padding: 20, justifyContent: "center", alignContent: "center", alignItems: "center", }}>
            {Load && <ActivityIndicator color={colorDelta} size={50} />}
            {Load && <Text style={{ marginTop: 20 }}>Cargando...</Text>}
            {!Load && successful === "done" &&
              <>
                <View style={{ width: 160, height: 160 }}>
                  <Image
                    style={{ width: null, height: null, resizeMode: "cover", flex: 1 }}
                    source={require("../images/formOne.png")}
                  />
                </View>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, width: "90%", marginVertical: 10 }}>Video valoración realizada.</Text>
              </>
            }
            {!Load && successful === "cancel" &&
              <>
                <View style={{ width: 160, height: 160 }}>
                  <Image
                    style={{ width: null, height: null, resizeMode: "cover", flex: 1 }}
                    source={require("../images/formOne.png")}
                  />
                </View>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, width: "90%", marginVertical: 10 }}>Video valoración cancelada</Text>
              </>
            }
            {!Load && successful === "hc" &&
              <>
                <View style={{ width: 160, height: 160 }}>
                  <Image
                    style={{ width: null, height: null, resizeMode: "cover", flex: 1 }}
                    source={require("../images/formOne.png")}
                  />
                </View>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, width: "90%", marginVertical: 10 }}>Aun no has completado los requisitos para entrar a la video valoración. {"\n"} Sólo falta un paso.</Text>
              </>
            }
            {!Load && successful === "ph" &&
              <>
                <View style={{ width: 160, height: 160 }}>
                  <Image
                    style={{ width: null, height: null, resizeMode: "cover", flex: 1 }}
                    source={require("../images/formOne.png")}
                  />
                </View>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, width: "90%", marginVertical: 10 }}>Aun no has completado los requisitos para entrar a la video valoración. {"\n"} Sólo falta un paso.</Text>
              </>
            }
            {!Load && successful === "ready" &&
              <>
                <View style={{ width: 160, height: 160 }}>
                  <Image
                    style={{ width: null, height: null, resizeMode: "cover", flex: 1 }}
                    source={require("../images/formThree.png")}
                  />
                </View>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, width: "90%", marginVertical: 10 }}>Has completado los requisitos para entrar a la video valoración.</Text>
              </>
            }
          </View>
        </View>
      </Modal>

      <StatusBar barStyle="dark-content" backgroundColor={colorZeta} />
      <LinearGradient colors={[BG1, BG2]} style={styles.imageBackground}>
        <Head props={props} from={""} />
        <ScrollView>
          <View style={styles.wrapper}>
            <View style={styles.wrap}>
              <View style={{ marginTop: 20, paddingBottom: 10, borderBottomColor: "silver", borderBottomWidth: 1, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, width: "90%", }}>Historia Clínica.</Text>
                <View style={{ width: 180, height: 140 }}>
                  <Image style={{ width: null, height: null, resizeMode: "cover", flex: 1 }} source={require("../images/formThree.png")} />
                </View>
                <Text style={{ textAlign: "center", fontSize: 12, width: "90%", color: "#777", marginVertical: 10 }}>Complete el siguiente formulario correctamente.</Text>
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={[styles.bigGroup, { borderBottomColor: "silver", paddingVertical: 10, borderBottomWidth: 1 }]}>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <Text style={{ marginLeft: 10, width: "30%", fontSize: 14, fontWeight: "bold", lineHeight: 35 }}>Altura (cm):</Text>
                  <View style={{ width: "70%", flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => CALC(-100, 'altura')} onLongPress={() => CALC(-1000, 'altura')} style={{ marginHorizontal: 10 }}>
                      <Icon name='minus-circle-outline' height={30} width={30} fill={colorBetta} />
                    </TouchableOpacity>
                    <TextInput
                      style={{ borderColor: "silver", lineHeight: 15, height: 40, fontSize: 14, borderWidth: 1, borderRadius: 8, paddingHorizontal: 20, }}
                      keyboardType="numeric"
                      onChangeText={text => onChangedFloat(text, 'altura')}
                      value={decimal(float.altura)}
                      maxLength={10}
                    />
                    <TouchableOpacity
                      onPress={() => CALC(+100, 'altura')} onLongPress={() => CALC(1000, 'altura')} style={{ marginHorizontal: 10 }}>
                      <Icon name='plus-circle-outline' height={30} width={30} fill={colorBetta} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={[styles.bigGroup, { borderBottomColor: "silver", paddingVertical: 10, borderBottomWidth: 1 }]}>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <Text style={{ marginLeft: 10, width: "30%", fontSize: 14, fontWeight: "bold", lineHeight: 35 }}>Peso (Kg):</Text>
                  <View style={{ width: "70%", flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => CALC(-100, 'peso')} onLongPress={() => CALC(-1000, 'peso')} style={{ marginHorizontal: 10 }}>
                      <Icon name='minus-circle-outline' height={30} width={30} fill={colorBetta} />
                    </TouchableOpacity>
                    <TextInput
                      style={{ borderColor: "silver", lineHeight: 15, height: 40, fontSize: 14, borderWidth: 1, borderRadius: 8, paddingHorizontal: 20, }}
                      keyboardType="numeric"
                      onChangeText={text => onChangedFloat(text, 'peso')}
                      value={decimal(float.peso)}
                      maxLength={10}
                    />
                    <TouchableOpacity onPress={() => CALC(+100, 'peso')} onLongPress={() => CALC(1000, 'peso')} style={{ marginHorizontal: 10 }}>
                      <Icon name='plus-circle-outline' height={30} width={30} fill={colorBetta} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={[styles.bigGroup, { borderBottomColor: "silver", paddingVertical: 10, borderBottomWidth: 1 }]}>
                <Text style={styles.bigGroupLabel}>Tiene Hijos?</Text>

                <TouchableOpacity onPress={() => setgethijos(false)} style={{ marginLeft: 10, flexDirection: "row" }}>
                  {gethijos === false ?
                    <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                    :
                    <Icon name='square-outline' height={30} width={30} fill={"silver"} />
                  }
                  <Text style={{ lineHeight: 25, marginLeft: 10, fontSize: 14 }}>No, no tengo hijos.</Text>
                </TouchableOpacity>
                <View style={{ marginLeft: 10, flexDirection: "row", marginTop: 10 }}>
                  <TouchableOpacity onPress={() => setgethijos(true)} style={{ flexDirection: "row", width: "50%" }}>
                    {gethijos === true ?
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                      :
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} />
                    }
                    <Text style={{ lineHeight: 25, marginLeft: 10, fontSize: 14 }}>Si.</Text>
                  </TouchableOpacity>
                  {gethijos === true &&
                    <View style={{ flexDirection: "row", width: "50%", justifyContent: "center" }}>
                      <TouchableOpacity onPress={() => countHijos(-1)} style={{ marginHorizontal: 10 }}>
                        <Icon name='minus-circle-outline' height={30} width={30} fill={colorBetta} />
                      </TouchableOpacity>
                      <Text style={{ borderColor: "silver", borderWidth: 1, borderRadius: 8, paddingHorizontal: 20, lineHeight: 25, marginLeft: 10, fontSize: 14 }}>{hijos}</Text>
                      <TouchableOpacity onPress={() => countHijos(+1)} style={{ marginHorizontal: 10 }}>
                        <Icon name='plus-circle-outline' height={30} width={30} fill={colorBetta} />
                      </TouchableOpacity>
                    </View>}
                </View>
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={styles.bigGroup}>
                <View style={styles.bigGroupHead}>
                  <Text style={styles.bigGroupLabel}>Ingiere Alcohol?</Text>
                  <TouchableOpacity onPress={() => setalcohol(true)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>Si</Text>
                    {alcohol === true ?
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                      :
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setalcohol(false)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>No</Text>
                    {alcohol === true ?
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} /> :
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={styles.bigGroup}>
                <View style={styles.bigGroupHead}>
                  <Text style={styles.bigGroupLabel}>Fuma?</Text>
                  <TouchableOpacity onPress={() => setfuma(true)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>Si</Text>
                    {fuma === true ?
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                      :
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setfuma(false)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>No</Text>
                    {fuma === true ?
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} /> :
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={styles.bigGroup}>
                <View style={styles.bigGroupHead}>
                  <Text style={styles.bigGroupLabel}>Operaciones?</Text>
                  <TouchableOpacity onPress={() => setoperacionesGet(true)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>Si</Text>
                    {operacionesGet === true ?
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                      :
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setoperacionesGet(false)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>No</Text>
                    {operacionesGet === true ?
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} /> :
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                    }
                  </TouchableOpacity>
                </View>
                {operacionesGet === true &&
                  <View>
                    {operacionesLista.length >= 1 && operacionesLista.map((i, key) => {
                      return (
                        <View key={key} style={styles.bigGroupCard}>
                          <Text style={styles.bigGroupCardText}>{i.descripcion}</Text>
                          <TouchableOpacity style={styles.bigGroupCardBTN} onPress={() => operacionDel(i.id)}>
                            <Icon name='trash-outline' height={30} width={30} fill="silver" />
                          </TouchableOpacity>
                        </View>
                      )
                    })}
                    <View style={styles.bigGroupFoot}>
                      <TextInput style={styles.bigGroupFootInput}
                        placeholderTextColor="#777" placeholder="Descripción" value={operacion.name} onChangeText={text => onChangeTextoperaciones(text, 'name')} />
                      <TouchableOpacity style={styles.bigGroupAdd} onPress={() => operacionAdd()}>
                        <Icon name='save-outline' height={30} width={30} fill={colorBetta} />
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={styles.bigGroup}>
                <View style={styles.bigGroupHead}>
                  <Text style={styles.bigGroupLabel}>Medicamentos?</Text>
                  <TouchableOpacity onPress={() => setmedicamentosGet(true)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>Si</Text>
                    {medicamentosGet === true ?
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                      :
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setmedicamentosGet(false)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>No</Text>
                    {medicamentosGet === true ?
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} /> :
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                    }
                  </TouchableOpacity>
                </View>
                {medicamentosGet === true &&
                  <View>
                    {
                      medicamentosLista.length >= 1 && medicamentosLista.map((i, key) => {
                        return (
                          <View key={key} style={styles.bigGroupCard}>
                            <Text style={styles.bigGroupCardText}>{i.descripcion}</Text>
                            <TouchableOpacity style={styles.bigGroupCardBTN} onPress={() => medicamentoDel(i.id)}>
                              <Icon name='trash-outline' height={30} width={30} fill="silver" />
                            </TouchableOpacity>
                          </View>
                        )
                      })}
                    <View style={styles.bigGroupFoot}>
                      <TextInput style={styles.bigGroupFootInput}
                        placeholderTextColor="#777" placeholder="Descripción" value={medicamento.name} onChangeText={text => onChangeTextmedicamentos(text, 'name')} />
                      <TouchableOpacity style={styles.bigGroupAdd} onPress={() => medicamentoAdd()}>
                        <Icon name='save-outline' height={30} width={30} fill={colorBetta} />
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={styles.bigGroup}>
                <View style={styles.bigGroupHead}>
                  <Text style={styles.bigGroupLabel}>Enfermedades?</Text>
                  <TouchableOpacity onPress={() => setenfermedadesGet(true)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>Si</Text>
                    {enfermedadesGet === true ?
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                      :
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setenfermedadesGet(false)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>No</Text>
                    {enfermedadesGet === true ?
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} /> :
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                    }
                  </TouchableOpacity>
                </View>
                {enfermedadesGet === true &&
                  <View>
                    {
                      enfermedadesLista.length >= 1 && enfermedadesLista.map((i, key) => {
                        return (
                          <View key={key} style={styles.bigGroupCard}>
                            <Text style={styles.bigGroupCardText}>{i.descripcion}</Text>
                            <TouchableOpacity style={styles.bigGroupCardBTN} onPress={() => enfermedadDel(i.id)}>
                              <Icon name='trash-outline' height={30} width={30} fill="silver" />
                            </TouchableOpacity>
                          </View>
                        )
                      })}
                    <View style={styles.bigGroupFoot}>
                      <TextInput style={styles.bigGroupFootInput}
                        placeholderTextColor="#777" placeholder="Descripción" value={enfermedad.name} onChangeText={text => onChangeTextenfermedades(text, 'name')} />
                      <TouchableOpacity style={styles.bigGroupAdd} onPress={() => enfermedadAdd()}>
                        <Icon name='save-outline' height={30} width={30} fill={colorBetta} />
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </View>
              {/* ----------------------------------------------------------- */}
              <View style={styles.bigGroup}>
                <View style={styles.bigGroupHead}>
                  <Text style={styles.bigGroupLabel}>Alérgias?</Text>
                  <TouchableOpacity onPress={() => setalergiasGet(true)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>Si</Text>
                    {alergiasGet === true ?
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                      :
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setalergiasGet(false)} style={styles.bigGroupBTN}>
                    <Text style={styles.bigGroupBTNText}>No</Text>
                    {alergiasGet === true ?
                      <Icon name='square-outline' height={30} width={30} fill={"silver"} /> :
                      <Icon name='checkmark-square-2-outline' height={30} width={30} fill={colorBetta} />
                    }
                  </TouchableOpacity>
                </View>
                {alergiasGet === true &&
                  <View>
                    {
                      alergiasLista.length >= 1 && alergiasLista.map((i, key) => {
                        return (
                          <View key={key} style={styles.bigGroupCard}>
                            <Text style={styles.bigGroupCardText}>{i.descripcion}</Text>
                            <TouchableOpacity style={styles.bigGroupCardBTN} onPress={() => alergiaDel(i.id)}>
                              <Icon name='trash-outline' height={30} width={30} fill="silver" />
                            </TouchableOpacity>
                          </View>
                        )
                      })}
                    <View style={styles.bigGroupFoot}>
                      <TextInput style={styles.bigGroupFootInput}
                        placeholderTextColor="#777" placeholder="Descripción" value={alergia.name} onChangeText={text => onChangeTextalergias(text, 'name')} />
                      <TouchableOpacity style={styles.bigGroupAdd} onPress={() => alergiaAdd()}>
                        <Icon name='save-outline' height={30} width={30} fill={colorBetta} />
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </View>
              {/* ----------------------------------------------------------- */}
            </View>
            <BTN icon="save-outline" text="Guardar" function={save} w={"60%"} data={'adcd'} />
          </View>
        </ScrollView>
        <Menu props={props} option={2} />
      </LinearGradient>
    </SafeAreaView>
  )
}
export default Historyclinic;
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
    flexDirection: "column",
    backgroundColor: colorZeta,
    marginBottom: 20,
    width: "90%",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20
  },

  //////////
  bigGroup: {
    flexDirection: "column"
  },
  bigGroupHead: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderBottomColor: "silver",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  bigGroupLabel: {
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 30,
    paddingLeft: 10,
    textAlign: "left",
    width: "60%",
  },
  bigGroupBTN: {
    flexDirection: "row",
    width: "16%",
    marginHorizontal: "2%"
  },
  bigGroupBTNText: {
    lineHeight: 30
  },
  bigGroupCard: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderBottomColor: "silver",
    borderBottomWidth: 1,
    width: "100%",
    flexDirection: "row"
  },
  bigGroupCardText: {
    padding: 15,
    textAlign: "justify",
    color: "#555",
    width: "90%",
    fontSize: 14,
    lineHeight: 20
  },
  bigGroupCardBTN: {
    right: 10,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  bigGroupFoot: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    marginBottom: 40
  },
  bigGroupFootInput: {
    backgroundColor: colorZeta,
    height: 50,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderColor: "silver",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10
  },
  bigGroupAdd: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: colorZeta,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderColor: "silver",
    borderWidth: 1
  },
  //////////////////////////////////////////////////////////////////////////
  column: {
    flexDirection: "column",
    marginBottom: 10
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: colorBetta,
    margin: 10,
    textTransform: "capitalize"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  TextInput: {
    color: colorBetta,
    width: "70%",
    textAlign: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: colorBetta
  },
  text: {
    color: colorBetta,
    lineHeight: 35,
    width: "70%",
    textAlign: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: colorBetta
  },
  BTN_TEN: {
    width: "10%",
    height: 40,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  BTN_TEXT: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorBetta,
    width: "10%",
    height: 40,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  }
});