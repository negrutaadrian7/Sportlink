import React, { useState, useContext, useEffect } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";
import './Salon.css'
import { DataContext } from '../../../dataContext'
import { arrayUnion, arrayRemove} from "firebase/firestore";
import { Col, Row, Button, Stack, Tabs, Tab } from 'react-bootstrap'
import ListParticipants from './ListParticipants'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Chathome from './Chathome';


export default function Main() {
  const navigate = useNavigate();
  const [currentSalon, setCurrentSalon] = useState()
  const { updateDocument, getbyid, currentUser, setCurrentUser, getUserTable } = useContext(DataContext)

  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id")
  useEffect(() => {
    getbyid(id).then(res => setCurrentSalon(res))
  }, [])


  const nameSalon = currentSalon?.Title
  const MaxPlayer = currentSalon?.MaxPlayer
  const Localisation = currentSalon?.Localisation
  const Organizer = currentSalon?.Organiser
  const PlayerCreator = currentSalon?.PlayerCreator
  const Sport = currentSalon?.Sport
  const Participants = currentSalon?.Participants
  const Contact = currentSalon?.OrganiserContact
  const showContent = currentSalon?.Participants?.includes(currentUser?.email);


  function update(id) {
    getbyid(id).then(res => setCurrentSalon(res))
  }

  

  function CheckJoin(participants, user) { 
    return participants.includes(user);
  }

  const handleclickOpen = async (user) => {

    if (CheckJoin(currentSalon.Participants, user)){
      return alert("Already in this room!");
    }
    var s = getUserTable(user); // all the informations about the user
    if (currentUser) {
      try {

        await updateDocument('Rooms', id, { Participants: arrayUnion(user) });
        setCurrentSalon(prevState => ({
          ...prevState,
          Participants: [...prevState.Participants, user]

        }));

        await updateDocument('Users', s.id, { Rooms: arrayUnion(id)}); 
        setCurrentUser(prevState => ({
          ...prevState,
          Rooms: [...prevState.Rooms, id]
        }));

      } catch (error) {
        console.log(error)
      }
    }
    else {
      navigate("/login")
    }
  }



  const leaveSalon =  async (user) => {
    const x = CheckJoin(currentSalon.Participants, user);
    var s = getUserTable(user); // all the information about the user
    if (x) {
      try {

        await updateDocument('Rooms', id, { Participants: arrayRemove(user) });
        setCurrentSalon(prevState => {
          const updatedParticipants = prevState.Participants.filter(p => p !== user);
          return { ...prevState, Participants: updatedParticipants };
        });

        await updateDocument('Users', s.id, {Rooms: arrayRemove(id)});
        setCurrentUser(prevState => {
          const updatedUser = prevState.Rooms.filter(p => p !== id);
          return {...prevState, Rooms: updatedUser} ;
        }) // update the collection Users for the s.id user for the field Rooms in this collection
      }
      catch (error) { }
    }

    else {
      alert("You're not in this room");
    }
  }; 

  

  function printButton(user, Organiser) {
    if (CheckJoin(Participants, user)) {
      return <div>
        <Button className='leave-button' onClick={() => {leaveSalon(user) }}> Leave </Button>
      </div>;
    }
    return (
      <div><Button className='join-button' onClick={() => { handleclickOpen(user);  }}> Join room </Button></div>)
    }
    
    return (
    <>
      {currentSalon &&
        <>
          <Col>
            <Row >
              <Row> <center><h1 className='mt-5 title-salon'>{nameSalon}</h1></center> </Row>

              <Col>
                {currentSalon && printButton(currentUser?.email, Organizer)}
              </Col>
            </Row>
            <Row>
              <Col>
                <Stack className='mb-3' direction="horizontal" gap={3}>
                </Stack>
              </Col>
            </Row >
          </Col>

          <h4 className='my-5'>Room Info</h4>

          <Tabs
            defaultActiveKey="Localisation"
            transition={false}
            id="noanim-tab-example"
            className="mb-3"
          >
            <Tab eventKey="Localisation" title="Localisation">
              {Localisation.Region !== undefined ? <>
                <h4>Région : {Localisation.Region}</h4>
                <h4>Ville : {Localisation.City} </h4> </> : <h4>{Localisation}</h4>}
            </Tab>

            <Tab eventKey="MaxPlayer" title="MaxPlayer">
              <h4> <ReactMarkdown children={MaxPlayer} remarkPlugins={[remarkGfm]} /> </h4>
            </Tab>

            <Tab eventKey="Sport" title="Sport">
              <h4> <ReactMarkdown children={Sport} remarkPlugins={[remarkGfm]} /> </h4>
            </Tab>

            <Tab eventKey="PlayerCreator" title="PlayerCreator" >
            { <li className=" liperso">
                <img onClick={() => { navigate(`/info?id=${getUserTable(PlayerCreator)?.id}`) }}
              className="imagepersalo" src={getUserTable(PlayerCreator)?.photoURL} alt="" />
              <h5 onClick={() => { navigate(`/info?id=${getUserTable(PlayerCreator)?.id}`) }} className='h5list' > {<><>{getUserTable(PlayerCreator)?.LastName}</><> </><>{getUserTable(PlayerCreator)?.FirstName}</></>}</h5>
            </li>}
            </Tab>

            <Tab eventKey="Contact" title="Contact">
              <h4> <ReactMarkdown children={Contact} remarkPlugins={[remarkGfm]} /> </h4>
            </Tab>

            
            <Tab eventKey="Participants" title="Participants">
               <ListParticipants Object={Participants} isOragniser={currentUser?.email === Organizer} leaveSalon={leaveSalon} />
            </Tab>

            {showContent ?
            <Tab eventKey="chat" title="Chat" >
              <Chathome Object={false} vers={"persone"}/>
            </Tab> : <></>
            }
            <center>
              <progress max="100" value="70"> 70% </progress>
            </center>
          </Tabs>
        </>}
    </>
  )
}
