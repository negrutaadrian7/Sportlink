import React, { useState, useContext, useEffect } from 'react'
import { Container, Col, DropdownButton, Dropdown, Form, Button, Alert, Navbar, Row} from 'react-bootstrap'
import { DataContext } from '../../../dataContext'
import { arrayUnion } from "firebase/firestore";

import './SearchBar.css'
import { ReactComponent as LogoSvg } from '../../homeComps/utils/logo.svg';
import { useNavigate } from 'react-router-dom'
import DateTimePicker from 'react-datetime-picker'
import { signOut } from 'firebase/auth'
import { auth} from '../../../firebase-config';

function Search() {

  const navigate = useNavigate()
  const {  currentUser, getRooms, addDocument2, getUserTable, updateDocument } = useContext(DataContext)

  //si pas connecté
  useEffect(() => {
    if (!currentUser) {
      navigate("/login") //on va a /myhome
    }
  }, [currentUser])

  const [error, setError] = useState("")

  function getLocalisation() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${long}&lat=${lat}`);
        const data = await response.json();
        const adresse = await data?.features?.[2]?.properties?.label.split(" ");
        const autoLocalisation = adresse[adresse.length - 1];
  
        const matchingRegion = regions.find(region =>
          region.cities.includes(autoLocalisation)
        );
        
        if (matchingRegion) {
          setSelectedCity(autoLocalisation);
          setSelectedRegion(matchingRegion.name);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  async function send() { // fonction qui ajoute  room dans la db 

    if (RoomTitle === "" || SelectedLevel === "" || MaxPlayer === "") {
      setError(<Alert className="mb-3" variant="danger"> All fields are required </Alert>)
    }
    else { //si tout est remplis
      try { //on essaie d'envoyer un new room dans la db
        var s = await getUserTable(currentUser.email);
        console.log(s.id);

        const newRoomRef = await addDocument2("Rooms", data) // on fait ca en premier 

        const newRoomId = newRoomRef.id;
        console.log("Here is the RoomId")
        console.log(newRoomId);


        await updateDocument('Users', s.id, { Rooms: arrayUnion(newRoomId) });

        getRooms();
        navigate("/myhome");
        window.location.reload();
      }

      catch (error) { //si erreur on console.log l'erreur
        console.log(error)
      }
    }
  }
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

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedCity('');
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  }


  const [SportSelect, SetSport] = useState("Sport") //sport selectioné
  function GetSport(e) {

    SetSport(e)

  }


  const [SelectedLevel, SetSelectedLevel] = useState("Nimp")  // Room size

  function handleSelect(e) {
    SetSelectedLevel(e)
  }



  const [MaxPlayer, SetMaxPlayer] = useState("")  // Room MaxPlayer
  function GetMaxPlayer(e) {
    const text = e.target.value
    SetMaxPlayer(text)
  }

  const [PlayerCreator] = useState(currentUser?.email) // Room PlayerCreator

  console.log(currentUser?.email)
  const [Contact, SetContact] = useState("") // Room Contact
  function GetContact(e) {
    const text = e.target.value
    SetContact(text)
  }

  const [RoomTitle, SetRoomTitle] = useState("") // Room Title
  function GetRoomTitle(e) {
    const text = e.target.value
    SetRoomTitle(text)
  }

  const [Datetime, setDatetime] = useState(new Date(new Date().setHours(new Date().getHours() + 6)));
  const [Datetime2, setDatetime2] = useState(new Date(new Date(Datetime).setHours(new Date(Datetime).getHours() + 3)));


  const [Chekedbox, SetChekedbox] = useState(false) // change le chekbox
  function handleChangeChk() {
    const check = !Chekedbox
    SetChekedbox(check)
  }

  const [Password, SetPassword] = useState("") // Room Password
  function Getpassword(e) {
    const text = e.target.value
    SetPassword(text)
  }

  const data = { // info Room
    Level: SelectedLevel,
    Date: Datetime,
    Date2: Datetime2,
    Finished: false,
    Full: false,
    Sport: SportSelect,
    Organiser: currentUser?.email,
    Participants: [currentUser?.email],
    Password: Password,
    Localisation: { Region: selectedRegion, City: selectedCity },
    Private: Chekedbox,
    PlayerCreator: PlayerCreator,
    MaxPlayer: MaxPlayer,
    Started: false,
    Title: RoomTitle,
    OrganiserContact: Contact
  }



  async function send() { // fonction qui ajoute  room dans la db 

    if (RoomTitle === "" || SelectedLevel === "" || MaxPlayer === "") {
      setError(<Alert className="mb-3" variant="danger">All fields are required</Alert>)
    }
    else { //si tout est remplis
      try { //on essaie d'envoyer un new room dans la db
        //console.log(data.id)

        var s = await getUserTable(currentUser.email);
        const newRoomRef = await addDocument2("Rooms", data);
        const newRoomId = newRoomRef.id;
        await updateDocument('Users', s.id, {Rooms: arrayUnion(newRoomId)});
        
        getRooms()
        navigate("/myhome");
        
        window.location.reload();
      }
      catch (error) { //si erreur on console.log l'erreur
        //console.log(error)
      } 
    }
  }
 
  async function handleSelect2(e) {
    let event = e
    switch (event) {
      case "Mon profil":
        navigate(`/info?id=${currentUser.uid}`)
        break
      case "MyHome":
        navigate("/myhome")
        break
      case "Logout":
        await signOut(auth)
        navigate("/login")
        break

      default:
        break
    }
  }
  return (
    <Container fluid prefixes={{ color: "white" }} className='createRoom'>
      <Navbar className='lenavars' >
        <Container fluid  >
          <Navbar.Brand href="/myhome" >
            <LogoSvg className='logo' width="230" height="120" style={{ position: 'relative', left: '10%' }} />
          </Navbar.Brand>
          <DropdownButton className='createRoomDropdown drop' title='My Profil' onSelect={handleSelect2} >
            <Dropdown.Item eventKey="MesInfo">
              Mon Profil
            </Dropdown.Item>
            <Dropdown.Item eventKey="MyHome">
              My Home
            </Dropdown.Item>
            <Dropdown.Item eventKey="Logout">
              Logout
            </Dropdown.Item>
          </DropdownButton>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>
      <div className='createRoom-body'>
        <Row style={{marginBottom: '5%'}}>
          <Col style={{marginLeft: '15%'}}>
          <h4>Niveau sportif :</h4>
          </Col>
          <Col style={{marginRight:'40%'}}>
          <DropdownButton className='createRoomDropdown' title={SelectedLevel} id="dropdown-size" onSelect={handleSelect2} >
            <Dropdown.Item eventKey="Nimp">
              Nimp
            </Dropdown.Item>
            <Dropdown.Item eventKey="Débutant">
              Débutant
            </Dropdown.Item>
            <Dropdown.Item eventKey="Intermediaire">
              Intermediaire
            </Dropdown.Item>
            <Dropdown.Item eventKey="Expert">
              Expert
            </Dropdown.Item>
          </DropdownButton>
          </Col>
        </Row>
        <Col>
        <Row>
          <Col style={{marginLeft: '10%'}}>
          <h4>Titre du salon :</h4>
          </Col>
          <Col style={{marginRight: '30%',marginLeft:'-10%',marginBottom:'5%'}}>
          <Form.Control  className='forms' type="text" onChange={GetRoomTitle} />
          </Col>
        </Row>
          <div>
            <Row>
            <Col style={{marginLeft:'19%'}}>
            <h4>Sport :</h4>
            </Col>
            <Col style={{marginRight:'40%',marginBottom:'5%'}}>
            <DropdownButton className='createRoomDropdown' title={SportSelect} id="dropdown-size" onSelect={GetSport} >
              <Dropdown.Item eventKey="Sport">
                Sport
              </Dropdown.Item>
              <Dropdown.Item eventKey="Football">
                Football
              </Dropdown.Item>
              <Dropdown.Item eventKey="Basketball">
                Basketball
              </Dropdown.Item>
              <Dropdown.Item eventKey="Tennis">
                Tennis
              </Dropdown.Item>
            </DropdownButton>
            </Col>
            </Row>
          </div>

          <div>

            <label style={{marginLeft : '22%', fontSize:'25px'}} htmlFor="region">Région : </label>
            <select style={{marginRight:'35%',marginLeft:'5%'}} id="region" className='dropdown-toggle btn btn-danger' value={selectedRegion} onChange={handleRegionChange}>
              <option  value="">Sélectionner une région</option>
              {regions.map(region => (
                <option key={region.name} value={region.name}>{region.name}</option>
              ))}
            </select>

            {selectedRegion && (
              <div>
                <label htmlFor="city">Ville : </label>
                <select id="city" value={selectedCity} onChange={handleCityChange}>
                  <option value="">Sélectionner une ville</option>
                  {regions.find(region => region.name === selectedRegion).cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button style={{marginBottom:'5%'}} onClick={getLocalisation}>get Localisation</button>
          <Row>
          <Col style={{marginLeft:'10%'}}>
          <h4 >Max joeurs :</h4>
          </Col>
          <Col style={{marginRight: '30%',marginLeft:'-10%',marginBottom:'5%'}}>
          <Form.Control className='forms' type="text" onChange={GetMaxPlayer} />
          </Col>
          </Row>
          <Row>
          <Col style={{marginLeft:'11.5%'}}>
          <h4>Contact :</h4>
          </Col>
          <Col style={{marginRight: '30%',marginLeft:'-10%',marginBottom:'5%'}}>
          <Form.Control type="text" onChange={GetContact} />
          </Col>
          </Row>
          <Row>
          <Col style={{marginLeft:'7%'}}>
          <h4>Date de début :</h4>
          </Col>
          <Col style={{marginRight: '30%',marginLeft:'-10%',marginBottom:'5%'}}>
          <DateTimePicker onChange={setDatetime} value={Datetime} />
          </Col>
          </Row>
          <Row>
          <Col style={{marginLeft:'7%'}}>
          <h4>Date de fin :</h4>
          </Col>
          <Col style={{marginRight: '30%',marginLeft:'-10%',marginBottom:'5%'}}>
          <DateTimePicker onChange={setDatetime2} value={Datetime2} />
          </Col>
          </Row>
        </Col>
        <Row>
        <Col style={{marginLeft:'7%'}}>
        <div className='createRoomCheckBox'>
          Salon privé :
          <input type="checkbox" onChange={handleChangeChk} />
        </div>
        </Col>
        <Col style={{marginRight: '25%',marginLeft:'-10%',marginBottom:'5%'}}>
        {Chekedbox &&
          <Form.Control className="forms mb-3" type="text" placeholder="Password" onChange={Getpassword} />
        }  {error}
        </Col>
        </Row>
        <div>
          <Button onClick={send}>
            Créer
          </Button>
        </div>
      </div>
    </Container>

  )
}

export default Search