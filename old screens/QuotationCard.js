import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import { colorIota, colorNi, colorDseta, colorEta, colorBettaLight, colorBetta, colorZeta, colorAlfa } from '../Colors';
import { currencyFormat } from '../components/Time/logic.js';

export default function QuotationCard(props) {
  const [view, setview] = useState(false);
  const [editing, setediting] = useState(false);
  const [Form, setForm] = useState({ id: props.data.id, name: props.data.name, description: props.data.description, price: props.data.price, qty: props.data.qty });
  const total = Form.price * Form.qty;
  function onChangeText(text, key) {
    setForm({
      ...Form,
      [key]: text
    })
  }

  function setQTY(v) {
    let actual = Form.qty;
    let nuevo = actual + v;
    console.log(nuevo)
    if (nuevo >= 1) { onChangeText(nuevo, 'qty') }
    else {
      onChangeText(1, 'qty')
      Toast.show("la minima cantidad es 1");
    }
  }

  function Update() {
    props.updateItem(Form);
    setediting(false);
  }

  console.log("card Form", Form);
  return (
    <View style={styles.wrap}>
      <View style={styles.wrapper}>
        {editing === false &&
          <Text style={{ color: colorIota, width: "100%", textAlign: "center", fontWeight: "bold", marginBottom: 10, fontSize: 18 }}>{props.data.name}</Text>
        }
        {editing === false &&
          <View style={{ marginBottom: 10, paddingHorizontal: 15, overflow: "hidden", height: view === false ? 35 : null }}>
            <Text style={{ fontSize: 14, textAlign: "justify", color: colorDseta }}>
              {
                view === false ?
                  ((props.data.description).length > 70) ? (((props.data.description).substring(0, 70 - 3)) + '...') : props.data.description
                  :
                  props.data.description
              }
            </Text>
          </View>
        }
        {editing === false &&
          <Text style={{ color: colorIota, fontSize: 14, fontWeight: "bold", }}>{props.data.price} X {props.data.qty} Unid.</Text>
        }
        {editing === true &&
          <TextInput value={Form.name} onChangeText={text => onChangeText(text, 'name')} style={{ color: colorIota, width: "100%", textAlign: "center", fontWeight: "bold", marginBottom: 10, fontSize: 14, backgroundColor: colorNi, borderRadius: 12, height: 40 }} placeholder="Nombre" />
        }
        {editing === true &&
          <TextInput value={Form.description} onChangeText={text => onChangeText(text, 'description')} multiline={true} numberOfLines={4} style={{ width: "100%", textAlign: "center", fontWeight: "bold", marginBottom: 10, fontSize: 14, backgroundColor: colorNi, borderRadius: 12, minHeight: 80, color: colorIota, }} placeholder="Description" />
        }
        {editing === true &&
          <View style={{ flexDirection: "row" }}>
            <TextInput
              onChangeText={text => onChangeText(text, 'price')}
              value={"" + Form.price + ""}
              style={{ color: colorIota, marginBottom: 10, backgroundColor: colorNi, width: "60%", borderRadius: 12, height: 40 }}
            //placeholder="Precio"
            />
            <View style={{ flexDirection: "row", width: "40%" }}>
              <TouchableOpacity onPress={() => setQTY(-1)} style={{ marginTop: 5 }}>
                <Icon name='minus-circle-outline' height={30} width={30} fill={colorBetta} />
              </TouchableOpacity>
              <Text style={{ color: colorIota, marginBottom: 10, marginHorizontal: 10, backgroundColor: colorNi, paddingHorizontal: 10, textAlign: "center", lineHeight: 35, borderRadius: 12, height: 40 }}>
                {Form.qty}
              </Text>
              <TouchableOpacity onPress={() => setQTY(+1)} style={{ marginTop: 5 }}>
                <Icon name='plus-circle-outline' height={30} width={30} fill={colorBetta} />
              </TouchableOpacity>
            </View>
          </View>
        }
        <Text style={{ fontSize: 20, marginTop: 5, fontWeight: "bold", color: colorBetta }}>{currencyFormat(total, 2)}</Text>
      </View>
      <LinearGradient colors={[colorBettaLight, colorBettaLight, colorBetta]} style={styles.wrapperSide}>
        {editing === true ?
          <TouchableOpacity onPress={() => Update()} style={{ width: 35, height: 35, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <Icon name='save-outline' height={25} width={25} fill={colorZeta} />
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => setediting(!editing)} style={{ width: 35, height: 35, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <Icon name='edit-outline' height={25} width={25} fill={colorZeta} />
          </TouchableOpacity>
        }
        {
          ((props.data.description).length > 70) &&
          <TouchableOpacity onPress={() => setview(!view)} style={{ width: 35, height: 35, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <Icon name={view === true ? 'eye-off-outline' : 'eye-outline'} height={25} width={25} fill={colorZeta} />
          </TouchableOpacity>
        }
        <TouchableOpacity onPress={() => props.delItem(props.data.id)} style={{ width: 35, height: 35, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
          <Icon name='trash-2-outline' height={25} width={25} fill={colorZeta} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colorZeta,
    flexDirection: "row",
    marginBottom: 20,
    width: "90%",
    borderRadius: 20,
    shadowColor: colorIota,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    elevation: 5,
  },
  wrapper: {
    flexDirection: "column",
    width: "85%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 110
  },
  wrapperSide: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: colorBetta,
    width: 50,
    height: "100%",
    paddingVertical: 8,
    position: "absolute",
    right: 0,
    bottom: 0
  }
});