import React, { useState, useEffect } from 'react';
import { SafeAreaView, Dimensions, Clipboard, Text, View, ScrollView, TouchableOpacity, TextInput, StatusBar, StyleSheet } from 'react-native';
import Head from '../components/Head.js';
import Menu from '../components/Menu.js';
import BTN from '../components/BTN.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { BG1, BG2, colorAlfa, colorBetta, colorZeta } from '../Colors';
import { Icon } from 'react-native-eva-icons';
import { base_url, serverCrm } from '../Env.js';
import axios from 'axios'
import md5 from 'md5';



import {globalStatusValoration} from '../components/Time/logic.js'



export default function AdminMeet(props) {
  const { navigation } = props
  const [Load, setLoad] = useState(true);
  const [Edit, setEdit] = useState(false);
  const [Data, setData] = useState(null);
  const [url, seturl] = useState(null);


  let randomCode
  if (props.route.params) {
    randomCode = props.route.params.randomCode
  } else {
    randomCode = 1
  }

  useEffect(() => {
    Get(props.route.params.key_conference)
  }, [randomCode]);

  async function Get(code) {
    axios.get(base_url(serverCrm, `get/cita/${code}`)).then(function (response) {
      setData(response.data);
    })
      .catch(function (error) { console.log("?", error) })
    setLoad(false);
  }

  function onChangeText(text, key) {
    setdata({
      ...Data,
      [key]: text
    })
  }

  async function saveChange() {
    setEdit(!Edit);
  }

  function joinMeet() {
    navigation.navigate("Sala")
  }

  function copy(e) {
    console.log(e)
  }

  useEffect(() => {
    if (Data !== null) {
      let encrypt = md5(Data.code)
      seturl(`https://meet.jit.si/${encrypt}`)
    }
  }, [Data]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={colorZeta} />
      <LinearGradient colors={[BG1, BG2]} style={styles.imageBackground}>
        <Head props={props} from={props.route.params.from} />
        <ScrollView>
          {!Load && Data !== null &&
            <View style={styles.wrapper}>
              <View style={styles.card}>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>Datos del paciente:</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Nombres:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.paciente.names}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.paciente.names} onChangeText={text => onChangeText(text, 'names')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Apellidos:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.paciente.surnames}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.paciente.surnames} onChangeText={text => onChangeText(text, 'surnames')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Télefono:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.paciente.phone}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.paciente.phone} onChangeText={text => onChangeText(text, 'phone')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Identificación:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.paciente.identification}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.paciente.identification} onChangeText={text => onChangeText(text, 'identification')} />}
                </View>
              </View>
              <View style={styles.card}>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>Datos de la cita:</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Título:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.name}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.name} onChangeText={text => onChangeText(text, 'name')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Tipo:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.type}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.type} onChangeText={text => onChangeText(text, 'name')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Código:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.code}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.code} onChangeText={text => onChangeText(text, 'code')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>URL:</Text>
                  {Edit === false && <Text style={styles.textView}>{url}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={url} onChangeText={text => onChangeText(text, 'code')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Fecha:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.scheduled_day}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.scheduled_day} onChangeText={text => onChangeText(text, 'scheduled_day')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Hora:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.scheduled_time}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.scheduled_time} onChangeText={text => onChangeText(text, 'identification')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Requiere fotos:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.photos}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.photos} onChangeText={text => onChangeText(text, 'identification')} />}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Estado:</Text>
                  <Text style={styles.textView}>{globalStatusValoration(Data.photos, Data.state)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Registrada:</Text>
                  {Edit === false && <Text style={styles.textView}>{Data.created_at}</Text>}
                  {Edit === true && <TextInput style={styles.text} placeholder="Ej." value={Data.created_at} onChangeText={text => onChangeText(text, 'identification')} />}
                </View>
              </View>
            </View>
          }
        </ScrollView>
        <View style={{ width: "100%", bottom: 5, alignContent: "center", flexDirection: "row", alignContent: "center", justifyContent: "center" }} >
          <TouchableOpacity onPress={() => setEdit(!Edit)} >
            <LinearGradient colors={["#47D3DE", colorBetta]} style={{ justifyContent: "center", alignContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: 30 }}>
              <Icon name={Edit ? 'close-circle-outline' : 'edit-outline'} height={30} width={30} fill={colorZeta} />
            </LinearGradient>
          </TouchableOpacity>

          {Edit === true &&
            <TouchableOpacity onPress={() => saveChange()} style={{ marginLeft: 10 }}>
              <LinearGradient colors={["#47D3DE", colorBetta]} style={{ justifyContent: "center", alignContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: 30 }}>
                <Icon name='save-outline' height={30} width={30} fill={colorZeta} />
              </LinearGradient>
            </TouchableOpacity>
          }
        </View>
        <Menu props={props} option={4} />
      </LinearGradient>
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
    backgroundColor: "rgba(255,255,255,0.8)",
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
    flexDirection: "row",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  label: {
    width: "30%",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 10
  },
  textView:
  {
    overflow: "hidden", lineHeight: 20,
    width: "70%",
  },
  text:
  {
    width: "65%",
    borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    lineHeight: 15,
    backgroundColor: "#eee"
  },
});