import React, { useState, useEffect, useContext, useRef } from 'react';
import './document.css'
import { DataContext } from "../../dataContext"
import { updateProfile, signOut } from 'firebase/auth'
import { auth, storage } from '../../firebase-config';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import fad from "./1234.jpg"
import "../signUpComps/addAvatar.png"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Container, Navbar, DropdownButton, Dropdown } from 'react-bootstrap'
import { ReactComponent as LogoSvg } from '../homeComps/utils/logo.svg';
import Chathome from '../roomPage/Components/Chathome';


export default function ProfilInfo() {
  const {currentUser, getUserTable, updateDocument, updateEmailInFirebaseAuth, getUsers, getUserbyid, removeUser } = useContext(DataContext)
  const [activeItem, setActiveItem] = useState(null);
  const [active, setActive] = useState(null);
  const [isEditing, setIsEditing] = useState({Nom :false,Prenom :false,Email :false,Motdepasse :false}); // ajout de l'état d'édition
  const [inputValue, setInputValue] = useState({ Nom: "", Prenom: "", Email: "", Motdepasse: "" }); // ajout de l'état po
  const [displayName, setDisplayName] = useState()
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleMouseOver = (item) => {setActiveItem(item);};
  const handleMouseOverimage = () => { setActive('oui'); };
  const handleMouseOut = () => {setActiveItem(null);};
  const handleMouseOutimage = () => { setActive(null); };
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentProfil, setCurrentProfil] = useState()
  const id = searchParams.get("id")
  
  const handleEditClick = (e) => {
    switch (e) {
      case "Nom":
        setInputValue(prev =>({ ...prev, Nom: getUserTable(currentUser?.email)?.LastName}));
        setIsEditing(prev => ({ ...prev, Nom:true }))
        break;
      case "Prenom":
        setInputValue(prev => ({ ...prev, Prenom: getUserTable(currentUser?.email)?.FirstName }));
        setIsEditing(prev => ({ ...prev, Prenom: true }))

        break;
      case "Email":
        setInputValue(prev => ({ ...prev, Email: currentUser?.email }));
        setIsEditing(prev => ({ ...prev, Email: true }))

        break;
      case "Mot de passe":
        setInputValue(prev => ({ ...prev, Motdepasse: "****" }));
        setIsEditing(prev => ({ ...prev, Motdepasse: true }))

        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {setInputValue(prev => ({ ...prev, [e.target.placeholder] : e.target.value }));};  
  const handleSaveClick = async (e) => { 
    switch (e) {
      case "Nom":
        setIsEditing(prev => ({ ...prev, Nom: false }))
        await updateDocument('Users', currentUser.uid, { LastName: inputValue.Nom });
        getUsers()
        break;
      case "Prenom":
        await updateDocument('Users', currentUser.uid, { FirstName: inputValue.Prenom });
        setIsEditing(prev => ({ ...prev, Prenom: false }))
        getUsers()
        break;
      case "Email":
        updateEmailInFirebaseAuth(inputValue.Email)
        setIsEditing(prev => ({ ...prev, Email: false }))
        //getUsers()
        break;
      case "Mot de passe":
        setIsEditing(prev => ({ ...prev, Motdepasse: false }))
        break;
      default:
        break;
    };
  };
  
  useEffect(() => { getUserbyid(id).then(res => setCurrentProfil(res)) }, [])
  useEffect(() => {if (!currentUser) {}}, [currentUser])
  let cUser = getUserTable(currentUser?.email)
  const handleChangef = async (e) => {
    e.preventDefault();
    const date = new Date().getTime();
    const storageRef = ref(storage, `${cUser?.LastName + date}`);
    await uploadBytesResumable(storageRef, e.target.files[0]).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        try {
          //Update profile
          await updateProfile(currentUser, {
            displayName,
            photoURL: downloadURL,
          })
          await updateDocument('Users', currentUser.uid, { photoURL: downloadURL });
          window.location.reload(false)

        } catch (err) {
          
          setErr(true);
          setLoading(false);
          console.log(err);

        }
      });
    })
  }
 
  async function handleSelect(e) {
    let event = e
    switch (event) {
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
  const [isVisible, setIsVisible] = useState(false);
  const divRef = useRef(null);

  useEffect(() => {
    // Ajouter un écouteur d'événement pour cacher le div superposé quand on clique hors du div.
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [divRef]);

  const handleClickButton = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
    { currentUser.uid === id ? 
    <>
    <Container fluid className="mybody" style={{ minHeight: "100vh" }}>
      <Navbar className='lenavarr' >
        <Container fluid  >
          <Navbar.Brand href="/myhome" >
            <LogoSvg className='logo' width="230" height="120" style={{ position: 'relative', left: '10%' }} />
          </Navbar.Brand>

          <DropdownButton className='createRoomDropdown drop' title='My Profil' onSelect={handleSelect} >
           
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

    <div className="tous">
      <label className='imagelabel' htmlFor="file">
        <img className={`imagepr ${active ==='oui' ? 'hover' :'' }  `} src={cUser?.photoURL} alt="" 
          onMouseOver={() =>handleMouseOverimage() }
          onMouseOut={handleMouseOutimage}/>
        <input style={{ display: "none" }} type="file" id="file" onChange={handleChangef} />
        <img htmlFor="file" className='imagcha' src={fad} alt="" />
      </label>
      <h3 className="PremiereH1">Mes informations personel</h3>
          {isEditing.Nom ? ( // conditionnellement afficher l'input ou le texte en fonction de l'état d'édition
          <>
          <li 
            className={`list-group-item ${activeItem === 'Nom' ? 'active' : ''}`}
            onMouseOver={() => handleMouseOver('Nom')}
            onMouseOut={handleMouseOut}>
            <h4 >Nom </h4>
            {<> <input placeholder='Nom' className='input form-control'   type="text" 
              value={inputValue.Nom} onChange={handleInputChange} />  </>
            }

            <button className='buttonUn' onClick={() => handleSaveClick('Nom')}>Enregistrer</button>
            </li>
          </>
        ) : (
          <>
            <li placeholder="Nom"
              className={`list-group-item ${activeItem === 'Nom' ? 'active' : ''}`}
              onMouseOver={() => handleMouseOver('Nom')}
              onMouseOut={handleMouseOut}
              >
              <h4 >Nom</h4>
              <h5>{
                inputValue.Nom === "" ? 
                  <>{getUserTable(currentUser?.email)?.LastName}</> 
                  : <>{inputValue.Nom}</>
               }</h5>
              <span onClick={() => handleEditClick('Nom')} className="Modifier">Modifier</span>
            </li>
            </>
        )}
        
      {isEditing.Prenom ? ( // conditionnellement afficher l'input ou le texte en fonction de l'état d'édition
        <>
          <li
            className={`list-group-item ${activeItem === 'Prenom' ? 'active' : ''}`}
            onMouseOver={() => handleMouseOver('Prenom')}
            onMouseOut={handleMouseOut}>
            <h4 >Prenom </h4>
            <input placeholder='Prenom' className='input form-control' type="text" value={inputValue.Prenom} onChange={handleInputChange} />
            <button className='buttonUn' onClick={() => handleSaveClick('Prenom')}>Enregistrer</button>
          </li>
        </>
      ) : (
        <>
          <li placeholder="Prenom"
            className={`list-group-item ${activeItem === 'Prenom' ? 'active' : ''}`}
            onMouseOver={() => handleMouseOver('Prenom')}
            onMouseOut={handleMouseOut}
            >
            <h4 >Prenom </h4>
                <h5>{
                  inputValue.Prenom === "" ?
                    <>{getUserTable(currentUser?.email)?.FirstName}</>
                    : <>{inputValue.Prenom}</>
                }</h5>
              <span onClick={() => handleEditClick('Prenom')} className="Modifier">Modifier</span>
            
          </li>
        </>
      )}
      {isEditing.Email ? ( // conditionnellement afficher l'input ou le texte en fonction de l'état d'édition
        <>
          <li
            className={`list-group-item ${activeItem === 'Email' ? 'active' : ''}`}
            onMouseOver={() => handleMouseOver('Email')}
            onMouseOut={handleMouseOut}>
            <h4 >Email </h4>
            <input placeholder='Email' className='input form-control' type="text" value={inputValue.Email} onChange={handleInputChange} />
            <button className='buttonUn' onClick={() => handleSaveClick('Email')}>Enregistrer</button>
          </li>
        </>
      ) : (
        <>
          <li placeholder="Email"
            className={`list-group-item ${activeItem === 'Email' ? 'active' : ''}`}
            onMouseOver={() => handleMouseOver('Email')}
            onMouseOut={handleMouseOut}
            >
            <h4 >Email</h4>
                <h5>{
                  inputValue.Email === "" ?
                    <>{currentUser?.email}</>
                    : <>{inputValue.Email}</>
                }</h5>
          </li>
        </>
      )}
      
    </div>
    </Container>
        </> 
        : 
        <>{ currentProfil ? <>
          <Container fluid className="mybody" style={{ minHeight: "100vh" }}>
          <Navbar className='lenavarr' >
            <Container fluid  >
              <Navbar.Brand href="/myhome" >
                <LogoSvg className='logo' width="230" height="120" style={{ position: 'relative', left: '10%' }} />
              </Navbar.Brand>

                
                <DropdownButton className='createRoomD ropdown drop' title='My Profil' onSelect={handleSelect} >

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
            <div className="tous">
              <label className='imagelabel' htmlFor="file">
                <img className="imagepr" src={currentProfil?.photoURL} alt=""/>
                <button className='sendbu' onClick={handleClickButton}>Message 💬</button>
              </label>
              {isVisible && (
                <div ref={divRef} className='lechat'><Chathome vers ={currentProfil.id} Object={true} /></div>)}
              

              <h3 className="PremiereH1"> informations personel :</h3>
              <li placeholder="Prenom"
                className={`list-group-item ${activeItem === 'Prenom' ? 'active' : ''}`}>
                <h4 >Prenom </h4>
                <h5>{
                 currentProfil.FirstName
                }</h5>
              </li>
              <li placeholder="Nom"
                className={`list-group-item ${activeItem === 'Nom' ? 'active' : ''}`}>
                <h4 >Nom </h4>
                <h5>{
                  currentProfil.LastName
                }</h5>
              </li>
              </div>
          </Container>
        </> : <></>
      }
    </>} 
  </>);
}
