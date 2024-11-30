import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Navbar from './navbar';

export default function HomePage() {
  return (
    <div>
      {/* Шапка */}
      <header className='menu'>
        <Link to="/">
          <div className="bmstu">
              <div className="bmstu-image"><img src="http://192.168.56.101:9000/static/bmstu.png"/></div>
              <div className="bmstu-line"></div>
              <div className="bmstu-text">МОСКОВСКИЙ ГОСУДАРСТВЕННЫЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ ИМ Н. Э. БАУМАНА</div>
          </div>
        </Link>
        <Navbar />
      </header>

      {/* Основной контент */}
      <main className = "home-container">
        <h2 className="home-title">Добро пожаловать!</h2>
        <p className="home-description">
          Данный ресурс предназначен для регистрации на мероприятия музея МГТУ.
        </p>
        <Link to="/events" className="home-button">Список мероприятий</Link>
      </main>
    </div>
  );
}