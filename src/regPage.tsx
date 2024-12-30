import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { Offcanvas } from 'react-bootstrap';
import Breadcrumbs from './breadcrumbs';
import { useDispatch } from 'react-redux';
import { login, regUser, setEmail, setFirstName, setLastName, setPassword, setUsername } from './reduxSlices/authSlice'; // Импортируем экшн для авторизации

const RegPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { username, isAuthenticated,email, first_name, last_name, password } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(regUser({email,username,password}));
    if (isAuthenticated){
      navigate('/events');
    }
    else{
      navigate('/auth');
    }
  };

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
      </div>

      <div className='container mt-3 d-flex justify-content-center'>
      <div className='event-card-long' style={{height:"fit-content",maxWidth:"40em"}}>
      <div className="event-card-long-text d-block w-100" style={{height:"fit-content",padding:"2em",position:"relative"}}>
        <h2 className="events text-center m-0">Регистрация</h2>
        <form onSubmit={handleRegister} className="container my-4">
          <div className='search'>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder="Имя пользователя"
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className='search'>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder="Пароль"
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className='search'>
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder="Пароль"
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className="mt-5 text-center">
            <button type="submit" className="add-event-button">Зарегистрироваться</button>
          </div>
        </form>
      </div>
      </div>
      <div className='event-card-long__mobile' style={{height:"fit-content"}}>
      <div className="event-card-long-text d-block w-100 m-0" style={{height:"fit-content",padding:"2em",position:"relative"}}>
        <h2 className="events text-center my-3">Регистрация</h2>
        <form onSubmit={handleRegister} className="container my-4">
        <div className='search'>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder="Имя пользователя"
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className='search'>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder="Email"
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className='search'>
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder="Пароль"
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className="mt-5 text-center">
            <button type="submit" className="add-event-button mx-auto">Зарегистрироваться</button>
          </div>
        </form>
      </div>
      </div>
    </div>
    </div>
  );
};

export default RegPage;