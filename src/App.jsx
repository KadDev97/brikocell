import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Repairs from './pages/Repairs.jsx';
import './App.css';
import { openDB } from './utils/indexedDB.js';

export const initDatabase = async () => {
  const db = await openDB("RepairDB", 1, (db) => {
    if (!db.objectStoreNames.contains("repairs")) {
      db.createObjectStore("repairs", { keyPath: "id" });
    }
  });
  return db;
};

function App() {
  useEffect(() => {
    initDatabase().then(() => {
      console.log("Base de datos inicializada correctamente");
    }).catch((error) => {
      console.error("Error al inicializar la base de datos:", error);
    });
  }, []); 

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/repairs" element={<Repairs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
