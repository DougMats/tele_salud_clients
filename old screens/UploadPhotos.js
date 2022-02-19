import React, { useState, useContext, createRef, useEffect } from 'react';
import { ScrollView, Text, View, Dimensions, TouchableOpacity, StatusBar, Image, Modal, StyleSheet, InteractionManager, findNodeHandle, ActivityIndicator } from 'react-native';
import Head from '../components/Head'
import Menu from '../components/Menu'
import UserContext from '../contexts/UserContext'
import axios from 'axios'
import { serverCrm, base_url } from '../Env'
import { Icon } from 'react-native-eva-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-simple-toast';
import imagesWizardData from '../components/imagesWizardData'
import PhotoUpload from 'react-native-photo-upload'
import { SafeAreaView } from 'react-native';
import { BG1, BG2, colorAlfa, } from '../Colors';
import BTN from '../components/BTN.js';
import Big from '../components/Time/Big.js';
import Small from '../components/Time/Small.js';

function UploadPhotos(props) {
  let PhotosUplaods = []
  const { navigation } = props;
  const { UserDetails, setUserDetails } = useContext(UserContext)
  const tintColor = ['#ffffff', '#000000'];
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;
  const userDetails = React.useContext(UserContext);
  const backgroundImageRef = createRef();
  const category_key = props.route.params.data.type;
  const [modalVisible, setModalVisible] = useState(false);
  const [Blur, setBlur] = React.useState(0)
  const [BtnDisable, setBtnDisable] = React.useState(false)
  const [Load, setLoad] = React.useState(false)
  const [viewRef, setViewRef] = useState(null);
  const [blurType, setBlurType] = useState('dark')
  const [fileToUpload, setFileToUpload] = React.useState(false)
  const [state, setState] = useState({ scrollEnabled: true })
  const [selecting, setSelecting] = useState(false)
  const [dataSlots, setdataSlots] = useState(imagesWizardData)
  const [activeItem, setActiveItem] = useState({ category_key, item_key: false });
  const [successful, setsuccessful] = useState(false);
  const [mensaje, setmensaje] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [DateSelected, setDateSelected] = useState("Add a date");
  const [BackgroundBtn, setBackgroundBtn] = useState(colorAlfa);
  const [loaded, setloaded] = useState(0);

  React.useEffect(() => {
    console.log("category_key", props.route.params.data.type)
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setViewRef(
          findNodeHandle(backgroundImageRef.current)
        );
      }, 500);
    });
  }, [])

  useEffect(() => {
    let images = []
    images = dataSlots[category_key].images
    let data = [];
    for (let i = 0; i <= images.length - 1; i++) {
      images[i].replace = null
    }
    setdataSlots({
      ...dataSlots,
      [category_key]: { images: [...images] }
    })
  }, [])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setDateSelected(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    setBackgroundBtn("green")
  };






  function sendForm() {
    setLoad(true)
    console.log("sending...", PhotosUplaods.length)
    if (PhotosUplaods.length > 0) {
      let msj
      let data = { "id_cita": props.route.params.data.id, "photos": PhotosUplaods }
      axios.post(base_url(serverCrm, `save/images/valoration`), data).then(function (response) {
        if (response.data === true) {
          setloaded(1)
          setLoad(false)
        }
      })
        .catch(function (error) { console.log(error.data) })
    }
    else {
      Toast.show("Es necesario subir las fotos")
      return false;
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setsuccessful(false)
    }, 10000);
  }, [successful]);

  useEffect(() => {
    if (loaded === 1) {
      setTimeout(() => {
        setloaded(2)
      }, 3000);
    }
    if (loaded === 0) {
      setTimeout(() => {
        setloaded(0)
      }, 5000)
    }
  }, [loaded]);




  function goToScreen() {
    let key_conference = props.route.params.data.code
    navigation.navigate('Sala', { randomCode: Math.random(), key_conference })
  }

  function closeModal() {
    setloaded(0)
    setTimeout(() => {
      navigation.navigate('Dashboard', { randomCode: Math.random() })
    }, 500);
  }

  const RequerimentItem = (props) => {
    return (
      <View style={styles.gridElement}>
        <PhotoUpload onPhotoSelect={avatar => {
          if (avatar) {
            let number = Math.random()
            PhotosUplaods = [
              ...PhotosUplaods,
              avatar
            ]
          }
        }
        }>
          <Image style={{
            paddingVertical: 30,
            width: 200,
            height: 150,
          }}
            source={{ uri: (!props.replace) ? props.resource : props.replace }} />
          <Text style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 5,
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 'bold',
            flex: 2,
            left: "30%",
            top: 15,
            position: 'absolute'
          }}
          >{props.label} </Text>
        </PhotoUpload>
      </View>)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" />
      <ScrollView>
        <Head props={props} from={""} />
        <View style={{
          flex: 1,
          paddingTop: 100,
          paddingBottom: 100,
          height: "100%",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          width: "100%"
        }}>
          <View style={{ width: "90%", marginTop: 10, marginBottom: 40, borderRadius: 10, backgroundColor: "#fff" }}>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={new Date()}
            />
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              padding: 20
            }}>
              {
                dataSlots[category_key].images.map((item, key) => {
                  return <RequerimentItem
                    key={key}
                    category_key={category_key}
                    item_key={key}
                    label={item.label}
                    resource={item.resource}
                    replace={item.replace}
                  />
                })
              }
            </View>
          </View>
          <BTN icon="checkmark-circle-outline" text="Enviar" function={sendForm} screen="Login" data={""} w={"80%"} />
          {/* <TouchableOpacity style={styles.modalBtn} onPress={() => { sendForm(); }} disabled={BtnDisable}>
            {/* {Load && <ActivityIndicator size="small" color="#fff" />} *
            {!Load && <Icon name="checkmark-circle-outline" width={20} height={20} fill="#FFF" />}
            {/* {!Load && <Text style={styles.modalBtnText}>Enviar</Text>} *
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      <Menu props={props} option={2} />
      {
        loaded === 1 &&
        <View style={{ position: "absolute", zIndex: 999, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", width: "90%", paddingVertical: 20, borderRadius: 12, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <View style={{ width: 180, height: 180 }}>
              <Image
                style={{ width: null, height: null, resizeMode: "cover", flex: 1 }}
                source={require("../images/formThree.png")}
              />
            </View>
            <Text style={{ width: "90%", marginVertical: 10, textAlign: "center" }}>Has completado los requisitos necesarios para acceder a la video consulta.</Text>
          </View>
        </View>}
      {
        loaded === 2 &&
        <View style={{ position: "absolute", zIndex: 999, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
          {/* <Small days={props.route.params.data.scheduled_day} hours={props.route.params.data.scheduled_time} size={14} color={"#000"} /> */}
          <View style={{ backgroundColor: "white", width: "90%", paddingVertical: 20, borderRadius: 12, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <Big days={props.route.params.data.scheduled_day} hours={props.route.params.data.scheduled_time} title="tiempo restante para la video valoración" />
            <Text style={{ width: "90%", marginVertical: 10, textAlign: "center" }}>
              Deseas conectarte a la video valoración ahora?
            </Text>
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-around" }}>
              <BTN icon="checkmark-circle-2-outline" text="Si" function={goToScreen} screen="Login" data={""} w={"40%"} />
              <BTN icon="close-circle-outline" text="No" function={closeModal} screen="Login" data={""} w={"40%"} />
            </View>
          </View>
        </View>
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalView: {},
  blurViewStyle: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 5
  },
  modalBtn: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#00AFE8",
    width: "70%",
    padding: 10,
    borderRadius: 20
  },
  modalBtnText: {
    marginLeft: 15,
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700"
  },
  gridElement: {
    width: '46%',
    height: null,
    marginHorizontal: '2%',
    marginVertical: '3%',
    borderRadius: 5,
    borderColor: "#fff",
    borderWidth: 0.5,
    overflow: 'hidden'
  },
});

export default UploadPhotos;


