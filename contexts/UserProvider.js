import React, { useState } from 'react'
import UserContext from './UserContext'

const UserProvider = ({ children }) => {

  const package_days = 5
  const nurse_booking =  {
    section : 'nurse_booking',
    introduced : false,
    concept : "Nurse per day",
    code : '_002',
    date : null,
    unit_price : 20,
    qty : 0,
    description : "You will have a nurse for {qty} days for {unit_price} USD per day"
  }
  const driver_booking = {
    section : 'driver_booking',
    introduced : false,
    code : '_003',
    concept : "Driver per day" ,
    date : "",
    unit_price : 20,
    qty : 0,
    description : "You will have a driver for {qty} days for {unit_price} USD per day"
  }
  const house_booking = {
    section : 'house_booking',
    introduced : false,
    code : '_004',
    concept : "Recovery house",
    date : "",
    unit_price : 45,
    qty : 0,
    description : "This will be your recovery site for {qty} days after your medical service."
  }
  const medical_booking = {
      section : 'medical_booking',
      introduced : false,
			concept : "Remote medical appointment",
			code : '_001',
			date : '',
			hour : '',
			unit_price : 100,
			qty : 0,
			description : 'You will be evaluated by a surgeon for 20 minutes to make a diagnosis',
			hour : {
				to 		: 	null,
				from 	: 	null
			}
		}
  
  const booking_template = {
    medical_booking,
		nurse_booking,
		driver_booking,
		house_booking,
  }


  const [ userDetails, setUserDetails ] = useState({
    email : null,
    name : null,
    surname: null,
    line: null,
    id_client: null,
    order : [],
    photo_profile: null
})

  const resetOrderSection = ( section ) => {
    
    if(section === 'products'){

      setUserDetails({
        ...userDetails,
        products: []
      })
      return
    }

    const data = { ...userDetails }
    data.order[ section ] = { ...booking_template[ section ] }
    return data
  }


  const _retrieveData = async () => {

    try {
      
        const value = JSON.parse( await AsyncStorage.getItem('@Passport') );
            
        if (value && value.token !== undefined) {
            setUserDetails(value)
            return value
      }
    } catch (error) { /* . . . */}
  };



  setInterval(()=>{
    _retrieveData()   
    },2000)


  
  const obj = { userDetails , setUserDetails, resetOrderSection }
  

  return (
    <UserContext.Provider value={obj}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider