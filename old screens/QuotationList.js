import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { serverCrm, base_url } from '../Env'
import axios from 'axios';
import { Icon } from 'react-native-eva-icons';
import UserContext from '../contexts/UserContext'
import Head from '../components/Head.js';
import Menu from '../components/Menu.js';
import LinearGradient from 'react-native-linear-gradient';
import { GB1, BG2, colorBetta, colorZeta,  colorDseta } from '../Colors';
import { currencyFormat } from '../components/Time/logic.js';
import BTN from '../components/BTN.js';

function QuotationsList(props) {
  const [Load, setLoad] = useState(true);
  const [Quotations, setQuotations] = useState([]);
  const { userDetails, setUserDetails } = useContext(UserContext)
  const { navigation } = props
  function goToScreen(screen) {
    console.log("go", screen)
    let from = "QuotationList"
    navigation.navigate(screen, { randomCode: Math.random(), from })
  }

  let randomCode
  if (props.route.params) { randomCode = props.route.params.randomCode }
  else { randomCode = 1 }

  useEffect(() => {
    setLoad(true)
    Get(userDetails.id)
  }, [randomCode]);

  async function Get(id) {
    await axios.get(base_url(serverCrm, `get/my/quotations/list/${id}`)).then(function (response) {
      console.log("get/my/quotations/list/", response.data)
      setQuotations(response.data)
    })
      .catch(function (error) { console.log("?", error) })
    setLoad(false)
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="ligth-content" />
      <LinearGradient colors={[GB1, BG2]} style={styles.imageBackground}>
        <Head props={props} from={props.route.params.from} />
        <ScrollView>
          <View style={{ width: "100%", alignItems: "center", alignContent: "center", paddingTop: 40, paddingBottom: 100 }}>
            <Text style={{ width: "100%", textAlign: "center", fontWeight: "bold", marginTop: 20, fontSize: 18, textTransform: "uppercase", color: colorBetta, marginBottom: 10 }}>Mi lista de cotizaciones</Text>

            {!Load && Quotations !== null &&
              Quotations.map((i, key) => {
                return (
                  <Quotationexample key={key} data={i} />
                )
              })
            }
            {!Load && Quotations.length === 0 &&
              <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", padding: 20, borderWidth: 1, borderColor: colorBetta, marginVertical: 20, borderRadius: 20, borderStyle: "dashed" }}>
                <Icon name='alert-triangle-outline' height={60} width={60} fill={colorBetta} />
                <Text style={{ color: colorBetta }}>Aun no has realizado cotizaciones.</Text>
              </View>
            }
            <BTN icon="file-text-outline" text="Crear Cotización" function={goToScreen} w={"80%"} data={"Quotation"} />
          </View>
        </ScrollView>
        <Menu props={props} option={1} />
      </LinearGradient>
    </SafeAreaView>
  );
}
export default QuotationsList;
const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
    width: "100%",
    height: "100%"
  },
});


function Quotationexample(props) {
  const [show, setshow] = useState(false);
  const [ViewMore, setViewMore] = useState(false);



  return(<></>)
  /*
  if (props.data.quotation !== null) {
    return (
      <View style={{ width: "90%", backgroundColor: colorZeta, marginBottom: 20, borderRadius: 12, overflow: "hidden" }}>
        <View style={{ width: "100%", padding: 10 }}>
          <Text style={{ position: "absolute", top: 5, right: 10, zIndex: 9, textAlign: "right", color: colorDseta, marginRight: 10 }}>Fecha: {props.data.scheduled_day}</Text>
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: colorDseta, fontSize: 14, width: "30%", }}>Valoración:</Text>
              <Text style={{ color: colorDseta, fontSize: 14, width: "70%", fontWeight: "bold", }}>{props.data.name}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: colorDseta, fontSize: 14, width: "30%", }}>Paciente:</Text>
              <Text style={{ color: colorDseta, fontSize: 14, width: "70%", fontWeight: "bold", }}>{props.data.names}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setshow(!show)} style={{ width: "100%", paddingVertical: 5, paddingHorizontal: 10, flexDirection: "row" }}>
            <Icon name={show ? 'arrow-ios-downward-outline' : 'arrow-ios-upward-outline'} width={30} height={30} fill={colorBetta} />
            <Text style={{ color: colorBetta, marginLeft: 10, lineHeight: 30, fontSize: 14, fontWeight: "bold" }}>
              {show ? 'Ocultar descripción' : 'Ver Descricción'}
            </Text>
          </TouchableOpacity>
          {show === true &&
            <View style={{ marginBottom: 5, borderWidth: 1, overflow: "hidden", borderColor: colorBetta, borderRadius: 20 }}>
              {props.data.quotation.description.map((i, key) => {
                return (
                  <View key={key} style={{ padding: 10, flexDirection: "column", borderBottomColor: "silver", borderBottomWidth: 1, marginBottom: -1 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: colorDseta }}>{i.name}</Text>
                    <Text style={{ textAlign: "justify", fontSize: 14, color: colorDseta }}>
                      {
                        ViewMore === false ?
                          ((i.description).length > 88) ? (((i.description).substring(0, 88 - 3)) + '...') : i.description
                          :
                          i.description
                      }
                    </Text>
                    {
                      (i.description).length > 88 &&
                      <TouchableOpacity onPress={() => setViewMore(!ViewMore)}>
                        <Text style={{ color: colorBetta }}>{ViewMore ? 'ver menos' : 'ver más'}</Text>
                      </TouchableOpacity>
                    }
                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-around" }}>
                      <Text style={{ fontWeight: "bold" }}>{currencyFormat(i.price)} </Text>
                      <Text style={{ fontWeight: "bold" }}>Cant.: {i.qty}</Text>
                      <Text style={{ fontWeight: "bold" }}>Total: {currencyFormat(i.price * i.qty)}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          }
        </View>
        <View style={{ backgroundColor: colorBetta, padding: 8, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 14, color: colorZeta }}>TOTAL: {currencyFormat(props.data.quotation.price)}</Text>
        </View>
      </View>
    )
    
  }
  else { return <></> }
  */
}