import React, { useContext } from 'react';
import MostrarBandas from './MostrarBandas';
import { UserContext } from '../context/UserContext';
import Box from '@material-ui/core/Box';
import { BsFileBreakFill } from "react-icons/bs";
import Configuracion from './estructura/configuracion';

const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, "Banda", "Potencia", "Temperatura", "Voltaje", "Corriente", "VSWR", "Estado", "Alarmas", "Fecha"];


const Filas = [{ bloqueador: "ANCON 1-BQ 1" }, { Banda: "870", Potencia: "35", Temperatura: "33", Voltaje: "27", Corriente: "1", VSWR: "1.1", Estado: "OK", Alarmas: "NO", Fecha: "2024-02-13 15:40:19.000" },
{ Banda: "1880", Potencia: "32", Temperatura: "35", Voltaje: "20", Corriente: "10", VSWR: "1.2", Estado: "OKK", Alarmas: "NO", Fecha: "2023-12-12 15:52:19.000" },
{ Banda: "190", Potencia: "43", Temperatura: "51", Voltaje: "27", Corriente: "13", VSWR: "1.3", Estado: "OKKK", Alarmas: "N", Fecha: "2022-02-09 16:03:19.000" },
{ Banda: "950", Potencia: "43", Temperatura: "32", Voltaje: "27", Corriente: "45", VSWR: "1.4", Estado: "OKKKK", Alarmas: "N", Fecha: "2021-02-09 16:03:19.000" }
];



const mainMostrarBandas = ({handleClickSendMessage}) => {

  const { seleccionarBQSA1 } = useContext(UserContext);

 

  return (
    <div style={{borderStyle: "solid", borderWidth: "2px", borderColor: "black", marginTop: "2vw", marginLeft: "1vw", marginRight: "2vw" }}>
      <Box style={{ borderStyle: "solid", borderWidth: "2px", borderColor: "black", marginTop: "2vw", marginLeft: "1vw", marginRight: "2vw", height: "5vw",display:"flex",justifyContent:"end",alignItems:"center"}}>
        <div style={{ marginTop: "0.5vw",marginRight:"1vw" }}>
          <Configuracion ></Configuracion>
        </div>
      </Box>
      <div style={{ marginTop: "1vw", marginLeft: "1vw", marginRight: "2vw", fontWeight: "bold", fontSize: "20px" }}>
        {seleccionarBQSA1 != null ? seleccionarBQSA1 : null}
      </div>
      <div style={{ borderStyle: "solid", borderWidth: "2px", borderColor: "black", marginTop: "2vw", marginLeft: "1vw", marginRight: "2vw" }}>
        <MostrarBandas columnas={columnas}  ></MostrarBandas>
      </div>
      <div style={{ marginTop: "2vw" }}>

      </div>
    </div>
  )
}

export default mainMostrarBandas