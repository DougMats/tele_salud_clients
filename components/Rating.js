import React, { useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { colorBetta, colorDseta } from '../Colors.js';

function Rating(props) {
  const [title, settitle] = useState("GENIAL");
  const [value, setvalue] = useState(0);
  function starting(e) {
    if (e === 1) { settitle("MUY MAL"); setvalue(e) }
    if (e === 2) { settitle("MALO"); setvalue(e) }
    if (e === 3) { settitle("OKEY"); setvalue(e) }
    if (e === 4) { settitle("BIEN"); setvalue(e) }
    if (e === 5) { settitle("GENIAL"); setvalue(e) }
  }

  function saveRating()  { props.GetRating(value);}
  function cancelRating(){ props.SetRating();}
  return (

    <View style={{ paddingVertical: 10, width: "100%" }}>
      {/* <Text style={{ top: -10, color: colorBetta, fontWeight: "bold", textTransform: "capitalize", textAlign: "center", fontSize: 18, }}>{title}</Text> */}
      <View style={{ flexDirection: "column", }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity onPress={() => starting(1)}>
            <Icon name={value >= 1 ? 'star' : 'star-outline'} width={30} height={30} fill={value >= 1 ? colorBetta : colorDseta} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => starting(2)}>
            <Icon name={value > 1 ? 'star' : 'star-outline'} width={30} height={30} fill={value > 1 ? colorBetta : colorDseta} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => starting(3)}>
            <Icon name={value > 2 ? 'star' : 'star-outline'} width={30} height={30} fill={value > 2 ? colorBetta : colorDseta} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => starting(4)}>
            <Icon name={value > 3 ? 'star' : 'star-outline'} width={30} height={30} fill={value > 3 ? colorBetta : colorDseta} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => starting(5)}>
            <Icon name={value === 5 ? 'star' : 'star-outline'} width={30} height={30} fill={value === 5 ? colorBetta : colorDseta} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", marginTop: 30, justifyContent: "space-around", alignItems: "center", alignContent: "center" }}>
          <TouchableOpacity onPress={() => cancelRating()} style={{ width: "40%" }}>
            <Text style={{ color: colorBetta, textAlign: "center", fontSize: 16 }}>AHORA NO</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveRating()} style={{ width: "40%" }}>
            <Text style={{ color: colorBetta, textAlign: "center", fontSize: 16 }}>ENVIAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export default Rating;