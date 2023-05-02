import  React,{ useContext } from 'react'
import { ListGroup} from 'react-bootstrap'
import './participants.css';
import { DataContext } from '../../../dataContext'
import { useNavigate } from 'react-router-dom';


function ListParticipants({Object,isOragniser,leaveSalon}) {
  const { getUserTable, currentUser } = useContext(DataContext)
  const navigate = useNavigate()
  function Kick(value){
    leaveSalon(value)
  }
  
  return (
    <ListGroup>
      {Object?.map(participant => isOragniser ? 
          <li className=" liperso">
          <img onClick={() => { navigate(`/info?id=${getUserTable(participant)?.id}`) }} 
          className="imagepersalo" src={getUserTable(participant)?.photoURL} alt="" />
          <h5 onClick={() => { navigate(`/info?id=${getUserTable(participant)?.id}`) }} className='h5list' > {<><>{getUserTable(participant)?.LastName}</><> </><>{getUserTable(participant)?.FirstName}</></>}</h5>
          {participant === currentUser?.email ?  <></> :
          <button className='buttonlist' key={participant} value={participant} onClick={()=>Kick(participant)}>Kick</button>} 
         </li> 
      
      : 
        <li className=" liperso">
          <img onClick={() => { navigate(`/info?id=${getUserTable(participant)?.id}`) }}
           className="imagepersalo" src={getUserTable(participant)?.photoURL} alt="" />
          <h5 onClick={() => { navigate(`/info?id=${getUserTable(participant)?.id}`) }} className='h5list' > {<> <>{getUserTable(participant)?.LastName}</><> </><>{getUserTable(participant)?.FirstName}</></>}</h5>
        </li>
      )
      }
    </ListGroup>
  )
}

export default React.memo(ListParticipants)
