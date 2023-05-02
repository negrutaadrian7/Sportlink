import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './cssfiles/section1.css'

export default function Section1() {
    return (
        <>
            <div id = 'rectangle1'></div>
            <div id = 'rectangle2'></div>
            <Container fluid className = 'home-mainContainer'>
                <Row className = 'home-playerimg' >
                    <Col md = {12} style = {{paddingTop : '8%'}}>
                        <div className='home-container1'>
                            <h1 className='text-white custom-h1'> Rejoignez-nous dès maintenant et créer votre propre salon </h1>
                            <Row className = 'col-8 home-buttonsmain' >
                                <Col> 
                                    <Link to = "/login">
                                        <Button className = "home-play"> Rejoindre un salon </Button>
                                    </Link>
                                </Col>

                                <Col>
                                    <Link to = "/createroom">
                                        <Button className = 'home-create'> Creer un salon </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </> 
    )
}
