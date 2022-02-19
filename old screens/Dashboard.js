import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import Head from '../components/Head.js';
import Menu from '../components/Menu.js';
import Filter from '../components/Filter.js';
import { serverCrm, base_url } from '../Env'
import axios from 'axios'
import UserContext from '../contexts/UserContext'
import LinearGradient from 'react-native-linear-gradient';
import { BG1, BG2, colorBetta, colorKappa, colorZeta, colorBettaLight, } from '../Colors';
import _ from 'lodash';
import { Icon } from 'react-native-eva-icons';
import SimpleCardClient from '../components/SimpleCardClient.js';

export default function Dashboard(props) {
  const { navigation } = props;
  const { userDetails, setUserDetails } = useContext(UserContext)
  const [Load, setLoad] = useState(true)
  const [Valorations, setValorations] = useState(null);
  const [ValorationsPrint, setValorationsPrint] = useState([]);
  let randomCode
  if (props.route.params) {
    randomCode = props.route.params.randomCode
  } else {
    randomCode = 1
  }

  useEffect(() => {
    GetMyClients(userDetails.id, "_");
  }, [randomCode]);

  async function GetMyClients(id, lk) {
    let list
   // console.log(base_url(serverCrm, `get/myClients/${id}/${lk}`))
    await axios.get(base_url(serverCrm, `get/myClients/${id}/${lk}`)).then(function (response) {
      list = response.data
    })
      .catch(function (error) { console.log("?", error) })
      .then(function () { });
    setValorations(list)
  }

  useEffect(() => {
    setValorationsPrint(Valorations)
  }, [Valorations]);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false)
    }, 1000);
  }, [ValorationsPrint]);

  function MaxFilter(data) {
    setLoad(true);
    let response, response0
    let filter = data.filter
    let order = data.order
    if (filter === "" && order === "") {
      console.log("case 0");
      setValorationsPrint(Valorations);
    }
    if (filter !== "" && order !== "") {
      console.log("case 1");
      response = _.filter(Valorations, ['gender', filter]);
      response0 = _.orderBy(response, [order], ['asc']);
      setValorationsPrint(response0);
    }
    if (filter === "" && order !== "") {
      console.log("case 2");
      response0 = _.orderBy(Valorations, [order], ['asc']);
      setValorationsPrint(response0);
    }
    if (filter !== "" && order === "") {
      console.log("case 3");
      response0 = _.filter(Valorations, ['gender', filter]);
      setValorationsPrint(response0);
    }
  }

  function search(text) {
    setLoad(true)
    if (text !== "") {
      console.log("text", text);
      GetMyClients(userDetails.id, text);
    }
    else {
      GetMyClients(userDetails.id, "_");
    }
  }



  function goToViewMeet(screen, code) {
    let from = "Dashboard"
    let key_conference = code
    let data = code
    //console.log("-> ", screen, "-", from, "-", key_conference, "-", data);
    navigation.navigate(screen, { randomCode: Math.random(), data, key_conference, from })
  }


  function print(array) {
    try {
      if (array.length !== 0) {
        return (array.map((i, key) => {
          return (
            <SimpleCardClient key={key} data={i} goToViewMeet={goToViewMeet} />
          )
        })
        )
      }
      else {
        return (

          <View style={{ marginTop: "30%", justifyContent: "center", alignContent: "center", alignItems: "center", borderColor: colorBetta, flexDirection: "column", borderWidth: 1, paddingVertical: 30, width: "80%", borderStyle: "dashed", borderRadius: 20 }}>
            <Icon name="alert-triangle-outline" fill={colorBetta} width={60} height={60} />
            <Text style={{ fontSize: 18, marginTop: 10, color: colorBetta, textAlign: "center" }}>No se han encontrado registros. </Text>
          </View>
        )
      }
    }
    catch (error) {
      return (
        <Text>Error de conexion</Text>
      )
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={colorZeta} />
      <LinearGradient colors={[BG1, BG2]} style={styles.imageBackground}>
        <Head props={props} from={""} />
        <ScrollView>
          <View style={styles.wrapper}>
            <Filter MaxFilter={MaxFilter} search={search} />
            {Load && <ActivityIndicator size="large" color={colorBetta} style={{ marginTop: "40%" }} />}
            {!Load && print(ValorationsPrint)}
          </View>
        </ScrollView>
        {!Load &&
          <View style={{ width: "100%", position: "absolute", bottom: 90, right: 0, alignContent: "center", alignItems: "center" }} >
            <TouchableOpacity onPress={() => goToViewMeet("NewClient")} style={{ borderWidth: 1, borderColor: colorZeta, width: 50, height: 50, borderRadius: 25, overflow: "hidden" }}>
              <LinearGradient colors={[colorBettaLight, colorBetta]} style={{ justifyContent: "center", alignContent: "center", alignItems: "center", resizeMode: "cover", flex: 1 }}>
                <Icon name='plus-outline' height={25} width={25} fill={colorZeta} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
        <Menu props={props} option={2} />
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
    overflow: "hidden",
    marginBottom: 20,
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderTopColor: "white",
    borderRightColor: "rgba(0,0,0,0.05)",
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderLeftColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    alignContent: "center"
  },
  cardWrap: {
    width: "100%",
    flexDirection: "row",
    padding: 10
  },
  dates: {
    width: "35%",
  },
  avatar: {
    width: "20%",
    justifyContent: "center"
  },
  info: {
    width: "45%",
    flexDirection: "column",
  },
  group: {
    marginLeft: 10,
    flexDirection: "column"
  },
  label: {
    textTransform: "capitalize",
    fontSize: 14,
    color: colorKappa
  },
  text: {
    textTransform: "capitalize",
    fontSize: 14,
    color: colorKappa,
    fontWeight: "bold"
  },
  DownBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 8,
    backgroundColor: colorZeta
  },
  btn: {
    flexDirection: "row",
    paddingVertical: 4,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "22%",
    borderRadius: 20,
    borderColor: colorBetta,
    borderWidth: 1
  },
  minText: {
    textAlign: "center",
    marginLeft: 2,
    color: colorBetta,
    fontSize: 10,
    fontWeight: "bold"
  },
})