import React, { useState } from 'react';
import { useTimer, useStopwatch } from 'react-timer-hook';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { GetDiference, GetDiference2, zfill } from './logic.js';




function TimeOut(props) {
  const time = new Date();
  const [status, setstatus] = useState(false);

  let fecha = props.days
  let hora
  let valueA = props.hours.split('-')[0]
  let valueB = props.hours.split('-')[1]
  if (valueB === "PM") {
    let hh = valueA.split(":")[0]
    let h = parseInt(hh, 12) + 12;
    let m = valueA.split(":")[1]
    let s = valueA.split(":")[2]
    hora = h + ":" + m + ":" + s
  }
  else {
    hora = valueA
  }

  const [count, setcount] = useState(GetDiference(fecha, hora));


  time.setSeconds(time.getSeconds() + count);
  function SetStatus(e) {
    setstatus(e)
  }

  let diferencia = GetDiference2(fecha, hora);


  if (status === false) {
    return (
      <>
        <MyTimer
           status={status}
           expiryTimestamp={time}
           title={props.title}
           status={status}
           SetStatus={SetStatus}
        />
      </>
    );
  }
  else {
    return (
      <MyStopwatch
        size={props.size}
        color={props.color}
        w={props.w}
        dif={diferencia}
      />
    )
  }






  // return (
  //   <MyTimer
  //     status={status}
  //     expiryTimestamp={time}
  //     title={props.title}
  //     status={status}
  //     SetStatus={SetStatus}
  //   />
  // );
}



function MyStopwatch({ size, color, w, dif }) {
  let stopwatchOffset = new Date();
  let diferencia = dif

  stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + diferencia);
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset } = useStopwatch({ autoStart: true, offsetTimestamp: stopwatchOffset });
  return (
    <View style={{ width: w, flexDirection: "column", justifyContent: "center", }}>
      <Text style={{ width: "100%", textAlign: "center", fontSize: 12, lineHeight: 20, fontWeight: "bold", color: color }}>La video valoración comenzó hace</Text>
      <View style={{ width: w, flexDirection: "row", justifyContent: "center", }}>
        <Text style={[{ color: color, fontSize: size }, styles.number]}> {zfill(hours, 2)}: {zfill(minutes, 2)} : {zfill(seconds, 2)}</Text>
      </View>
    </View>
  );
}





function MyTimer({ expiryTimestamp, title, status, SetStatus }) {
  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp, onExpire: () => SetStatus(!status) });

  if (status === false) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.reloj}>
          <View style={styles.group}>
            <Text style={styles.number}>{zfill(days, 2)}</Text>
            <Text style={styles.name}>dias</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.number}>{zfill(hours, 2)}</Text>
            <Text style={styles.name}>horas</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.number}>{zfill(minutes, 2)}</Text>
            <Text style={styles.name}>minutos</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.number}>{zfill(seconds, 2)}</Text>
            <Text style={styles.name}>segundos</Text>
          </View>
        </View>
      </View>
    )
  }
  else {
    return (<></>)
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    flexDirection: "column",
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
    color: "#000",
    paddingHorizontal: 30
  },
  reloj: {
    flexDirection: "row",
    justifyContent: "center"
  },
  group: {
    borderRadius: 12,
    backgroundColor: "white",
    width: 65,
    height: 80,
    margin: 2,
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    elevation: 5,
  },
  number: {
    fontWeight: "bold",
    color: "red",
    fontSize: 30,
    textAlign: "center"
  },
  name: {
    textTransform: "capitalize",
    textAlign: "center",
    color: "#777",
    fontSize: 12
  },
})


export default TimeOut;