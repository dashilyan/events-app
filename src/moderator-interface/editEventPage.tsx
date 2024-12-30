import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../navbar';
import Breadcrumbs from '../breadcrumbs';
import { Offcanvas } from 'react-bootstrap';
import { setFilteredEvents, setInputValue, setCurrentCount, setCurrentVisitId, fetchEvent, addEvent } from '../reduxSlices/eventSlice';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../api';
import { current } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

// Мок-данные для мероприятий
const mockEvent = 
  {
    pk: 1,
    event_name: 'Выставка робототехники',
    event_type: 'Выставка',
    duration: '2 часа',
    description: 'Описание выставки',
    img_url: null,
  };

const defaultImageUrl = '/events-app/mock_img/8.png';

const EditEvent = () => {
  const { eventId } = useParams();
  const {currentEvent,loading,error} = useSelector((state)=>state.events);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, is_staff } = useSelector((state) => state.auth); // Проверка на авторизацию
  const [imageFile, setImageFile] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [event, setEvent] = useState({
    pk:null,
    event_name: '',
    event_type: '',
    duration: '',
    description: '',
    img_url: '',
  });

  useEffect(() => {
    if (!isAuthenticated || !is_staff){
      navigate(`/403`);
    }
    if(eventId){
      console.log(eventId);
      console.log(event?.event_name);
      console.log(currentEvent);

      dispatch(fetchEvent(eventId));

      setEvent(currentEvent);

      console.log(event);
    }
  }, [dispatch, eventId]);

  // Обработка состояния загрузки и ошибок
  if (loading) {
    return <div className="text-center my-5">Загрузка данных мероприятия...</div>;
  }

  if (error) {
    navigate(`/404`);
    return <div className="text-danger text-center my-5">Ошибка: {error}</div>;
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    console.log(e.target.files[0])
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      console.log(imageFile)
      formData.append('event_id', eventId);
      formData.append('pic', imageFile);

      const response = await axios.post('/api/events/image/',formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

      if (response.status === 201) {
        return `http://192.168.56.101:9000/static/${imageFile.name}`;
      } else {
        throw new Error('Ошибка при загрузке изображения');
      }
    } catch (err) {
      console.error('Ошибка при загрузке изображения:', err);
      throw new Error('Не удалось загрузить изображение.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let curr_id;
      const newEvent = { ...event, img_url: defaultImageUrl};
      if (eventId) {
        await api.events.eventUpdate(eventId, newEvent, {
          headers: { 'X-CSRFToken': Cookies.get('csrftoken')},
        });
        curr_id=eventId;
      } else {
        const response=await axios.post('/api/events/create/', newEvent, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });
      console.log(response);
      const eventData = await response.json();
      curr_id=eventData.pk;
      }

      dispatch(fetchEvent(curr_id));
      let imageUrl = event.img_url;
      if (imageFile) {
        // Сначала загружаем изображение
        imageUrl = await uploadImage();
      }
      
      navigate('/events-table');
    } catch (err) {
      console.error('Ошибка при сохранении мероприятия:', err);
      // setError('Не удалось сохранить данные. Проверьте введенные данные.');
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
            <div className="bmstu">
              <div className="bmstu-image"><img src="/events-app/mock_img/bmstu-white.png"/></div>
              <div className="bmstu-line"></div>
              <div className="bmstu-text">МОСКОВСКИЙ ГОСУДАРСТВЕННЫЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ ИМ Н. Э. БАУМАНА</div>
          </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      <div className="container">
      <Breadcrumbs></Breadcrumbs>
      <div className='events text-center'>{eventId ? 'Изменение мероприятия' : 'Добавление нового мероприятия'}</div>
      <div className="event-card-long row my-4" style={{minHeight:'14em', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="event-card-long-text col-md-8" style={{margin:'0', padding: '2em' }}>
          <div className='d-flex flex-column gap-4'>
          <p className='input-bar'>
          <input
            type="text"
            name="event_name"
            value={event.event_name}
            onChange={ handleChange }
            required
            autoComplete="off"
            className="form-control col-auto pl-1"
            placeholder="Название мероприятия"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
        </p>
        <p className='input-bar'>
        <input
            type="text"
            name="event_type"
            value={event.event_type}
            onChange={ handleChange }
            required
            autoComplete="off"
            className="form-control col-auto pl-1"
            placeholder="Название мероприятия"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
        </p>
        <p className='input-bar'>
        <input
            type="text"
            name="duration"
            value={event.duration}
            onChange={ handleChange }
            required
            autoComplete="off"
            className="form-control col-auto pl-1"
            placeholder="Название мероприятия"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
        </p>
        <p className='input-bar' >
        <input
            type="text"
            name="description"
            value={event.description}
            onChange={ handleChange }
            required
            autoComplete="off"
            className="form-control col-auto pl-1"
            placeholder="Название мероприятия"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
        </p>
        <p className='input-bar' >
        <input
            type="file"
            id="img_file"
            name="img_file"
            onChange={handleImageChange}

            required
            autoComplete="off"
            className="form-control col-auto pl-1"
            placeholder="Название мероприятия"
            style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
          />
        </p>
        <button type="submit" className="add-event-button" style={{maxWidth:'10em', margin:'auto'}}>Сохранить</button>
        </div>
        </form>
              
        {/* Изображение - 40% ширины */}
        <div className="event-card-long-img col-md-4" style={{padding:'0'}}>
          <img
            src={currentEvent?.img_url || defaultImageUrl}
            alt={currentEvent?.event_name || mockEvent.event_name}
            style={{ width: '100%', objectFit: 'cover',borderTopRightRadius:'10px', borderBottomRightRadius: '10px' }}
          />
        </div>
      </div>

      <div className="event-card-long__mobile row my-4" key={currentEvent?.pk} style={{minHeight:'14em', margin: '0 auto' }}>
        {/* Изображение - 40% ширины */}
        <div className="event-card-long-img col-md-4" style={{padding:'0'}}>
          <img
            src={currentEvent?.img_url || defaultImageUrl}
            alt={currentEvent?.event_name}
            style={{ width: '100%', objectFit: 'cover',borderTopRightRadius:'10px', borderTopLeftRadius: '10px' }}
          />
        </div>
        
        <div className="event-card-long-text col-md-8" style={{margin:'0', padding: '2em' }}>
          <h1>{currentEvent?.event_name}</h1>
          <p>{currentEvent?.event_type}</p>
          <p>{currentEvent?.duration}</p>
          <p>{currentEvent?.description}</p>
        </div>
      </div>
      </div>
      </div>
  );
};

export default EditEvent;