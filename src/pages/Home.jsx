import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.jpg';
import "../styles/Home.css"

function Home() {
  return (
    <div className="container text-center mt-5">
      <div><img src={logo} alt="Logo de Brikocell" style={{ maxWidth: '150px', marginBottom: '20px' }}/></div>
      <h1>Bienvenido a Brikocell</h1>
      <p>Gestiona fácilmente tus reparaciones de dispositivos móviles.</p>
      <Link to="/repairs" className="btn btn-primary" style={{backgroundColor: '#a10000', border: 'none',}}>
        Ir a Reparaciones
      </Link>
    </div>
  );
}

export default Home;
