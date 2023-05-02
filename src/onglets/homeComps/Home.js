import React, { useContext, useEffect } from 'react'
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css";
import { DataContext } from '../../dataContext'
import { useNavigate} from 'react-router-dom'
export default function Home() {
  const { currentUser } = useContext(DataContext)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (currentUser) {
      navigate("/myhome")
    }
  }, [])
  return (
      <App   />
  )
}
