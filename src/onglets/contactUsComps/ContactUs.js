import { useState, useEffect } from 'react';
import { Form, Container, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoSvg } from '../homeComps/utils/SportLinklogo.svg';
import emailjs from '@emailjs/browser';
export default function ContactUs() {
  const [formMail, setFormMail] = useState('');
  const [formIssue, setFormIssue] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [sendStatus, setSendStatus] = useState(false);
  const [sendError, setSendError] = useState('');

  // fonction qui regarde si l'adresse mail est valide
  function validateEmail(email) {
    return String(email).toLowerCase().match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  }

  // Sans ceci, lorsque l'utilisateur appuie sur la touche "entrer", html envoi le formulaire et donc rafraîchit la page (on ne veut pas ce comportement).
  useEffect(() => {
    var area = document.getElementById('area');

    document.getElementById('doesntSubmit').addEventListener('keydown', function (e) {
      if (e.key === 'enter' && e.target !== area) {
        e.preventDefault();
      }
    });
  }, []);

  function sendEmail() {
    emailjs.send('service_922dvlb', 'template_yeuh708', {
      issue: formIssue,
      mail: formMail,
      description: formDescription,
    }, 'PPdVIFB4CxZ5CHVEB').then((response) => {
      console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
      console.log('FAILED...', error);
      setSendError(error);
    });
  }

  // pour recuperer l'email du formulaire
  function handleMail(e) {
    setFormMail(e.target.value);
  }

  // Pour recuperer le probleme du formulaire
  function handleIssue(e) {
    let ev = e.target;
    setFormIssue(ev.options[ev.selectedIndex].text);
  }

  // pour recuperer la description du probleme du formulaire
  function handleDescription(e) {
    setFormDescription(e.target.value);
  }

  // reinitialise les champs du formulaire
  function resetForm() {
    setSendStatus(true);
    setSendError('');
    setFormDescription('');
    setFormMail('');
    setFormIssue('');
    document.querySelector('#select').selectedIndex = 0;
  }

  // Lorsque l'utilisateur clique sur le button "send"
  function handleClick() {
    if (!validateEmail(formMail)) {
      // si email invalide
      setSendError('Please enter valid email');
      return;
    }
    // si tout les champs sont remplis, on envoi le mail et on reinitialise les champs
    if (formMail !== '' && (formIssue !== '' && formIssue !== '---Select your issue---') && formDescription !== '') {
      try {
        sendEmail();
        resetForm();
      } catch (error) {
        // si erreur, on l'affiche
        setSendError(error);
      }
    } else {
      // si tout les champs ne sont pas remplis, on affiche un message d'erreur
      setSendStatus(false);
      setSendError('All fields are required');
    }
  }

 
return (
  <Container fluid style={{backgroundColor : "#19191B", height : "100%", minHeight : "100vh"}}>
    <div style={{textAlign : "start", display :"flex", justifyContent : "space-between", alignItems : "center"}}>
      <Link to="/home">
        <LogoSvg style={{width : "max(20%, 300px)"}}/>
      </Link>
      <div className='text-white'>
        <Link to="/home">
          <Button className='m-2' variant = "outline-light" >
            Home
          </Button>
        </Link>
      </div>
    </div>
    <div style={{display : "flex", justifyContent : "center", gap : "5px", flexDirection  : "column"}}>
      <h1 style={{textAlign : "center", color : "white"}}>Contact Us</h1>
      <Container fluid style={{ display : "flex", justifyContent : "center"}}>
        <Form  style={{color : "white"}} id="doesntSubmit">
          <Row className="mb-3 justify-content-center" style={{maxWidth : "500px"}}>
            <Row className="justify-content-center" xs = "2" style={{width : "80%"}}></Row>
            <Form.Group >
              <Form.Label >
                Email
              </Form.Label>
              <Form.Control className='mb-3 text-white'onChange={handleMail}requiredtype="email"value={formMail}placeholder="Email"/>
            </Form.Group>
            <label  className="mb-2" htmlFor="select">Issue</label>
            <Form.Select onChange={handleIssue} className="mb-3" id="select" style={{background : "transparent",color : "orange", borderRadius : "40px", width : "95%", border : "2px solid rgb(84, 84, 212)"}}>
              <option style={{background : "transparent"}}>---Select your issue---</option>
              <option >Sport Suggestion</option>
              <option >Disagreement</option>
              <option >Other</option>
            </Form.Select>
            <Form.Group>
              <Form.Label>
                Description
              </Form.Label>
              <Form.Control  value={formDescription}id="area"className = "text-white mb-3"as="textarea" rows={3}placeholder = "Describe your problem here..."requiredvalue={formDescription}onChange={handleDescription} />
            </Form.Group>
          </Row>
          <Row className="justify-content-center" xs = "5">
            <Button onClick={handleClick}>
              Send !
            </Button>
          </Row>
          {sendError && 
          <p style={{color:"red", textAlign : "center"}}>
            {sendError} 
          </p>
          }{sendStatus && 
          <p style={{color:"green", textAlign : "center"}}>
            Email sended our teams will read it soon ! 
          </p>
          }
        </Form>
      </Container>
    </div>
  </Container>
  )
}
