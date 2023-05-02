import { Container, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBasketballBall, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'

export default function LeftBar(props) {

  
  const myhome = !window.location.href.includes("myhome")
  const Messages = !window.location.href.includes("Messages")

  //fonctions pour filtrer (on utilise les fonctions qu'on a envoyé en tant que props dans App.js)
  function dateClickHandler(e) {
    props.dateHandler(e)
  }
  function platformClickHandler(e) {
    props.platformHandler(e)
  }


  /* LOCALISATION */
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedCity('');
    props.regionHandler(event.target.value)
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    props.cityHandler(event.target.value)
  };

  const regions = [
    {
      name: 'Auvergne-Rhône-Alpes',
      cities: ['Lyon', 'Grenoble', 'Saint-Étienne', 'Clermont-Ferrand']
    },
    {
      name: 'Bourgogne-Franche-Comté',
      cities: ['Dijon', 'Besançon', 'Chalon-sur-Saône', 'Nevers']
    },
    {
      name: 'Bretagne',
      cities: ['Rennes', 'Brest', 'Saint-Malo', 'Quimper']
    },
    {
      name: 'Alpes-Maritimes',
      cities: ['Nice', 'Cannes', 'Antibes', 'Grasse']
    },
    {
      name: 'Île-de-France',
      cities: ['Paris', 'Versailles', 'Fontainebleau', 'Saint-Denis']
    }
    // Ajouter toutes les régions et leurs principales villes
  ];
  
  const location = useLocation();

  const active = { //style pour montrer sur quel onglet on est
    border: '1px solid rgba(255,255,255,1)',
    borderRadius: '50%',
    padding: '5px'
  }

  const inactive = { //style pour montrer sur quel onglet on est pas
    borderRadius: '50%',
    padding: '5px',
    border: '1px solid rgba(255,255,255,0.20)'
  }

  const linkStyle = { //style des liens
    fontSize: "22px",
    textDecoration: 'none',
    color: 'white',
    fontFamily: '"antonio", sans-serif',
  }

  return (
    <Container style={{ color: 'white' }} className="room-leftbar-ctnr">
      <Row>
        <Col md={12} className="mb-5">
          <Link to="/myhome" style={linkStyle} className=" leftbar-item">
            <span className='me-2' style={location.pathname === "/myhome" ? active : { inactive }}><FontAwesomeIcon icon={faBasketballBall} /></span>
            My Home
          </Link>
        </Col>
        <Col md={12} className="mb-5 ">
          <Link to="/room" style={linkStyle} className=" leftbar-item">
            <span className='me-2' style={location.pathname === "/room" ? active : { inactive }}><FontAwesomeIcon icon={faPersonCirclePlus} /></span>
            Room
          </Link>
        </Col>
        <Col md={12} className="mb-5 ">
          <Link to="/Messages" style={linkStyle} className=" leftbar-item">
            <span className='me-2' style={location.pathname === "/Messages" ? active : { inactive }}><FontAwesomeIcon icon={faBasketballBall} /></span>
            Messages
          </Link>
        </Col>
      </Row>
      {myhome && Messages?
        <div >
          <h4 className='text-white mb-5'>Filter By</h4>
          <div>

            <Dropdown className="mb-4 border border-2 border-light " style={{ width: 'fit-content', borderRadius: '8px', backgroundColor: 'ButtonShadow' }}>
              <Dropdown.Toggle variant="white">
                {props.date}
              </Dropdown.Toggle>

              <Dropdown.Menu variant="white">
                <Dropdown.Item className="dateFilter " onClick={dateClickHandler} >Date</Dropdown.Item>
                <Dropdown.Item className="dateFilter" onClick={dateClickHandler}>Today</Dropdown.Item>
                <Dropdown.Item className="dateFilter" onClick={dateClickHandler}>This week</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="mb-4 border border-2 border-light " style={{ width: 'fit-content', borderRadius: '8px', backgroundColor: 'ButtonShadow' }}>
              <Dropdown.Toggle variant="white">
                {props.platform}
              </Dropdown.Toggle>

              <Dropdown.Menu variant="white">
                <Dropdown.Item className="platformFilter" onClick={platformClickHandler}>Sports</Dropdown.Item>
                <Dropdown.Item className="platformFilter" onClick={platformClickHandler}>Sport</Dropdown.Item>
                <Dropdown.Item className="platformFilter" onClick={platformClickHandler}>Football</Dropdown.Item>
                <Dropdown.Item className="platformFilter" onClick={platformClickHandler}>Basketball</Dropdown.Item>
                <Dropdown.Item className="platformFilter" onClick={platformClickHandler}>Tennis</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div>
              <select className="dropdown-toggle btn btn-white mb-4 border border-2 border-light " id="region" style={{ backgroundColor: 'ButtonShadow' }} value={selectedRegion} onChange={handleRegionChange}>
                <option value="">Sélectionner une région</option>
                {regions.map(region => (
                  <option key={region.name} value={region.name}>{region.name}</option>
                ))}
              </select>

              {selectedRegion && (
                <div className='pl-5'>
                  <select className="dropdown-toggle btn btn-white mb-4 border border-2 border-light " id="city" style={{ backgroundColor: 'ButtonShadow' }} value={selectedCity} onChange={handleCityChange}>
                    <option value="">Sélectionner une ville</option>
                    {regions.find(region => region.name === selectedRegion).cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div> : null}
    </Container>
  )
}
