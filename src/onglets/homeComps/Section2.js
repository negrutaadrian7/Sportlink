import React, {useState} from 'react'
import { Card } from 'react-bootstrap'
import "./cssfiles/section2.css";

export default function Section2(){
    // toutes les images de carousel stocke dans une liste des objets
    const images = [ 
        { alt: 'carousel1', src: require('./utils/foot.jpg') },
        { alt: 'carousel2', src: require('./utils/rugby.jpg') },
        { alt: 'carousel3', src: require('./utils/tennis.png') },
        { alt: 'carousel4', src: require('./utils/basket.jpg') },
    ]; 

    const [index, setIndex] = useState(0); // index
    
    // handleTurnCarousel(-1) - the carousel is turned in a counterclockwise direction.
    const handleTurnCarousel = (shift) => {
        setIndex((index + shift + images.length) % images.length);
    };

    return (
        <div className="py-3 pt-5 home-textecarousel">
          
          <h1 className="text-white"> Trouvez votre salle de sport ! </h1>
          
          <div className="home-carrousel">
            <div className="home-control-left">
              <span className="text-white home-carrouselC" onClick={() => handleTurnCarousel(-1)}> 
                &#60;
              </span>
            </div>
            
            <div className="home-carousel-items">
                {images.map((image, i) => (
                    <Card key={i} className={`home-carousel-img${(i + index) % images.length} border-0`} >
                        <Card.Img className='cardImageStyle' alt={image.alt} src={image.src} />
                        <a href="/createroom">
                            <img className="logoplus" src={require('./utils/plus.png')} alt="plus" />
                        </a>
                    </Card>
                ))}
            </div>
            
            <div className="home-control-right">
                <span className="text-white home-carrouselC" onClick={() => handleTurnCarousel(1)}>
                    &#62;
                </span>
            </div>
          </div>
        
        </div>
    );
}
