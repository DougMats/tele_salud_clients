import React, { useState, useContext, useEffect } from 'react';
import { Platform, SafeAreaView, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import Head from '../components/Head.js';
import Menu from '../components/Menu.js';
import BTN from '../components/BTN.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { GB1, BG2, colorAlfa, colorBetta, colorZeta, colorKappa, colorDelta } from '../Colors';
import { Icon } from 'react-native-eva-icons';
import UserContext from '../contexts/UserContext'
import Toast from 'react-native-simple-toast';
import { serverCrm, base_url } from '../Env'
import axios from 'axios';
import { zfill } from '../components/Time/logic.js';

export default function NewClient(props) {
  console.log("render:_______________________________")
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [formInfo, setFormInfo] = useState({ Names: "", Surnames: "", Phone: "", Email: "", FechaNacimiento: "", Edad: "", Sex: "", DocumentoIdentidad: "", Ocupacion: "", EstratoSocial: 0 });
  const [age, setage] = useState(0);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [Load, setLoad] = useState(false);
  const [successful, setsuccessful] = useState(false);
  const [msj, setmsj] = useState("");
  const [modal, setmodal] = useState(false);

  useEffect(() => {
    onChangeText(age, "Edad");
  }, [age])

  useEffect(() => {
    if (modal === true) {
      setTimeout(() => {
        setmodal(false)
        setFormInfo({ Names: "", Surnames: "", Phone: "", Email:"",FechaNacimiento: "", Edad: 1, Sex: "", DocumentoIdentidad: "", Ocupacion: "", EstratoSocial: 0 });
      }, 5000);
    }
  }, [modal]);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    getAge(currentDate);
    getAge(currentDate);
  };

  function getAge(v) {
    let hoy = new Date();
    let birthday, age;
    let Y = hoy.getFullYear();
    let M = zfill(hoy.getMonth() + 1, 2);
    let y = v.getFullYear();
    let m = zfill(v.getMonth() + 1, 2);
    let d = zfill(v.getDate(), 2);
    birthday = d + "-" + m + "-" + y;
    age = Y - y
    if (M === m) { console.log("mismo mes"); }
    else {
      if (M < m) {
        console.log("mes aun no pasa"); age = age - 1
      }
      else {
        console.log("mes ya pasó");
      }
    }
    onChangeText(birthday, "FechaNacimiento");
    setage(age);
  }

  function onChangeText(text, key) {
    setFormInfo({
      ...formInfo,
      [key]: text
    })
  }

  function setQTY(v) {
    let actual = formInfo.EstratoSocial
    let nuevo = actual + v
    if (nuevo < 1) {
      Toast.show('El valor minimo es 1.');
      onChangeText(1, 'EstratoSocial');
    }
    else {
      if (nuevo > 5) {
        Toast.show('El valor máximo es 5.');
        onChangeText(5, 'EstratoSocial');
      }
      else {
        onChangeText(nuevo, 'EstratoSocial')
      }
    }
  }

  useEffect(() => {
    if (formInfo.Edad === 0) {
      Toast.show('El valor minimo es 1.');
      onChangeText(1, 'Edad');
    }
  }, [formInfo.Edad]);


  async function Save() {
    if (
      formInfo.Names === "" ||
      formInfo.Surnames === "" ||
      formInfo.Phone === "" ||
      formInfo.Email === "" ||
      formInfo.Sex === "" ||
      formInfo.FechaNacimiento === "" ||
      formInfo.DocumentoIdentidad === "" ||
      formInfo.Ocupacion === "" ||
      formInfo.EstratoSocial === ""
    ) {
      Toast.show('Debe completar el formulario.');
    }
    else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(formInfo.Email) === false) {
        Toast.show('Email no válido.');
      }
      else {
        setLoad(true);
        let Gender
        if (formInfo.Sex === "Masc") { Gender = 1 } else {
          Gender = 2
        }
        let datas = formInfo
        //let ActualAge = 0
        datas.Age = age
        datas.gender = Gender
        datas.id_medic = userDetails.id
        console.log("datas", datas);
        console.log(base_url(serverCrm, `register/client`))
        await axios.post(base_url(serverCrm, `register/client`), datas).then(function (response) {
          if (response.data[0] === true) {
            console.log(response.data)
            setmodal(true)
            setLoad(false);
            setsuccessful(true)
            setmsj(response.data[1])
          }
          else {
            setmodal(true)
            setLoad(false);
            setsuccessful(false)
            setmsj(response.data[1])
          }
        })
          .catch(function (error) { console.log("?", error) })
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#c7f0fe" }}>
      <StatusBar barStyle="dark-content" backgroundColor={colorZeta} />
      <LinearGradient colors={[GB1, BG2]} style={styles.imageBackground}>
        <Head props={props} from={props.route.params.from} />
        <ScrollView>
          <View style={styles.wrapper}>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>nombres:</Text>
                <TextInput style={styles.text} placeholder="Ingrese nsus nombres."
                  value={formInfo.Names}
                  onChangeText={text => onChangeText(text, 'Names')}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Apellidos:</Text>
                <TextInput style={styles.text} placeholder="Ingrese sus apellidos."
                  value={formInfo.Surnames}
                  onChangeText={text => onChangeText(text, 'Surnames')}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Télefono:</Text>
                <TextInput style={styles.text} placeholder="+00 000 000 00 00."
                  value={formInfo.Phone}
                  onChangeText={text => onChangeText(text, 'Phone')}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Correo Electrónico:</Text>
                <TextInput style={styles.text} placeholder="ejemplo@telesalud.com"
                  value={formInfo.Email}
                  onChangeText={text => onChangeText(text, 'Email')}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de Nacimiento:</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  <Text style={[styles.text, { width: "70%", lineHeight: 35 }]}>{formInfo.FechaNacimiento}</Text>
                  <TouchableOpacity
                    onPress={() => showMode('date')}
                    style={{ marginLeft: "10%", borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: colorAlfa, width: "20%" }}>
                    <Icon name='calendar' height={25} width={25} fill={colorZeta} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Edad:</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  <Text style={[styles.text, { width: "70%", lineHeight: 35 }]}>{formInfo.Edad}</Text>
                  <TouchableOpacity onPress={() => onChangeText(formInfo.Edad - 1, 'Edad')} style={{ marginLeft: 5, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: colorAlfa, width: "12%" }}>
                    <Icon name='minus-circle-outline' height={25} width={25} fill={colorZeta} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onChangeText(formInfo.Edad + 1, 'Edad')} style={{ marginLeft: 5, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: colorAlfa, width: "12%" }}>
                    <Icon name='plus-circle-outline' height={25} width={25} fill={colorZeta} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sexo:</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  <TouchableOpacity onPress={() => onChangeText('Masc', 'Sex')} style={{ backgroundColor: "#eee", height: 40, marginLeft: "2%", flexDirection: "row", borderRadius: 12, justifyContent: "center", alignItems: "center", width: "45%" }}>
                    <Text style={{ marginRight: 10, color: "#000" }}>Masculino</Text>
                    {formInfo.Sex === 'Masc' ?
                      <Icon name='checkmark-circle-outline' height={25} width={25} fill={colorBetta} /> :
                      <Icon name='radio-button-off-outline' height={25} width={25} fill={colorZeta} />}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onChangeText('Feme', 'Sex')} style={{ backgroundColor: "#eee", height: 40, marginLeft: "2%", flexDirection: "row", borderRadius: 12, justifyContent: "center", alignItems: "center", width: "45%" }}>
                    <Text style={{ marginRight: 10, color: "#000" }}>Femenino</Text>
                    {formInfo.Sex === 'Feme' ?
                      <Icon name='checkmark-circle-outline' height={25} width={25} fill={colorBetta} /> :
                      <Icon name='radio-button-off-outline' height={25} width={25} fill={colorZeta} />}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Documento de Identidad:</Text>
                <TextInput style={styles.text} placeholder="Ej." value={formInfo.DocumentoIdentidad} onChangeText={text => onChangeText(text, 'DocumentoIdentidad')} />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Ocupación:</Text>
                <TextInput style={styles.text} placeholder="Ej." value={formInfo.Ocupacion} onChangeText={text => onChangeText(text, 'Ocupacion')} />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Estrato Social:</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  <TouchableOpacity onPress={() => setQTY(-1)} style={{ backgroundColor: "#eee", width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
                    <Icon name='arrow-ios-back-outline' width={30} height={30} fill={colorAlfa} />
                  </TouchableOpacity>
                  <Text style={{ width: "35%", lineHeight: 40, fontSize: 14, textAlign: "center", borderRadius: 8, paddingHorizontal: 10, height: 40, backgroundColor: "#eee" }}> {formInfo.EstratoSocial} </Text>
                  <TouchableOpacity onPress={() => setQTY(+1)} style={{ backgroundColor: "#eee", width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
                    <Icon name='arrow-ios-forward-outline' width={30} height={30} fill={colorAlfa} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <BTN icon="save-outline" text="Registrar" function={Save} screen="Login" data={"douglas"} w={"50%"} />
          </View>
        </ScrollView>
        <Menu props={props} option={2} />
      </LinearGradient>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      {
        Load &&
        <View style={{ position: "absolute", zIndex: 99999, backgroundColor: colorKappa, height: "100%", width: "100%", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colorZeta} />
        </View>
      }
      <Modal animationType="slide" transparent={true} visible={modal} >
        <View style={{ position: "absolute", zIndex: 999, backgroundColor: colorKappa, width: "100%", height: "100%", justifyContent: "center", alignContent: "center", alignItems: "center", }}>
          <TouchableOpacity onPress={() => setmodal(!modal)} style={{ position: "absolute", right: 20, top: 20 }}>
            <Icon name="close-circle-outline" fill="#FFF" width={40} height={40} />
          </TouchableOpacity>
          <View style={{ backgroundColor: colorZeta, width: "80%", paddingVertical: 40, paddingHorizontal: 10, justifyContent: "center", alignItems: "center", borderRadius: 20 }}>
            {successful ? <Icon name='checkmark-circle-outline' width={60} height={60} fill={colorBetta} /> : <Icon name='alert-triangle-outline' width={60} height={60} fill={colorDelta} />}
            <Text style={{ fontSize: 14, color: "#555", marginTop: 20 }}>{msj}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
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
  card: {
    marginBottom: 20,
    width: "90%",
    backgroundColor: "rgba(255,255,255,1)",
    borderTopColor: "white",
    borderRightColor: "rgba(0,0,0,0.05)",
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderLeftColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    alignItems: "center", alignContent: "center"
  },
  row: {
    marginVertical: 10,
    width: "100%",
    flexDirection: "column"
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 10,
    marginBottom: 5,
    textTransform: "capitalize"
  },
  text:
  {
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#eee"
  },
  btn: {
    height: 40,
    marginLeft: "2%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorAlfa,
    width: "45%"
  },
  value: {

  },
})