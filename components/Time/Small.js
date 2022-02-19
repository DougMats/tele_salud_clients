import React, { useState } from 'react';
import { useTimer, useStopwatch } from 'react-timer-hook';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { GetDiference, zfill } from './logic.js';

function TimeOut(props) {
  const time = new Date();
  const [status, setstatus] = useState(true);
  const [count, setcount] = useState(GetDiference(props.days, props.hours));
  time.setSeconds(time.getSeconds() + count);
  function SetStatus(e) {
    console.log("cambiando el estado del reloj")
    setstatus(e)
  }

  if (status === true) {
    return (
      <>
       <MyTimer
    expiryTimestamp={time}
    title={props.title}
    size={props.size}
    color={props.color}
    status={status}
    SetStatus={SetStatus}
    w={props.w}
  /> 
      </>
    );
  }
  else {
    return (
    <Text style={[{ color: props.color, textTransform: "uppercase", fontSize: props.size }, styles.number]}>Tiempo Agotado</Text>
    )
  }
}



function MyTimer({ expiryTimestamp, size, color, status, SetStatus, w }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => SetStatus(!status) });


  return (
    <View style={[styles.wrapper,{width:w}]}>
      <Text style={[{ color: color, fontSize: size }, styles.number]}>Días: {zfill(days, 2)}</Text>
      <Text style={[{ color: color, fontSize: size }, styles.number]}> - Horas: {zfill(hours, 2)}:{zfill(minutes, 2)}:{zfill(seconds, 2)}</Text> 
    </View>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  number: {

    lineHeight: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
})
export default TimeOut;