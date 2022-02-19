
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colorAA, colorAlfa, colorBettaLight, colorBetta, colorZeta } from '../Colors';
import { Icon } from 'react-native-eva-icons';


function BTN(props) {
  
  function clic(e) {
    props.function(e)
  }

  return (
    <TouchableOpacity style={[styles.btn, { width: props.w }]} onPress={() => clic(props.data)}>
      <LinearGradient colors={[ colorBettaLight, colorBetta ]} style={styles.gradient}>
        {props.icon !== "" &&
          <Icon name={props.icon} height={28} width={28} fill={colorZeta} style={{ marginTop: -5 }} />
        }
        {props.text !== "" &&
          <Text style={styles.text}>{props.text}</Text>
        }
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    height: 40,   
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center"
  },
  text: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    color: colorZeta
  }
})





export default BTN;