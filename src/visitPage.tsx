import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import Breadcrumbs from './breadcrumbs';
import { Offcanvas } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { api } from './api';
// import { setCurrentCount, setCurrentVisitId } from './reduxSlices/eventSlice';
import Cookies from 'js-cookie';
import {fetchVisit, setEvents, deleteVisit,setGroup,formVisit} from './reduxSlices/visitSlice'
// Мок-данные для заявок на мероприятия
const defaultImageUrl = '/events-app/mock_img/8.png';

const VisitPage = () => {
 const { visitId } = useParams();
 const {events, allowChanges, status, group,error} = useSelector((state)=>state.visits);
 const [inputDate, setInputDate] = useState('');

 const { isAuthenticated} = useSelector((state) => state.auth); // Получаем данные о пользователе из Redux состояния

 const [show, setShow] = useState(false);

 const handleClose = () => setShow(false);
 const handleShow = () => setShow(true);
 const dispatch = useDispatch();
 const navigate = useNavigate();

 useEffect(() => {
  if (isAuthenticated) {
    dispatch(fetchVisit(visitId));
  } else{
    navigate(`/403`);
  }  
}, [visitId]);

const handleDeleteVisit = async () => {
  dispatch(deleteVisit(visitId));
  navigate('/events');
 };

 const handleGroupChange = async  () => {
  if (!visitId) return;

  try {
    let csrfToken = Cookies.get('csrftoken');
    const response = await api.visit.putVisitById(visitId, {group:group}, {
      headers: {
        'X-CSRFToken': csrfToken,
      }
    });
    console.log('group change ok')
    if (response.status !== 200) {
      alert('Ошибка при удалении запроса');}
  } catch (error) {
    console.error('Ошибка:', error);
  }

  dispatch(fetchVisit(visitId));
 };

const handleDateChange = async  (eventId) => {
  if (!visitId || !eventId || inputDate === '') return; // Проверяем, что данные заполнены

  try {
    let csrfToken = Cookies.get('csrftoken');

    const response = await api.editEventVisit.editEventInVisit(visitId, {}, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
      body : JSON.stringify({ event_id:eventId, date:inputDate })
    });
    if (response.status === 200) {
      dispatch(fetchVisit(visitId));

    } else {
      alert('Ошибка при обновлении стоимости');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }

  // dispatch(fetchVisit(visitId));

};

const handleForm = async  () =>{
  dispatch(formVisit(visitId));
  navigate('/events');
};

const handleDeleteEventVisit = async (eventId) =>{
  if (!visitId || !eventId) return;
  try {
    let csrfToken = Cookies.get('csrftoken');
    const response = await fetch(`/api/edit-event-visit/${visitId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ event_id:eventId }),
    });
    console.log(response);
    if (response.ok) {
      // Успешно удалено
      setEvents(events.filter((event) => event.id !== eventId)); // Обновляем список угроз
    } else {
      alert('Ошибка при удалении мероприятия');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }

  dispatch(fetchVisit(visitId));
};

 if (error) {
  return 
    navigate('/404');
    return <div className="text-danger text-center my-5">Ошибка: {error}</div>;
 }
 if (!visitId) {
  return null;
 }
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
            <div className="bmstu">
              <div className="bmstu-image"><img src="/events-app/mock_img/bmstu-white.png"/></div>
              <div className="bmstu-line"></div>
              <div className="bmstu-text">МОСКОВСКИЙ ГОСУДАРСТВЕННЫЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ ИМ Н. Э. БАУМАНА</div>
          </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
  <div className="container px-3">
    <div className='d-flex align-items-center '>
    <Breadcrumbs></Breadcrumbs>
    </div>
      <div className='menu-visit d-flex align-items-center'>
      <div className="events m-0">Заявка на мероприятие</div>
        <p className='search mx-2 m-0 flex-grow-1 text-center ' style={{maxWidth:'40em'}}>
          <input
            type="text"
            name="группа"
            value={group}
            disabled={!allowChanges}
            onChange={(e) => dispatch(setGroup(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGroupChange()
                e.preventDefault()
              }
              }}
              autoComplete="off"
            className="form-control col-auto pl-1"
            placeholder="Индекс группы"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
        </p>
        {allowChanges ? (
          <div className='d-flex align-items-center gap-2'>
            <button className="del-visit-button" onClick={handleDeleteVisit}>
            Удалить
            </button>
            <button className="del-visit-button " onClick={handleForm}>
            Подтвердить
            </button>
          </div>
        ):(
          <span></span>
        )}
      </div>

   <div className="main_visit">
    {events.length > 0 ? (
     events.map((event) => (
        <div className="container">
        <div className="event-card-long row my-4" key={event.pk} style={{minHeight:'14em', margin: '0 auto' }}>
          <div className="event-card-long-text col-md-8" style={{margin:'0', padding: '2em' }}>
            <h1>{event.event_name}</h1>
            <p>{event.event_type}</p>
            <p>{event.duration}</p>
            <div className='d-flex justify-space-between align-items-center mt-1'>
            <h3 style={{marginRight:'1em', fontSize:'20px',padding:'0'}}>
            <input
              type="date"
              name="date"
              className="form-control no-border px-3"
              value = "2020-10-20"
              value={event.date}
              disabled={!allowChanges}
              onChange={(e) => {
                setInputDate(e.target.value);
            }}
              onBlur={() => {
                handleDateChange(event.pk)
              }} // Здесь вы можете передать аргументы если нужно
              style={{ height: "100%", border: "none", padding: "0.5em 1em", borderRadius: "0.625em" }}
            />
            </h3>
            {allowChanges ? (
            <button 
              className="del-visit-button m-0"
              onClick={() => handleDeleteEventVisit(event.pk)}
              style={{background:'transparent',color:'#006CDC',borderWidth:'0.1em',borderColor:'#006CDC'}}>Удалить</button>
            ):(
              <span></span>
            )}
            </div>
          </div>
                
          {/* Изображение - 40% ширины */}
          <div className="event-card-long-img col-md-4" style={{padding:'0'}}>
            <img
              src={event.img_url || defaultImageUrl}
              alt={event.event_name}
              style={{ width: '100%', objectFit: 'cover',borderTopRightRadius:'10px', borderBottomRightRadius: '10px' }}
            />
          </div>
        </div>
  
        <div className="event-card-long__mobile row my-4" key={event.event_name} style={{minHeight:'14em', margin: '0 auto' }}>
          {/* Изображение - 40% ширины */}
          <div className="event-card-long-img col-md-4" style={{padding:'0'}}>
            <img
              src={event.img_url || defaultImageUrl}
              alt={event.event_name}
              style={{ width: '100%', objectFit: 'cover',borderTopRightRadius:'10px', borderBottomRightRadius: '10px' }}
            />
          </div>
          
          <div className="event-card-long-text col-md-8" style={{margin:'0', padding: '2em' }}>
            <h1>{event.event_name}</h1>
            <p>{event.event_type}</p>
            <p>{event.duration}</p>
            <p>{event.description}</p>
            <div className='d-flex justify-content-between align-items-center mt-1'>
            <h3 style={{marginRight:'1em', fontSize:'20px',padding:'0'}}>
                <input
                type="date"
                name="date"
                className="form-control no-border px-3"
                value={ event.date ? event.date : inputDate || "0000-00-00"}
                disabled={!allowChanges}
                onChange={(e) => {
                  dispatch(setInputDate(e.target.value));
                }}
                onBlur={() => handleDateChange(event.pk)} // Здесь вы можете передать аргументы если нужно

                style={{ height:'100%', border:'none',padding:'0.5em 1em',borderRadius:'0.625em'}}
                />
            </h3>
            <button 
            className="del-visit-button m-0"
            onClick={() => handleDeleteEventVisit(event.pk)}
            style={{background:'transparent',color:'#006CDC',borderWidth:'0.1em',borderColor:'#006CDC'}}>Удалить</button>
            </div>
          </div>
        </div>
        </div>
      ))
    ) : (
        <div></div>
    )}
   </div>
  </div>
  </div>
 );

};

  

export default VisitPage;