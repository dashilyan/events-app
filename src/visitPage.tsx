import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';
import Navbar from './navbar';

// Мок-данные для заявок на мероприятия
const mockVisits = [
  {
    visitId: '1',
    events: [
      {
        event_name: 'Выставка робототехники',
        event_type: 'Выставка',
        duration: '2 часа',
        event_date: '2024-11-20',
        img_url: 'http://192.168.56.101:9000/static/children.jpg',
      },
      {
        event_name: 'Лекция по искусственному интеллекту',
        event_type: 'Лекция',
        duration: '1.5 часа',
        event_date: '2024-11-22',
        img_url: 'http://192.168.56.101:9000/static/children.jpg',
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
        img_url: 'http://example.com/children.jpg',
      },
    ],
    group: 'Группа аспирантов',
  },
];

const defaultImageUrl = 'http://192.168.56.101:9000/static/children.jpg';

const VisitPage = () => {
  const { visitId } = useParams();
  const [currentEvents, setCurrentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [group, setGroup] = useState('');
  const [eventDate, setEventDate] = useState(''); // Добавляем состояние для eventDate

  const [inputGroup, setInputGroup] = useState(''); // Добавляем состояние для поля group
  const [inputEventDate, setInputEventDate] = useState(''); // Добавляем состояние для поля event_date

  useEffect(() => {
    const fetchVisitData = async () => {
      if (!visitId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/visits/${visitId}/`);
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных! Заявка не активна или необходимо авторизоваться!');
        }

        const visitData = await response.json();
        setCurrentEvents(visitData.events);
        setGroup(visitData.group);
        setInputGroup(visitData.group); // Устанавливаем начальное значение для inputGroup
        setInputEventDate(visitData.events.length > 0 ? visitData.events[0].event_date : ''); // Устанавливаем значение event_date
      } catch (err) {
        const mockVisit = mockVisits.find(visit => visit.visitId === visitId);
        if (mockVisit) {
          setCurrentEvents(mockVisit.events);
          setGroup(mockVisit.group);
          setInputGroup(mockVisit.group); // Устанавливаем значение inputGroup
          setInputEventDate(mockVisit.events.length > 0 ? mockVisit.events[0].event_date : ''); // Устанавливаем event_date из mock
        } else {
          setErrorMessage('Заявка не найдена');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVisitData();
  }, [visitId]);

  const handleDelete = async () => {
    if (!visitId) return;

    try {
      const response = await fetch('/del_visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visit_id: visitId }),
      });
      if (response.ok) {
        alert('Заявка успешно отменена');
        setCurrentEvents([]);
      } else {
        alert('Ошибка при отмене заявки');
      }
    } catch (error) {
      console.error('Ошибка при отмене заявки:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'group') {
      setInputGroup(value);
    } else if (name === 'eventDate') {
      setInputEventDate(value);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-auto">
            <h2>Загрузка...</h2>
          </div>
        </div>
      </div>
    );
  }

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
    {/* BMSTU header */}
    <header className='menu'>
      <a href="/">
        <div className="bmstu">
            <div className="bmstu-image"><img src="http://192.168.56.101:9000/static/bmstu.png"/></div>
            <div className="bmstu-line"></div>
            <div className="bmstu-text">МОСКОВСКИЙ ГОСУДАРСТВЕННЫЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ ИМ Н. Э. БАУМАНА</div>
        </div>
      </a>
      <Navbar />
    </header>

    <div className="container">
      <div className="menu3 row my-5 mt-1" style={{ width: 'calc(100%)', margin: '0 auto' }}>
        <h1 className="col-auto">Заявка на мероприятие</h1>
        <p className='p-0'>
        <input
          type="text"
          name="group"
          className="form-control col-auto pl-1"
          value={inputGroup}
          onChange={handleInputChange}
          placeholder="Группа"
          style={{ height:'100%', border:'none'}}
        />
        </p>
        <button className="del-visit-button col-auto ml-auto" onClick={handleDelete}>
          Отменить запись
        </button>

      </div>

      <div className="main_visit">
        {currentEvents.length > 0 ? (
          currentEvents.map(event => (
            <div className="event-card-long row mb-4 my-5" key={event.event_name} style={{minHeight:'14em', margin: '0 auto' }}>
              {/* Текстовая часть - 60% ширины */}
              <div className="event-card-long-text col-md-6" style={{margin:'0', padding: '2em' }}>
                <h1>{event.event_name}</h1>
                <p>{event.event_type}</p>
                <p>{event.duration}</p>
                <h3 style={{margin:'1em 0 0',fontSize:'20px'}}>
                <input
                  type="date"
                  name="eventDate"
                  className="form-control no-border p-0"
                  value={inputEventDate}
                  onChange={handleInputChange}
                  placeholder="Дата мероприятия"
                  style={{ height:'100%', border:'none',padding:'0.5em 1em'}}
                />
                </h3>
                {/* <h3>Дата: {event.event_date}</h3> */}
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
          ))
        ) : (
          <div className="row">
            <div className="col">
              <div className="empty-cart text-center">
                <p>Вы не записываетесь ни на одно мероприятие</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default VisitPage;