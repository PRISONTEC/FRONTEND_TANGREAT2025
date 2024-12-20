import './App.css';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '../src/assets/css/mostrarBandas.scss';
import MainWebSocket from './components/MainWebSocket';
import UserProvider from './context/UserProvider';
import HistoricoBloqueador from './components/historicoBloqueador/historicoBloqueador';
import { ProtegerRutas } from './protegerRutas';
import Login from './login/Login';

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        
          <Route exact path="/modulo" element={
           <ProtegerRutas> 
            <MainWebSocket />
            </ProtegerRutas> 
          } />
        </Routes>
        {/* <Routes>
          <Route exact path="/historico" element={
            <HistoricoBloqueador />
          } />
        </Routes> */}

        {/* <Route exact path="/modulos" element={
            <ProtegerRutas>
              <HeaderCelular />
            </ProtegerRutas>
          } /> */}
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
