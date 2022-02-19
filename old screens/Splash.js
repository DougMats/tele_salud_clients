import React, { useState, useRef, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Image, StatusBar, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { a, b, c, d, colorAA, colorAlfa, colorBetta, colorKappa, colorZeta, colorDelta, colorOmega, } from '../Colors';

const AnimationUP = (props) => {
  const MoveToLeft = useRef(new Animated.Value(250)).current
  React.useEffect(() => {
    Animated.timing(
      MoveToLeft,
      {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      },
    ).start();
  }, [MoveToLeft])
  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ translateY: MoveToLeft }]
      }}
    >
      {props.children}
    </Animated.View>
  );
}

const AnimationDOWN = (props) => {
  const MoveToLeft = useRef(new Animated.Value(-250)).current
  React.useEffect(() => {
    Animated.timing(
      MoveToLeft,
      {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      },
    ).start();
  }, [MoveToLeft])
  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ translateY: MoveToLeft }]
      }}
    >
      {props.children}
    </Animated.View>
  );
}

function Index(props) {
  return (
    <View  style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
      <View style={{ width: "100%", height: "100%",}}>
      <AnimationUP style={{ position: "absolute", width: "100%",  alignItems: "center", alignContent: "center", }}>
          <Image style={styles.icon} source={require("../images/logotele.png")} />
        </AnimationUP>
        <AnimationDOWN style={{ position: "absolute", width: "100%",  alignItems: "center", alignContent: "center", }}>
          <Image style={styles.icon} source={require("../images/logosalud.png")} />
        </AnimationDOWN>
      </View>
      <Text style={{position:"absolute", bottom:20, color:"silver", fontSize:14}}>by © PDT Agency.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: "space-evenly"
  },
  icon: {
    width: "80%",
    resizeMode: "contain"
  },
  splash_top: {
    width: "100%",
    resizeMode: "contain",
  },
  splash_bottom: {
    width: "100%",
    resizeMode: "contain",
  }
});

export default Index;