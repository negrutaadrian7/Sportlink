import { React, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import  {signOut} from 'firebase/auth'
import  {auth} from '../../firebase-config';
import { DataContext } from "../../dataContext"
import { Button, Navbar, Container, Nav, DropdownButton, Dropdown } from 'react-bootstrap'
import { ReactComponent as LogoSvg } from '../homeComps/utils/logo.svg';
import "./RoomStyle.css";


export default function RoomNavbar(props) {
  const {currentUser} = useContext(DataContext)
    const search = props.search
    
    const navigate = useNavigate();

    function searchHandle (e){
        props.onSearchChange(e)
    }

  async function handleSelect(e) {
    let event = e 
    switch (event) { 
      case "MesInfo":
        navigate(`/info?id=${currentUser.uid}`)
        break
      case "Logout":
          await signOut(auth)
          navigate ("/login")
        break

      default:
        break
  }
}

  return (
    <Navbar  expand="lg" className=" mb-5" variant="dark" style = {{backgroundColor: 'black'}}>
      <Container fluid className='mx-0'>
      <Navbar.Brand> 
        <Link to="/home">
          <LogoSvg  width="195" height="89"  style={{filter: " brightness(100%) ", position: 'relative', left : '10px'}}/>
        </Link>
      </Navbar.Brand>
    
      <Navbar.Toggle aria-controls="navbarScroll" />
      
      <Navbar.Collapse id="navbarScroll" >
        <Nav style={{display : 'flex', justifyContent : 'center', width : '60%'}} >
            <input value={search} onChange={searchHandle} className='m-2' id="recherche" type="search" placeholder='Search'  />
        </Nav>
      
         <Nav className='ms-auto'>
          <Link to="/createroom">
            <Button className ="room-create-btn" variant="outline-light"> Create a Room </Button>
          </Link>
            <DropdownButton className='createRoomDropdown' title='My Profil' onSelect={handleSelect} >
              <Dropdown.Item eventKey="MesInfo">
                My Profil
              </Dropdown.Item>
              <Dropdown.Item eventKey="Logout">
                Logout 
              </Dropdown.Item>
              
            </DropdownButton>
         
        </Nav>
        
      </Navbar.Collapse>
      </Container>
    </Navbar>
  ) }
   
