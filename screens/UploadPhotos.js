import React, { useState, useContext, createRef, useEffect } from 'react';
import { ScrollView, Text, View, StatusBar, Image, StyleSheet, InteractionManager, Dimensions, findNodeHandle, TouchableOpacity, ActivityIndicator } from 'react-native';
import UserContext from '../contexts/UserContext'
import axios from 'axios'
import { serverCrm, base_url } from '../Env'
import { Icon } from 'react-native-eva-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-simple-toast';
import imagesWizardData from '../components/imagesWizardData'
import PhotoUpload from 'react-native-photo-upload'
import { SafeAreaView } from 'react-native';
import { BG1, BG2, colorAA, colorAlfa, colorBetta, colorBettaLight, } from '../Colors';
import BTN from '../components/BTN.js';
import Big from '../components/Time/Big.js';
import Small from '../components/Time/Small.js';
import LinearGradient from 'react-native-linear-gradient';

const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;
const WW = (w / 12) * 4.5;

function UploadPhotos(props) {
  let PhotosUplaods = []
  const { navigation } = props;
  const backgroundImageRef = createRef();
  const category_key = props.route.params.data.type;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loaded, setloaded] = useState(0);
  const [dataSlots, setdataSlots] = useState(imagesWizardData)
  const [successful, setsuccessful] = useState(false);


  const { UserDetails, setUserDetails } = useContext(UserContext)
  const tintColor = ['#ffffff', '#000000'];
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;
  const userDetails = React.useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [Blur, setBlur] = React.useState(0)
  const [BtnDisable, setBtnDisable] = React.useState(false)
  const [Load, setLoad] = React.useState(false)
  const [viewRef, setViewRef] = useState(null);
  const [blurType, setBlurType] = useState('dark')
  const [fileToUpload, setFileToUpload] = React.useState(false)
  const [state, setState] = useState({ scrollEnabled: true })
  const [selecting, setSelecting] = useState(false)
  const [activeItem, setActiveItem] = useState({ category_key, item_key: false });
  const [mensaje, setmensaje] = useState("");
  const [DateSelected, setDateSelected] = useState("Add a date");
  const [BackgroundBtn, setBackgroundBtn] = useState(colorAlfa);


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

    console.log("sending...", PhotosUplaods.length)
    if (PhotosUplaods.length > 0) {
      if (PhotosUplaods.length < dataSlots[category_key].images.length) { Toast.show("Todas las Fotos son necesarias.");}
      else {
        setLoad(true)
        let msj
        let data = { "id_cita": props.route.params.data.id, "photos": PhotosUplaods }
        axios.post(base_url(serverCrm, `save/images/valoration`), data).then(function (response) {
          if (response.data === true) {
            setLoad(false)
            setloaded(1)
          }
        })
      }
    }
    else {
      Toast.show("Es necesario subir las fotos.")
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
      navigation.navigate('Sala', { randomCode: Math.random() })
    }, 500);
  }


  const RequerimentItem = (props) => {
    return (
      <View style={{
        width: WW,
        height: WW, //null
        marginHorizontal: '2%',
        marginVertical: '3%',
        borderRadius: 5,
        borderColor: "#fff",
        borderWidth: 0.5,
        overflow: 'hidden'
      }}>
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
          <Image style={{ width: WW, height: WW }} source={{ uri: (!props.replace) ? props.resource : props.replace }} />
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
          >{props.label}</Text>
        </PhotoUpload>
      </View>)
  }



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={colorAA} />
      <LinearGradient colors={[colorAA, colorAlfa, colorBetta, colorBettaLight, colorAlfa]} style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: "90%", borderRadius: 10, backgroundColor: "#fff" }}>
          <View style={{ padding: 10, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <Text style={{ textAlign: "center", width: "90%", fontSize: 16, fontWeight: "bold", color: colorBetta, textTransform: "uppercase" }}>
              Para poder determinar tu diagnóstico es necesario que nos envíes las siguientes fotos.
            </Text>
            <Text style={{ textAlign: "center", width: "80%", fontSize: 14, color: "#1f1f1f" }}>
              Presiona sobre cada imagen para activar la cámara de tu dispositivo
            </Text>
          </View>
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
            padding: 15
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
          <View style={{ width: "100%", alignItems: "center", alignContent: "center", marginVertical: 20 }}>
            <BTN icon="checkmark-circle-outline" text="Enviar" function={sendForm} screen="Login" data={""} w={"80%"} />
            <TouchableOpacity onPress={() => goToScreen()} style={{ marginTop: 20, flexDirection: "column", alignContent: "center", alignItems: "center" }}>
              <Text style={{ color: "#111", textAlign: "center" }}> Si deseas puedes</Text>
              <Text style={{ fontWeight: "bold", color: colorBetta, textAlign: "center" }}>* Enviar las fotos en otro momento *</Text>
              <Text style={{ color: "#111", paddingHorizontal: 20, textAlign: "center" }}>Recuerda hacerlo antes de iniciar la video valoración</Text>
            </TouchableOpacity>
          </View>
        </View>
        {
          Load &&
          <View style={{ position: "absolute", zIndex: 999, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <View style={{ backgroundColor: "white", width: "80%", paddingVertical: 20, borderRadius: 12, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
              <ActivityIndicator color={colorBetta} size={40} />
              <Text style={{ width: "90%", marginVertical: 10, textAlign: "center" }}>Enviando las imágenes.</Text>
            </View>
          </View>
        }
        {
          !Load && loaded === 1 &&
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
          </View>
        }
        {
          !Load && loaded === 2 &&
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
      </LinearGradient>
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
    height: null, //null
    marginHorizontal: '2%',
    marginVertical: '3%',
    borderRadius: 5,
    borderColor: "#fff",
    borderWidth: 0.5,
    overflow: 'hidden'
  },
});

export default UploadPhotos;


