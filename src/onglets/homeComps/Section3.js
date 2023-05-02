import React from 'react'
import {Navbar, Nav, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import "./cssfiles/section3.css";


export default function Section3(){
    
    return (
        <>
            <Navbar className = 'me-4 home-navContact1'> 
                <h2 className='text-reach py-3 pt-5 text-white'> Signaler un problème </h2>
            </Navbar>

            <Navbar className = 'home-navContact2'>
                <Link to = "/contactus">
                    <Button className = 'me-6 home-contact-button'> Contactez-nous </Button>
                </Link>
            </Navbar>

            <Navbar className = 'footer' >
                <Nav className = 'justify-content-center terms-policy'>
                    <Nav.Item className = 'm-2 text-white'> Privacy Policy </Nav.Item>
                    <Nav.Item className = 'm-2 text-white'> Terms and Conditions</Nav.Item>
                </Nav>
            </Navbar>

            <Navbar>
                <Nav className = 'copyrights'>
                    <Nav.Item className = 'me-2 '> © 2023 SportLink </Nav.Item>
                </Nav>
            </Navbar>
        </>
    )
}
