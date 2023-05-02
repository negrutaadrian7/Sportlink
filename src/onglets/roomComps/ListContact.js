import React, { useContext, useEffect, useState, useRef } from 'react'
import { ListGroup } from 'react-bootstrap'
import { DataContext } from '../../dataContext'
import './Contacts.css';
import Chathome from '../roomPage/Components/Chathome';


function ListContacts({ Object }) {
    const { getUserbyid } = useContext(DataContext)
    const [isVisible, setIsVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const divRef = useRef(null);

    useEffect(() => {
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
    
    const handleClickButton = (user) => {
        setSelectedUser(user);
        setIsVisible(!isVisible);
    };
    
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const userPromises = Object.map(contcat => getUserbyid(contcat));
            const users = await Promise.all(userPromises);
            setUserList(users);
        };
        fetchUsers();
    }, [Object]);
    
    return (
        <ListGroup>
            <ul>
                {userList.map(user => (
                    <>
                        <li className=" lipersoo" key={user.id} onClick={() => { handleClickButton(user.id)}}>
                        <img className="imagepersaloo" src={user.photoURL} alt="" />
                        <h5 className='h5listt' >{user.LastName} {user.FirstName}</h5>
                    </li>
                    <>
                            {isVisible && selectedUser && (
                                <div style={{
                                    position: 'absolute',
                                    top: 200,
                                    left: 900,
                                    padding: '10px',
                                    zIndex: 1
                                }} ref={divRef} className='lechatt'><Chathome vers={selectedUser} Object={true} /></div>)}
                    </>
                    </>
                ))}
            </ul>
        </ListGroup>
    )
}

export default React.memo(ListContacts)
