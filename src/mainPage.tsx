import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './navbar';

const mockEvents = [
  {
    pk: 1,
    event_name: 'Выставка робототехники',
    event_type: 'Выставка',
    duration: '2 часа',
    description: 'Описание выставки',
    img_url: 'http://192.168.56.101:9000/static/children.jpg',
  },
  {
    pk: 2,
    event_name: 'Лекция по искусственному интеллекту',
    event_type: 'Лекция',
    duration: '1.5 часа',
    description: 'Описание лекция',
    img_url: 'http://192.168.56.101:9000/static/children.jpg',
  },
  {
    pk: 3,
    event_name: 'Мастер-класс по программированию',
    event_type: 'Мастер-класс',
    duration: '3 часа',
    description: 'Описание мастер-класса',
    img_url: null,
  },
];

const defaultImageUrl = 'http://192.168.56.101:9000/static/8.png';

const MainPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [events, setEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [visitId, setVisitId] = useState(1); // Пример идентификатора заявки
  const [cartCount, setCartCount] = useState(0); // Число событий в корзине
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/');
        const eventsData = await response.json();
        const filteredData = eventsData.filter(item => item.pk !== undefined);
        const visitData = eventsData.find(item => item.visit);
        setEvents(filteredData);
        setFilteredEvents(filteredData);
        setVisitId(visitData?.visit?.pk || null);
        setCartCount(visitData?.visit?.cart_count || 0);
      } catch (error) {
        console.error('Ошибка при загрузке данных мероприятий:', error);
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
        const visitData = mockEvents.find(item => item.visit);
        setVisitId(visitData?.visit?.pk || null);
        setCartCount(visitData?.visit?.cart_count || 0);
      }
    };
    fetchEvents();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/events/?event_type=${inputValue}`);
      const result = await response.json();
      const filteredResult = result.filter(item => item.pk !== undefined);
      setFilteredEvents(filteredResult);
    } catch (error) {
      console.error('Ошибка при выполнении поиска:', error);
    }
  };

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
  
      {/* Search bar and cart */}
      <div className="menu row">
        <div className="search">
          <form 
          onSubmit={handleSearchSubmit}
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   const filtered = events.filter((event) =>
            //     event.event_name.toLowerCase().includes(inputValue.toLowerCase())
            //   );
            //   setFilteredEvents(filtered);
            // }}
            className="search-form"
          >
          <div className="search-bar">
          <input
              type="text"
              name="event_name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="form-control col-auto p-0"
              placeholder="Поиск мероприятий"
              style={{ height:'100%', border:'none', boxShadow: '0 1px 1px rgba(251, 195, 40, 0.075) inset'}}
            />
          </div>
            <input type="submit" value="" className="search-button" />
          </form>
        </div>
        <div className="cart">
          <a href={`/visit/${visitId}`}>
            <div className="cart-icon">
              <img
                src="http://192.168.56.101:9000/static/request-icon.png"
                alt="Cart"
              />
            </div>
            <div className="cart-count">{cartCount}</div>
          </a>
        </div>
      </div>
  
      {/* Event section title */}
      <div className="events">Мероприятия музея МГТУ</div>
  
      {/* Event cards */}
      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredEvents.map((event) => (
            <div key={event.pk} className="col">
              <div className="event-card d-flex">
                <a href={`/events/${event.pk}`} className="d-flex w-100">
                  {/* Text Section */}
                  <div className="col-md-4 event-text">
                    <h1>{event.event_name}</h1>
                    <p>{event.event_type}</p>
                    <p>{event.duration}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setCartCount(cartCount+1);
                        // handleAddEvent(event.pk)
                      }}
                      className="add-event-button"
                    >
                      Записаться
                    </button>
                  </div>
  
                  {/* Image Section */}
                  <div className="col-md-8 event-img">
                    <img
                      src={event.img_url || defaultImageUrl}
                      alt={event.event_name}
                      className="img-fluid h-100 w-100 object-cover"
                    />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );  
};
  
export default MainPage;