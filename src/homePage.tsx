import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import { Offcanvas, Carousel } from 'react-bootstrap';
import { useState } from 'react';
import Breadcrumbs from './breadcrumbs';

export default function HomePage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      {/* Шапка */}
      <div className='menu'>
        <Link to="/">
          <div className="bmstu">
              <div className="bmstu-image"><img src="/events-app/mock_img/bmstu.png"/></div>
              <div className="bmstu-line"></div>
              <div className="bmstu-text">МОСКОВСКИЙ ГОСУДАРСТВЕННЫЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ ИМ Н. Э. БАУМАНА</div>
          </div>
        </Link>
        <Navbar />
      </div>
      <div className='menu__mobile'>
        {/* BMSTU Logo Section */}
        <div className="burger-menu" onClick={handleShow}>
        ☰
        </div>
        
        {/* Offcanvas Navigation */}
        <Offcanvas show={show} onHide={handleClose} placement="start" className="text-light" style={{color:"#ffffff"}}> {/* Changed background */}
          <Offcanvas.Header closeButton className="border-0" style={{backgroundColor:"#006CDC"}}> {/* Added border-0 */}
            <Offcanvas.Title className="text-light mx-3 fs-2" style={{margin:"0.5em 1em"}}>Навигация</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="" style={{backgroundColor:"#006CDC"}}> {/* Changed background */}
            <Navbar></Navbar>
            <div className="bmstu w-100">
              <div className="bmstu-image"><img src="/events-app/mock_img/bmstu-white.png"/></div>
              <div className="bmstu-line"></div>
              <div className="bmstu-text">МОСКОВСКИЙ ГОСУДАРСТВЕННЫЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ ИМ Н. Э. БАУМАНА</div>
          </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <div className='container'>
        <Breadcrumbs></Breadcrumbs>
      {/* Основной контент */}
        <h2 className="home-title text-center">Добро пожаловать!</h2>
        <p className="home-description text-center">
        Зарегистрируйтесь на увлекательные мероприятия нашего музея! Выбирайте лекции, мастер-классы, экскурсии и другие события, которые вас интересуют, и бронируйте места онлайн.
        </p>
       {/* Карусель с изображениями */}
       <Carousel style={{ maxWidth:'40em', margin: '0 auto' }}> 
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="events-app/public/mock_img/carousel/1.jpg" 
          alt="First slide"
          style={{ height: '20em', objectFit: 'cover' }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="events-app/public/mock_img/carousel/3.jpg" 
          alt="Second slide"
          style={{ height: '20em', objectFit: 'cover' }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="events-app/public/mock_img/carousel/6.jpg" 
          alt="Third slide"
          style={{ height: '20em', objectFit: 'cover' }}
        />
      </Carousel.Item>
    </Carousel>
    </div>
    </div>
  );
}