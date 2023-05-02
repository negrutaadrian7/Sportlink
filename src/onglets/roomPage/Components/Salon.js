import React, { useState, useContext, useEffect } from 'react'
import { useSearchParams } from "react-router-dom";
import './Salon.css'
import { DataContext } from '../../../dataContext'
import { Container } from 'react-bootstrap'

import Main from './Main';
import Nav from './Nav';

function Salon() {
  const [currentSalon, setCurrentSalon] = useState()
  const { getbyid, getRooms, setRooms, droom, rooms, deleteOuPas} = useContext(DataContext)


  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id")
  
  


  useEffect(() => {
    getbyid(id).then(res => setCurrentSalon(res))
  }, [])
  
  const password = currentSalon?.Password
  const isPrivate = currentSalon?.Private

  const [rightPassword, setRightPassword] = useState(false)
  const [typedPassword, setTypedPassword] = useState("")
  const [error, setError] = useState("")


  function handlePassword(e) {
    setTypedPassword(e.target.value)
  }
  function checkPassword() {
    if (typedPassword !== password) {
      setError("wrong password")
    }
    setRightPassword(typedPassword === password)
  }

  return (

    <>
      {isPrivate ? rightPassword ?    // si privé:  on verifie le mot de passe, si il est bon, on affiche la page
        <>
          <Nav />
          <Container className='roomContainer justify-content-center'><Main /></Container>
        </>
        
        :
        
        <center>
          <div style={{ color: "white", paddingTop: "10%" }}>
            <h2 className='mb-4'> Ce salon demande un mot de passe </h2>
            <input id="input1" type="password" onChange={handlePassword} value={typedPassword} />
            <button onClick={checkPassword}>Confirm</button>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        </center> 
        
        :
        
        <><Nav />
          <Container className='roomContainer justify-content-center '><Main /></Container>
        </>}
    </>
  )
}

export default React.memo(Salon)
