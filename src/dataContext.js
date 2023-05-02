import React,{useState, createContext, useEffect} from 'react'
import {db, auth} from "./firebase-config"
import {collection, getDocs, doc , addDoc, updateDoc,getDoc, deleteDoc} from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateEmail, getAuth, deleteUser } from 'firebase/auth'

export const DataContext = createContext()

export default function DataContextProvider(props) {

//----------------On recupere les données de la base de donnée ici ---------------------
    const [sports, setSports] = useState()
    const [rooms, setRooms] = useState()
    const [users,setUsers] = useState()

    const sportsRef = collection(db, "Sports")
    const roomsRef = collection(db, "Rooms")
    const usersRef = collection(db, "Users")

      //renvoi la collection "Sports"
      async function getSports () {
          const data = await getDocs(sportsRef) //les données en brut (non manipulable)
          var jeux = data.docs.map(doc => ({...doc.data(),  id: doc.id}))//données manipulables
          setSports(jeux) //on met le state à ces données
      }

      //renvoi la collection "Rooms"
      async function getRooms () {
          const data = await getDocs(roomsRef) //les données en brut (non manipulable)
          var roomsData = data.docs.map(doc => ({...doc.data(),  id: doc.id}))//données manipulables
          setRooms(roomsData) //on met le state à ces données
  
      }

      //renvoi la collections "Users"
      async function getUsers () {
          const data = await getDocs(usersRef) //les données en brut (non manipulable)
          var UsersData = data.docs.map(doc =>({...doc.data(),  id: doc.id}))//données manipulables
          setUsers(UsersData) //on met le state à ces données
      
      }
  //fonction pour recuperer la photourl  
  async function getphotoURL() {
    const { id } = auth.currentUser;
    const docRef = doc(db, "Users", id)
    const docSnap = await getDoc(docRef)
    const data =  docSnap.data() 
   return data.photoURL
  }
    
  useEffect( () => {    
            getSports()
            getRooms()
            getUsers()
            getphotoURL()
      },[])
      //Données sur l'utilisateur courrant et des fonctions lié a l'authentification
      const [currentUser, setCurrentUser] = useState();
      const [loadingData, setLoadingData] = useState(true);
        
      //fonctions de login et register
      const signup = (email,password) => createUserWithEmailAndPassword(auth, email, password)
      const signin = (email,password) => signInWithEmailAndPassword(auth, email, password)
        
      //stock l'utilisateur courrant dans currentUser
      useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, (curUser) => {
              setCurrentUser(curUser)
              setLoadingData(false)
          })
          return unsubscribe
      },[])

      const droom = rooms?.map( room => room.id )
      
      async function fetchRooms() {
        const roomsData = await getRooms();
        setRooms(roomsData);
      }
      useEffect(() => {
        fetchRooms();
      }, []);
    
      useEffect(() => {
        deleteOuPas();
      }, [droom, rooms]);
    
      

    //Ajout de données dans la base de données
      async function addDocument(col, data){
        await  addDoc(collection(db, col),data)
      }
      
      async function addDocument2(col, data) {
        const docRef = await addDoc(collection(db, col), data);
        return docRef;
      }

      //fonction pour mettre à jour un document
       async function updateDocument(collection, id, data){
        const ref = doc(db, collection, id)
        await updateDoc(ref, data)
      }
      
      //fonction pour supprimer les documents
      async function deleteDocument(collection, id){
        const ref = doc(db, collection, id)
        await deleteDoc(ref)
      }
      
      async function removeUser() {
        try {
    
          await deleteUser(auth.currentUser);
    
        } catch (error) {
          alert("Can't delete your account, please try again later")
        }
      }
      
      function deleteOuPas(){
        if (droom && rooms) {
          for (let i = 0; i < droom.length; i++) {
            const item = droom?.[i];
            const salle = rooms?.[i];
            const maDate = new Date();
            const secondes = Math.floor(maDate.getTime() / 1000);
            const secondes2 = salle?.Date2?.seconds;
            if (secondes2 <= secondes || salle?.Participants.length === 0) {
              deleteDocument("Rooms", item)
            }
          }
        }
      }

      //fonction pour recuperer le room grace a l'id 
      async function getbyid(id) {
        const docRef = doc(db, "Rooms", id)
        const docSnap = await getDoc(docRef)
        const data = docSnap.exists() ? docSnap.data() : null
        if (data === null || data === undefined) return null
        return { id, ...data }
      }

  

  //fonction pour recuperer le room grace a l'id 
  async function getUserbyid(id) {
    const docRef = doc(db, "Users", id)
    const docSnap = await getDoc(docRef)
    const data = docSnap.exists() ? docSnap.data() : null
    if (data === null || data === undefined) return null
    return { id, ...data }
  }
    // fonction pour modifier l'email 
  const updateEmailInFirebaseAuth = (currentUser, newEmail) => {
    const auth = getAuth();
    updateEmail(auth.currentUser, newEmail)
  }



      // renvoi les données associées à une email
      // If the 'users' array is defined, the function will map thrugh the array to find the user that matches the email passed in as a param.
      // Once the matching user is found, the function will return that user's information in the form of an object
      
  function getUserTable(email){
    if(users === undefined) return 
    let res
    users.map(user =>{
      if(user.Email === email){
        res = user}
      })
    return res
  }
 
      return (
        //On envoi les data de la base de données à toute notre App pour que l'onglet qui en a besoin les recupere. Evite des appels multiples à la bd */}
        <DataContext.Provider value={{ droom, sports, rooms, users, currentUser, signup, signin, addDocument, addDocument2, updateDocument, getUserTable, getbyid, getRooms, getphotoURL, deleteDocument,removeUser, deleteOuPas, updateEmailInFirebaseAuth, getUserbyid, addDocument2 }}>
          {!loadingData && props.children}
        </DataContext.Provider>
  )
}
