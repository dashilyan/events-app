import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { Offcanvas, Table, Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Breadcrumbs from './breadcrumbs';
import { api } from './api';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { fetchVisits } from './reduxSlices/visitSlice'
import { setCurrentVisitId } from './reduxSlices/eventSlice';
import axios from 'axios'
import Cookies from 'js-cookie'

const statusmapping = {
  '': 'Главная',
  'draft':'Черновик',
  'formed':'Сформирована',
  'declined':'Отклонена',
  'accepted':'Одобрена',
  'active':'В работе',
  'ended':'Завершена',
};
const mockVisits = [
  {
   pk: '1',
   status:'accepted',
   formed_at:'02.02.2002',
   created_at:'01.01.2001',
   ended_at:'03.03.2003',
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
   visitors: 10
  },
  {
   pk: '2',
   status:'declined',
   formed_at:'02.02.2002',
   created_at:'01.01.2001',
   ended_at:'03.03.2003',
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
   visitors: 20
  },
 ];

export default function VisitsTable() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const { visits } = useSelector((state)=> state.visits);
  const { isAuthenticated, is_staff } = useSelector((state) => state.auth); // Проверка на авторизацию

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [creator, setCreator] = useState('');

  const handleFetchVisits = () => {
    dispatch(fetchVisits({
        startDate:startDate,
        endDate:endDate,
        status_input:status,
        creator_input:creator
    }));
}


useEffect(() => {
  if (isAuthenticated) {
    let intervalId;
    handleFetchVisits();

    intervalId = setInterval(handleFetchVisits, 2000);
    return () => clearInterval(intervalId);
  }else{
    navigate(`/403`);
  }  
}, [startDate, endDate, status, creator,dispatch, isAuthenticated]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     dispatch(fetchVisits({start_date:startDate,end_date:endDate,status_input:status}));
  //   } else{
  //     navigate(`/403`);
  //   }  
  // }, [isAuthenticated]);

  const handleEndVisit = async (visitId,accept_value) => {
    try {
      let csrfToken = Cookies.get('csrftoken');
      const response = await fetch(`/api/moderate-visit/${visitId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ accept:accept_value }),
      });
      // await axios.get(`/api/moderate-visit/${visitId}`);

      dispatch(fetchVisits());
      
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error);
      // setError('Ошибка при отклонении заявки');
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
        {is_staff ? (
        <div className='d-flex flex-row gap-4' style={{ alignItems: 'end', marginBottom: '20px', justifyContent: 'start', flexWrap: 'wrap' }}>
        <div className='d-flex flex-row gap-4 ' style={{ alignItems: 'stretch', maxHeight:'100px'}}>
    <div className='event-card-long-text m-0 d-flex flex-column justify-content-between' style={{ alignItems: 'stretch'}}>
        <div className='blue-text' style={{color:'#303030', zIndex:'10'}}>От даты</div>
            <h3  style={{marginRight:'1em', fontSize:'20px',padding:'0', height: '100%'}}>
            <input
                type="date"
                name="date"
                onChange={(e) => 
                  {setStartDate(e.target.value);
                   handleFetchVisits()}}
                className="form-control no-border px-3"
                value = {startDate}
                style={{ height: "100%", border: "none", padding: "0", margin:'0', borderRadius: "0.625em" }}
            />
        </h3>
    </div>
    <div className='event-card-long-text m-0 d-flex flex-column justify-content-between' style={{ alignItems: 'stretch'}}>
        <div className='blue-text' style={{color:'#303030', zIndex:'10'}}>До даты</div>
            <h3  style={{marginRight:'1em', fontSize:'20px',padding:'0', height: '100%'}}>
            <input
                type="date"
                name="date"
                onChange={(e) => 
                  {setEndDate(e.target.value);
                   handleFetchVisits()}}
                className="form-control no-border px-3"
                value = {endDate}
                style={{ height: "100%", border: "none", padding: "0", margin:'0', borderRadius: "0.625em" }}
            />
        </h3>
    </div>
          <div className='event-card-long-text m-0 d-flex flex-column justify-content-between' style={{ alignItems: 'stretch'}}>
              <div className='blue-text' style={{color:'#303030', zIndex:'10'}}>От пользователя</div>
                  <h3  style={{marginRight:'1em', fontSize:'20px',padding:'0', height: '100%'}}>
                  <input
                      type="text"
                      name="name"
                      className="form-control no-border px-3"
                      value = {creator}
                      placeholder='пользователь'
                      onChange = {(e)=>
                      {
                        setCreator(e.target.value);
                        handleFetchVisits()
                      }
                    }
                      style={{ height: "100%", border: "none", padding: "0", margin:'0', borderRadius: "0.625em" }}
                  />
              </h3>
          </div>
                <div style={{ height: "100%"}}>
                    <div className='blue-text' style={{color:'#303030'}}>Статус</div>
                    <Dropdown style={{height: "100%", borderRadius:"0.625em"}}>
                        <Dropdown.Toggle className='add-event-button' style={{height: "100%", padding: '0.5em',borderRadius:"0.625em"}}>
                        {status}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setStatus('')}>Любой</Dropdown.Item>
                            <Dropdown.Item onClick={() => setStatus('formed')}>Сформирована</Dropdown.Item>
                            <Dropdown.Item onClick={() => setStatus('accepted')}>Одобрена</Dropdown.Item>
                            <Dropdown.Item onClick={() => setStatus('declined')}>Отклонена</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            </div>
        ) : (
          <></>
        )}
         <Table striped bordered hover className="custom-table mt-4" style={{'--bs-table-border-color':'white'}}>
             <thead>
                 <tr>
                     <th>№</th>
                     <th>Имя</th>
                     <th>Статус</th>
                     <th>Дата создания</th>
                     <th>Дата формирования</th>
                     <th>Дата завершения</th>
                     <th>Группа</th>
                     <th>Количество посетителей</th>
                 </tr>
             </thead>
             <tbody>
                 {visits?.map((visit) => (
                     <tr key={visit.pk}>
                         <td>{visit.pk}</td>
                         <td>{visit.user}</td>
                         <td>{statusmapping[visit.status]}</td>
                         <td>{format(parseISO(visit.created_at),'dd.MM.yyyy')}</td>
                         {visit.formed_at ? (
                          <td>{format(parseISO(visit.formed_at),'dd.MM.yyyy')}</td>
                         ):(
                          <td>{visit.formed_at}</td>
                         )}
                          {visit.ended_at ? (
                          <td>{format(parseISO(visit.ended_at),'dd.MM.yyyy')}</td>
                         ):(
                          <td>{visit.ended_at}</td>
                         )}
                         <td>{visit.group}</td>
                         <td>{visit.visitors}</td>
                         <td>
                         <div className='d-flex flex-column gap-2'>
                          <Link to={`/visit/${visit.pk}`} className='add-event-button'>Детали</Link>
                          {is_staff ? (
                            <>
<button
                          onClick={(e) => {
                            e.preventDefault();
                            handleEndVisit(visit.pk,true)
                          }}
                          className="add-event-button m-0 justify-content-center">
                          Одобрить
                          </button>
                          <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleEndVisit(visit.pk,false)
                          }}
                          className="add-event-button m-0 justify-content-center">
                          Отклонить
                          </button>                            </>
                          ) : (
                            <></>
                          )}
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