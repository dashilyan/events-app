import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout, fetchUser, updateUser, setEmail, setUsername, setFirstName, setLastName} from './reduxSlices/authSlice';
import { Offcanvas } from 'react-bootstrap';
import Navbar from './navbar';
import Breadcrumbs from './breadcrumbs';


const LKSPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { username, isAuthenticated, email, first_name, last_name } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
        navigate('/auth');
    }
}, [isAuthenticated, navigate]);

useEffect(() => {

if (isAuthenticated) {
  dispatch(fetchUser());
}
}, [isAuthenticated]);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateUser({email, first_name,last_name}));
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
        <h2 className="events text-center m-0">Мой профиль</h2>
        <form onSubmit={handleProfileUpdate} className="container my-4">
        <div className='search'>
          <input
            type="text"
            name="first_name"
            value={first_name}
            onChange={(e) => dispatch(setFirstName(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder={first_name || "Введите имя"}
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className='search'>
          <input
            type="text"
            name="last_name"
            value={last_name}
            onChange={(e) => dispatch(setLastName(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder={last_name || "Введите фамилию"}
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
            placeholder={email || "Введите email"}
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className="mt-5 text-center">
            <button type="submit" className="add-event-button">Изменить профиль</button>
          </div>
        </form>
      </div>
      </div>
      <div className='event-card-long__mobile' style={{height:"fit-content"}}>
      <div className="event-card-long-text d-block w-100 m-0" style={{height:"fit-content",padding:"2em",position:"relative"}}>
        <h2 className="events text-center my-3">Мой профиль</h2>
        <form onSubmit={handleProfileUpdate} className="container my-4">
          <div className='search'>
          <input
            type="text"
            name="first_name"
            value={first_name}
            onChange={(e) => dispatch(setFirstName(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder="Имя"
            autocomplete="off"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
          </div>
          <div className='search'>
          <input
            type="text"
            name="last_name"
            value={last_name}
            onChange={(e) => dispatch(setLastName(e.target.value))}
            // onChange={(e) => dispatch(setInputValue(e.target.value))}
            className="search-bar form-control col-auto"
            placeholder="Фамилия"
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
          <div className="mt-5 text-center">
            <button type="submit" className="add-event-button mx-auto">Изменить профиль</button>
          </div>
        </form>
      </div>
      </div>
    </div>
    </div>
  );
};

export default LKSPage;