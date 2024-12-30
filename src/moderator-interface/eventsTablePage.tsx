import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar';
import { Offcanvas, Table, Dropdown, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Breadcrumbs from '../breadcrumbs';
import { api } from '../api';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { fetchVisits } from '../reduxSlices/visitSlice'
import { setFilteredEvents, setInputValue, setCurrentCount, setCurrentVisitId, fetchEvents, addEvent } from '../reduxSlices/eventSlice';
import Cookies from 'js-cookie'

const defaultImageUrl = 'mock_img/8.png';

export default function EventsTable() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState('');
  const { events } = useSelector((state)=> state.events);
  const { isAuthenticated, is_staff } = useSelector((state) => state.auth); // Проверка на авторизацию

  useEffect(() => {
    if (!isAuthenticated || !is_staff){
      navigate(`/403`);
    }
    dispatch(fetchEvents());

  }, []);

  const handleDeleteEvent= async (eventId) => {
    try {
      await api.events.eventDelete(eventId, {
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      });
      dispatch(fetchEvents());

    } catch (error) {
      console.error('Ошибка при удалении мероприятия:', error);
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
        <div className='d-flex flex-row justify-content-between align-items-center'>
        <Breadcrumbs></Breadcrumbs>
        <Link to={`/edit-event/`} className='add-event-button mt-4' style={{maxWidth:'fit-content'}}>Добавить новое мероприятие</Link>

        </div>
         <Table striped bordered hover className="custom-table mt-4" style={{'--bs-table-border-color':'white'}}>
             <thead>
                 <tr>
                     <th>№</th>
                     <th>Название</th>
                     <th>Тип</th>
                     <th>Длительность</th>
                     <th>Изображение</th>
                 </tr>
             </thead>
             <tbody>
                 {events?.map(event => (
                     <tr key={event.pk}>
                         <td>{event.pk}</td>
                         <td>{event.event_name}</td>
                         <td>{event.event_type}</td>
                         <td>{event.duration}</td>
                         <td>
                         <img
                            src={event.img_url || defaultImageUrl}
                            alt={event.event_name}
                            className="img-fluid h-100 w-100 object-cover"
                            style={{maxWidth:'20em'}}
                             /></td>

                         <td>
                          <div className='d-flex flex-column gap-2'>
                          <Link to={`/events/${event.pk}`} className='add-event-button'>Детали</Link>
                          <Link to={`/edit-event/${event.pk}`} className='add-event-button'>Изменить</Link>
                          <button
                            className="del-visit-button m-0 justify-content-center"
                            onClick={() => handleDeleteEvent(event.pk)}
                            style={{background:'transparent',color:'#006CDC',borderWidth:'0.1em',borderColor:'#006CDC',fontSize:'1em'}}>Удалить</button>
                          </div>
                         </td>
                     </tr>
                 ))}
             </tbody>
         </Table>
        </div>
        </div>
  );
}