import React, { useEffect, useState, useContext } from 'react'
import RoomCard from './RoomCard'
import LeftBar from './LeftBar'
import { Container, Col, Row } from 'react-bootstrap'
import RoomNavbar from './RoomNavbar'
import { useLocation} from 'react-router-dom'
import { DataContext } from '../../dataContext'
import './App.css';
export default function App() {

    const location = useLocation()

    const { sports, rooms, getUserTable, currentUser,setRooms,getRooms } = useContext(DataContext)
    const data = rooms
    function isJoined(id) {
        if (!currentUser) return false
        else {
            let userData = getUserTable(currentUser.email)
            if (userData) {
                return userData.Rooms.includes(id)
            }
            else {
                return false
            }
        }
    }
    //----Creation du State sa fonction pour la barre de recherche )----
    // on doit creer les states ici et les envoyer en props car c'est App.js qui gere l'affichage des "room cards"
    const [searchInput, setSearchInput] = useState("")

    function searchHandle(e) {
        var lowerCase = e.target.value.toLowerCase();
        setSearchInput(lowerCase);
    }

    //----Creation des differents States et leur fonctions pour les filtres---------
    const [dateFilter, setDateFilter] = useState("Date")
    const [platformFilter, setPlatformFilter] = useState("Sports")
    const [formatFilter, setFormatFilter] = useState("Format")
    const [sportFilter, setSportFilter] = useState("Any")
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => location.state !== null && setSportFilter(location.state.filter), [location.state]) //on applique le filtre donné par l'onglet "Sport" d'un jeu (si il existe)

    useEffect(() => {
        const sportFilters = document.querySelectorAll(".sport-filter")
        //ajoute un style bordure blanche au filtre sport actif
        sportFilters.forEach(filter => (filter.alt === sportFilter) ? filter.classList.add("sport-filter-active") : filter.className = 'me-2 my-3 sport-filter')

    }, [sportFilter, sports])

    async function fetchRooms() {
        const roomsData = await getRooms();
        setRooms(roomsData);
    }

    // Utilisation de useEffect pour récupérer les données au chargement de la page
    useEffect(() => {
        fetchRooms();
    }, []);
    //fonctions qui s'occupent de changer les States des filtres
    function dateClickHandler(e) {
        setDateFilter(e.target.innerText)
    }
    function platformClickHandler(e) {
        setPlatformFilter(e.target.innerText)
    }
    function formatClickHandler(e) {
        setFormatFilter(e.target.innerText)
    }




    function sportClickHandler(e) {
        if (e.target.alt === sportFilter) { //si la cible est le filtre courrant, alors on le desactive ( en le mettant sur "Any")
            setSportFilter("Any")
            e.target.classList.remove("sport-filter-active")
        }
        else {
            setSportFilter(e.target.alt)

        }
    }
    //fonction pour transformer seconde en objet Date javascript
    function toDateTime(secs) {
        var t = new Date(1970, 0, 1);
        t.setSeconds(secs.seconds);
        return t;
    }

    //fonction de stackoverflow pour tester si une date est ajourd'hui
    function isToday(someDate) {
        const today = new Date()
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
    }
    function getMonday() {
        var d = new Date();
        var day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    getMonday(new Date());

    //fonction de stackoverflow pour tester si une date est dans la semaine
    function isThisWeek(date) {

        // get first date of week
        const firstDayOfWeek = getMonday(date.getDay())
        // get last date of week
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

        // if date is equal or within the first and last dates of the week
        return date >= firstDayOfWeek && date <= lastDayOfWeek;
    }


    //1 on regarde d'abord si l'utilisateur recherche avec la barre de recherche
    const filteredData = data?.filter((el) => {
        if (searchInput === '') {
            return el
        }
        else {
            return el.Title.toLowerCase().includes(searchInput)
        }
    })

    //2 on regarde ensuite le filtre date
    const dateFilteredData = filteredData?.filter(el => {
        if (dateFilter === 'Date') { //si pas de filtre on renvoi tout les rooms
            return el
        }
        if (dateFilter) { //si il y a un filtre
            if (dateFilter === "Today") { //si filtre à "today", on renvoi rooms prevu aujourd'hui     
                return isToday(toDateTime(el.Date))
            }
            else { //sinon on renvoi les rooms prevu cette semaine
                return isThisWeek(toDateTime(el.Date))
            }
        }
    })


    //3 on regarde ensuite le filtre format
    const regionFilteredData = dateFilteredData?.filter(el => {

        if (selectedRegion === '') { //si pas de filtre on renvoi tout les rooms
            return el
        }
        else {
            if (el.Localisation?.Region?.includes(selectedRegion) === undefined || !el.Localisation?.Region?.includes(selectedRegion)) {
                return false;
            }
            else {
                return true
            } //si il y a un filtre, on renvoi les rooms filtrés
        }

    })

    function regionClickHandler(e) {
        setSelectedRegion(e)
    }
    function cityClickHandler(e) {
        setSelectedCity(e)
    }

    
    //4 on regarde finalement le filtre platform
    const cityFilteredData = regionFilteredData?.filter(el => {
        if (selectedCity === '') {  //si pas de filtre on renvoi tout les rooms
            return el
        }
        else {
            if (el.Localisation?.City?.includes(selectedCity) === undefined || !el.Localisation?.City?.includes(selectedCity)) {
                return false;
            }
            else {
                return true
            }
        }
    })

    //5 enfin le filtre des jeux, on obtient alors  une liste des rooms entierement filtrés
    const fullFilteredData = cityFilteredData?.filter(el => {
        console.log(platformFilter)
        console.log(el)
        if (platformFilter === "Sports") {  //si pas de filtre on renvoi tout les rooms
            return el
        }
        else {
            return el.Sport.includes(platformFilter) //si il y a un filtre, on renvoi les rooms filtrés
        }
    })

    return (
        <Container fluid className='room'>
            <Row  >
                <RoomNavbar search={searchInput} onSearchChange={searchHandle} />

            </Row>

            <Row className="room-parentrow" style={{ position: "relative" }}>

                <Col lg={3}  >
                    <LeftBar date={dateFilter} platform={platformFilter} format={formatFilter} dateHandler={dateClickHandler} platformHandler={platformClickHandler} formatHandler={formatClickHandler} sportHandler={sportClickHandler} cityHandler={cityClickHandler} regionHandler={regionClickHandler} />
                </Col>

                <Col className="order-1 order-lg-0 ms-4 " >

                    <Container>

                        <Row>
                            <Container className="d-flex  mb-4" style={{ position: "relative", minHeight: "120px", overflow: "visible", borderRadius: "25px"}}>
                                <h3 className="my-4 my-h3" style={{ margin: 'auto', textAlign: "center", color: 'white', width: "45%"}}> Plusieurs salons vous attendent ! </h3>
                            </Container>
                            {/*Affichage des rooms entierement filtrés, si aucun resultat, affiche un petit message d'excuse */}
                            {fullFilteredData?.length === 0 && <p style={{ color: "gray" }}> Vous ne trouvez pas de chambre qui vous convienne? Creez la votre facilement !</p>}
                            {sports && rooms && (fullFilteredData?.map(room =>
                                <Col key={room.Title}>
                                        <RoomCard isJoined={isJoined(room.id)} el={room} />
                                </Col>))}
                        </Row>

                    </Container>

                </Col>

            </Row>
        </Container>

    )
}
