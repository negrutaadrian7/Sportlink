import React from 'react'
import { ReactComponent as LogoSvg } from '../../homeComps/utils/SportLinklogo.svg'
import {Link} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useContext } from 'react'
import { DataContext } from '../../../dataContext'

export default function Nav() {
  return (
    <div style={{textAlign : "start",display :"flex", justifyContent : "space-between", alignItems : "center", backgroundColor:"black"}}>
        <Link to="/home">
            <LogoSvg style={{width : "max(20%, 230px)"}}/>
        </Link>
        <Link className='me-3' to="/myhome">
            <Button variant = "outline-primary">Home</Button>
        </Link>

    </div>    
)
}