import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import { Offcanvas, Table, Dropdown, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Breadcrumbs from './breadcrumbs';
import { api } from './api';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { fetchVisits } from './reduxSlices/visitSlice'

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

  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState('');
  const { visits } = useSelector((state)=> state.visits);
  const { isAuthenticated } = useSelector((state) => state.auth); // Проверка на авторизацию

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchVisits());
    }
  }, [isAuthenticated]);

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
         <Table striped bordered hover className="custom-table mt-4" style={{'--bs-table-border-color':'white'}}>
             <thead>
                 <tr>
                     <th>№</th>
                     <th>Статус</th>
                     <th>Дата создания</th>
                     <th>Дата формирования</th>
                     <th>Дата завершения</th>
                     <th>Группа</th>
                     <th>Количество посетителей</th>
                 </tr>
             </thead>
             <tbody>
                 {visits?.map(visit => (
                     <tr key={visit.pk}>
                         <td>{visit.pk}</td>
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
                          <Link to={`/visit/${visit.pk}`}>Детали</Link>
                         </td>
                     </tr>
                 ))}
             </tbody>
         </Table>
        </div>
        </div>
  );
}