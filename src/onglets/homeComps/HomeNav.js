import React from 'react'
import {Navbar, Nav, Container, Button} from 'react-bootstrap'
import { ReactComponent as LogoSvg } from './utils/logo.svg';
import { Link } from 'react-router-dom';

export default function HomeNav(){
    return (
        <>
            <Navbar variant = 'dark' expand='lg'>
                <Container fluid className = 'ms-0 me-5'>
                    <Navbar.Brand href='#home'>
                        <LogoSvg className = 'd-inline-block align-top' width='230' height='120' style = {{position: 'relative', left : '10%'}} />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls = 'basic-navbar-nav' />
                    <Navbar.Collapse id = 'basic-navbar-nav'>
                        <Nav style = {{marginLeft : '70%'}}>
                            <Nav.Item className='me-5'>
                                <Link to = '/login'>
                                    <Button className = 'm-2 text-white home-login'> LOGIN</Button>
                                </Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Link to = '/signup'>
                                    <Button className = 'm-2 text-white home-login'> SIGN UP </Button>
                                </Link>
                            </Nav.Item>

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
