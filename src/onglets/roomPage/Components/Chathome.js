import React, { useState, useRef, useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import "./stylechat.css" ;
import {auth , db} from "../../../firebase-config" 
import 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, addDoc, orderBy, query, arrayUnion } from "firebase/firestore";
import { DataContext } from "../../../dataContext"


export default function Chathome({ Object, vers })   {
    const navigate = useNavigate()
    const { currentUser, getUserTable,  updateDocument } = useContext(DataContext)
    const [searchParams, setSearchParams] = useSearchParams();
    const currentSalon = searchParams.get("id");
    
    function CheckJoin(contacts, user) {
        return contacts.includes(user);
    }
  
    function ChatMessage(props) {
        const { text, uid, photoURL ,Rommes,Pour,Vers } = props.message;
        const messageClass = uid === currentUser.uid ? 'sent' : 'received';
        
        if (Pour ===true  && (uid === currentUser.uid || uid===vers )&&(Vers ===vers ||Vers ===currentUser.uid )) 
            return (<>
                <div className={`message ${messageClass}`}>

                    <img onClick={() => { navigate(`/info?id=${uid}`) }}
                        className='im' src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="photo1"/>
                    <p className='pa'>{text}</p>
                </div>
            </>) 
        
        else if (Pour ===false && Rommes ===currentSalon)
            return (<>
            <div className={`message ${messageClass}`}>

                    <img onClick={() => { navigate(`/info?id=${uid}`) }} 
                 className='im' src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="photo1"/>
                <p className='pa'>{text}</p>
            </div>
            </>) 
        else return (<> <div></div>  </>)
    }

    function ChatRoom() {
            
        const dummy = useRef();
        const [formValue, setFormValue] = useState('');        
        const messagesRef = collection(db, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt'));
        const [messages] = useCollectionData(messagesQuery, { idField: 'id' });
            
        const sendMessage = async (e) => {
            e.preventDefault();
            const { uid } = auth.currentUser;
            const photoURL = getUserTable(currentUser?.email)?.photoURL ;
            await addDoc(collection(db, "messages"), {
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL,
                Rommes :currentSalon,
                Pour :Object,
                Vers :vers
            });  
            setFormValue('');
            dummy.current.scrollIntoView({ behavior: 'smooth' }); 
            
            if (!CheckJoin(currentUser.uid)) 
            {await updateDocument('Users', vers, { Contacts: arrayUnion(currentUser.uid) });}
            if (!CheckJoin(vers)) 
            { await updateDocument('Users', currentUser.uid, { Contacts: arrayUnion(vers) }); }      
              
        } 
        
        return (<>
            <main className='gl chat'>
        
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}></span>

            </main>

            <form className='fo' onSubmit={sendMessage} >

                <input className='in' value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Ecrivez votre message ici" />

                <button className='bu' type="submit" disabled={!formValue}>🕊️</button>

            </form>
        </>)
    } // fin du function ChatRoom()
     
  
    return (
        <>

        <Container>
            <div>
            </div>
            <div className="chat">
                <header>
                    <h1>💬</h1>
                </header>
                <section>
                    <ChatRoom />
                </section>

            </div>
            
            </Container>  
        </>   
    );
};


