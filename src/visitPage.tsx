import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import Breadcrumbs from './breadcrumbs';
import { Offcanvas } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { api } from './api';
import { setCurrentCount, setCurrentVisitId } from './reduxSlices/eventSlice';
import Cookies from 'js-cookie';

// Мок-данные для заявок на мероприятия
const defaultImageUrl = '/events-app/mock_img/8.png';
const mockVisits = [
 {
  visitId: '1',
  events: [
   {
    event_name: 'Выставка робототехники',
    event_type: 'Выставка',
    duration: '2 часа',
    event_date: '2024-11-20',
    img_url: null,
   },
   {
    event_name: 'Лекция по искусственному интеллекту',
    event_type: 'Лекция',
    duration: '1.5 часа',
    event_date: '2024-11-22',
    img_url: null,
   },
  ],
  group: 'Группа студентов ИУ9',
 },
 {
  visitId: '2',
  events: [
   {
    event_name: 'Мастер-класс по программированию',
    event_type: 'Мастер-класс',
    duration: '3 часа',
    event_date: '2024-11-25',
    img_url: null,
   },
  ],
  group: 'Группа аспирантов',
 },
];

const VisitPage = () => {
 const { visitId } = useParams();
 const [currentEvents, setCurrentEvents] = useState([]);
 const [loading, setLoading] = useState(true);
 const [errorMessage, setErrorMessage] = useState('');
 const [group, setGroup] = useState('');
 const [eventDate, setEventDate] = useState(''); // Добавляем состояние для eventDate
 const [status, setStatus] = useState('');
 const [allowChanges, setAllowChanges]=useState(true);
 const [error, setError] = useState(null); // Для обработки ошибок

 const { isAuthenticated} = useSelector((state) => state.auth); // Получаем данные о пользователе из Redux состояния

 const [show, setShow] = useState(false);

 const handleClose = () => setShow(false);
 const handleShow = () => setShow(true);
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const fetchVisit = async () => {
  if (isAuthenticated) {
  try {
    const response = await api.visit.getVisitById(visitId);
    const visitData = await response.data;
    setCurrentEvents(visitData.events);
    setStatus(visitData.status);
    setGroup(visitData.group);
    if (visitData.status!=='draft'){
      dispatch(setAllowChanges(false));
    }
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    setError('Ошибка при загрузке заявок');
  } finally {
    setLoading(false);
  }
}};

 useEffect(() => {
    fetchVisit();
  }, []);

const handleDeleteVisit = async () => {
  if (!visitId) return; 

  try {
    let csrfToken = Cookies.get('csrftoken');
    const response = await fetch(`/api/moderate-visit/${visitId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
    });

    if (response.ok) {
      setCurrentEvents([]); 
      dispatch(setCurrentVisitId(null));
      dispatch(setCurrentCount(0));
      navigate('/events')
    } else {
      alert('Ошибка при удалении запроса');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
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

    if (response.status !== 200) {
      alert('Ошибка при удалении запроса');}
  } catch (error) {
    console.error('Ошибка:', error);
  }
 };

const handleDateChange = async  (eventId) => {
  console.log("visitId:", visitId, "eventId:", eventId, "eventDate:", eventDate);
  if (!visitId || !eventId || eventDate === '') return; // Проверяем, что данные заполнены

  try {
    let csrfToken = Cookies.get('csrftoken');

    const response = await api.editEventVisit.editEventInVisit(visitId, {event_id:eventId,date:eventDate}, {
      headers: {
        'X-CSRFToken': csrfToken,
      }
    });

    if (response.status === 200) {
      // Обновляем состояние мероприятий
      setCurrentEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.pk === eventId ? { ...event, date: eventDate } : event
        )
      );
    } else {
      alert('Ошибка при обновлении стоимости');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

const handleForm = async  () =>{
  if (!visitId) return;

  try {
    let csrfToken = Cookies.get('csrftoken');
    const response = await api.formVisit.formVisitById(visitId, {
      headers: {
        'X-CSRFToken': csrfToken,
      }
    });
    if (response.status === 200) {
      setCurrentEvents([]); // Очищаем угрозы после удаления
      dispatch(setCurrentVisitId(null));
      dispatch(setCurrentCount(0));
      navigate('/events')
    } else {
      alert('Ошибка при удалении запроса');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

const handleDeleteEvent = async (event_id) =>{
  if (!visitId || !event_id) return;
  try {
    let csrfToken = Cookies.get('csrftoken');
    const response = await fetch(`/api/edit-event-visit/${visitId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ event_id }),
    });
    console.log(response);
    if (response.ok) {
      // Успешно удалено
      setCurrentEvents(currentEvents.filter((event) => event.id !== event_id)); // Обновляем список угроз
    } else {
      alert('Ошибка при удалении мероприятия');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
  fetchVisit();
};

 if (errorMessage) {
  return (
   <div className="container">
    <div className="row justify-content-center">
     <div className="col-auto">
      <h2>{errorMessage}</h2>
     </div>
    </div>
   </div>
  );
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
            // onChange={(e) => setInputValue(e.target.value)}
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
    {currentEvents.length > 0 ? (
     currentEvents.map(event => (
        <div className="container">
        <div className="event-card-long row my-4" key={event.event_name} style={{minHeight:'14em', margin: '0 auto' }}>
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
              value={eventDate || event.date || "2020-10-20"}
              disabled={!allowChanges}
              onChange={(e) => {
                setEventDate(e.target.value);
              }}
              onBlur={() => handleDateChange(event.pk)} // Вызываем только по blur
              style={{ height: "100%", border: "none", padding: "0.5em 1em", borderRadius: "0.625em" }}
            />
            </h3>
            {allowChanges ? (
            <button 
              className="del-visit-button m-0"
              onClick={() => handleDeleteEvent(event.pk)}
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
                value={eventDate || event.date || "2020-10-20"}
                disabled={!allowChanges}
                onChange={(e) => {
                  setEventDate(e.target.value);
                  handleDateChange(visitId); // Здесь вы можете передать аргументы если нужно
                }}
                style={{ height:'100%', border:'none',padding:'0.5em 1em',borderRadius:'0.625em'}}
                />
            </h3>
            <button 
            className="del-visit-button m-0"
            onClick={() => handleDeleteEvent(event.pk)}
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