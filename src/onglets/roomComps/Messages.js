import React, { useContext} from 'react'
import LeftBar from './LeftBar'
import { Container, Col, Row, Tab, Tabs } from 'react-bootstrap'
import RoomNavbar from './RoomNavbar'
import { DataContext } from '../../dataContext'
import ListContact from './ListContact'
export default function Messages() {
    const { getUserTable,currentUser } = useContext(DataContext)
    const Contacts = getUserTable(currentUser?.email)?.Contacts
    return (
        <Container fluid className='roo'>
            <Row>
                <RoomNavbar/>
            </Row>
            <Row>
                <Col  lg={3} >
                    <LeftBar />
                </Col>
                <Col >
                    <Tabs>
                        <Tab eventKey="Contacts" title="Contacts">
                            <ListContact Object={Contacts} />
                        </Tab>
                    </Tabs>
                  </Col>
            </Row>
           
          
        </Container>






    )

}