import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Button, Card, Badge} from 'react-bootstrap'
import './roomcard.css'
import { Link } from 'react-router-dom'
// les cartes qui seront afficher dans les pages MyHome avec les informations telles que: Nom room, date et les participants 

export default function RoomCard(props) {
    //fonction qui verifie quelle image doit on donner pour la plateforme du room 
    //fonction pour transformer secondes en objet Date javascript puis renvoyer en chaine de caractere le mois jour année et heure de la date
    
    function toDateTime(secs) {
        var t = new Date(1970, 0, 1, 2)
        t.setSeconds(secs)
        console.log(t);
        return t.toString().slice(4,21)
    }

    
    return (

        <Card  className="rooms-card mb-5 text-dark" text = "white" style={{ width: '20rem', border: 'none', boxShadow : '0px 1px 3px 1px rgba(255,255,255,0.22)', borderRadius: '25px', overflow: 'hidden'}}>

            <Card.Body>
                <Card.Title style={{color: 'black'}}> {props.el.Title} </Card.Title>
                <Card.Subtitle className="mb-2 text">Date de début: {toDateTime(props.el.Date.seconds)} </Card.Subtitle>  

                <Card.Footer>
                    <div className = "d-flex justify-content-between align-items-center ">
                        <div style={{marginLeft : '-1rem'}}>
                            {props.el.Participants.length} <small className="text"> Participants </small>
                        </div>
                    
                    { props.isJoined ? 
                        <div className='d-flex align-items-center'>
                         
                            <Button className='button-browse' style={{borderRadius: '10px'}}>
                                <Link className='link-browse' to={`/roomPage?id=${props.el.id}`}> Browse </Link>
                            </Button>
                            <Badge className='badge-joined' style={{ lineHeight: '1', borderRadius : '10px', border: 'none'}} > <span className="me-2"> &#10003; </span> Joined </Badge>
                        </div>
                        
                        :  
                        
                        <Link className='link-join' to={`/roomPage?id=${props.el.id}`}>
                            <Button className='button-join' style={{ borderRadius : '10px',   padding: '0.5rem 1rem', border: 'none'}}> Join </Button> 
                        </Link> 
                    }
                    </div>
                </Card.Footer>
            </Card.Body>
        
        </Card>
    )
}
