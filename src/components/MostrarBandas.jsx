import React, { useState,useRef,useContext,useEffect } from 'react';
import { TiMediaPlay } from "react-icons/ti";
import "../assets/css/mostrarBandas.scss";
import { TiArrowSortedDown } from "react-icons/ti"; //abajo
import { TiArrowSortedUp } from "react-icons/ti"; //arriba
import { UserContext } from '../context/UserContext'; 
import { BsFileBreakFill } from "react-icons/bs";

const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, "Banda", "Potencia", "Temperatura", "Voltaje", "Corriente", "VSWR", "Estado", "Alarmas", "Fecha"];

const MostrarBandas = () => {


  //UseContext
  const {listarBQS,seleccionarBQS,datosBQS} = useContext(UserContext);

  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [columnaOrdenada,setColumnaOrdenada]=useState();
  const [banderaOrdenar,setBanderaOrdenar]=useState(false);
  const [imagenEncabezado,setImagenEncabezado]=useState(null);


  //Ordenar de manera descendente y ascendente
  const handleColumnaClick = (index,valor) => {
    /* let datosOrdenados = [...listarBQS.ultimosDatosObtenidos]; */
    /* let valorMinuscula = valor.toLowerCase() */
   /*  console.log(index,valorMinuscula) */
    /* if(banderaOrdenar === false && 6>index>0){
      setBanderaOrdenar(true)
      setImagenEncabezado(index);
      datosOrdenados.sort((a, b) => parseInt(a[valorMinuscula]) - parseInt(b[valorMinuscula]));
      setColumnaOrdenada(datosOrdenados)
      console.log("datosOrdenados",datosOrdenados)
    }
    if(banderaOrdenar === true && 6>index>0){
      setBanderaOrdenar(false)
      setImagenEncabezado(index);
      datosOrdenados.sort((a, b) => parseInt(b[valorMinuscula]) - parseInt(a[valorMinuscula]));
      setColumnaOrdenada(datosOrdenados)
    } */
    if(index==0){
      setImagenEncabezado(null);
      setFilaSeleccionada(null);
    }

  }

  //BANDERA PARA QUITAR EL COLOR AZUL DE LA FILA

  const handleFilaClick = (e,index) => {
    /* setColumnaOrdenada(index) */
      setFilaSeleccionada(index);
    };

//OBTENER DIFERENCIA ENTRE FECHAS(más de 5 minutos de diferencia entre fechas se pone color naranja)
  const diferenciaFechas=(fechaHora)=>{
    //convertir de epoch a 2024-02-09 15:38:19.000
    var fechaHora1 = new Date(fechaHora*1000);

    // obtenr fecha en 2024-02-09 15:38:19.000
    const fechaActual2 = new Date();

    const diferenciaMilisegundos = fechaActual2 - fechaHora1;
    const diferenciaMinutos = diferenciaMilisegundos / 60000;
    /* console.log(diferenciaMilisegundos,fechaActual2 , fechaHora1,diferenciaMinutos) */
    return diferenciaMinutos;

}

//CONVERTIR EPOCH A FECHA D/M/A

const convertirEpochAFecha = (fechaHora) => {
  const fecha = new Date(fechaHora * 1000);
  // Obtener los componentes de la fecha y hora
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0, por lo que sumamos 1
  const anio = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const segundos = fecha.getSeconds().toString().padStart(2, '0');
  // Formatear la fecha y hora en el formato deseado
  const fechaNormal = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  // Muestra la fecha y hora normal
  return fechaNormal;
}


  return (
      <table className="responsive-table1" style={{ backgroundColor: '#d5d5d0' }} >
        <thead>
          <tr align="center">
            {columnas.map((valor, index) => (
              <th className='columnas' scope="col" key={index} style={{ color: "#190707"}} onClick={()=>handleColumnaClick(index,valor)}>{valor}{index==imagenEncabezado && banderaOrdenar==false ?<TiArrowSortedDown/>:(index==imagenEncabezado && banderaOrdenar==true?<TiArrowSortedUp/>:null)}</th>

            ))}
          </tr>
        </thead>
        <tbody>
         {(/* !seleccionarBQS.startsWith('FF') &&  */Object.keys(listarBQS).length > 0 && (listarBQS["ultimosDatosObtenidos"][0][seleccionarBQS]!=undefined)) && listarBQS["ultimosDatosObtenidos"][0][seleccionarBQS]
          
          .map(({modulo, potencia, temperatura, voltaje, corriente, vswr, estadoInterruptor, valida, fechaHoraReporte }, index) => (
            
            <tr
              key={index}
              align="center"
              onClick={(e) => handleFilaClick(e,index)}
              style={{color: filaSeleccionada === index ? 'white' : '#190707',height:"1px" }}
            >
              <th scope="row"   style={{backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{filaSeleccionada === index ? <TiMediaPlay></TiMediaPlay> : null}</th>
              <td   className="columnasFila tamanoDeLetraContenido" style={{backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{modulo}</td>

              <td   className="columnasFila tamanoDeLetraContenido" style={{backgroundColor: filaSeleccionada === index ?"#0078D7":(potencia<33?'red':(potencia>=33 && potencia<40?'orange':(potencia>=40 && potencia<44?'yellow':(potencia>=44?'Green':null)))) }}>{potencia}
              </td>
              
              <td className="columnasFila tamanoDeLetraContenido" style={{backgroundColor: filaSeleccionada === index ?"#0078D7":(temperatura==-1?'red':(temperatura<35?'green':(temperatura>=35 && temperatura<40?'yellow':(temperatura>=40 && temperatura<50?'orange':(temperatura>=50?'red':null))))) }}>{temperatura}
             </td>

              <td className="columnasFila tamanoDeLetraContenido" style={{ backgroundColor: filaSeleccionada === index ?"#0078D7":(voltaje==-1?'red':((voltaje===26 || voltaje==27)?'Green':'Orange')) }}>{voltaje}</td>
              <td className="columnasFila tamanoDeLetraContenido" style={{ backgroundColor: filaSeleccionada === index ?"#0078D7":(corriente==-1?'red':(corriente<=3?'orange':'green')) }}>{corriente}</td>
              <td className="columnasFila tamanoDeLetraContenido" style={{ backgroundColor: filaSeleccionada === index ?"#0078D7":(vswr==-1?'red':(vswr!="1.2"?'orange':'green')) }}>{vswr}</td>
              <td className="columnasFila tamanoDeLetraContenido" style={{ backgroundColor: filaSeleccionada === index ?"#0078D7":((estadoInterruptor==1 || estadoInterruptor==0)?'green':'orange') }}>{(estadoInterruptor==1 || estadoInterruptor==0?"OK":"KO")}</td>
              <td className="columnasFila tamanoDeLetraContenido" style={{ backgroundColor: filaSeleccionada === index ?"#0078D7":(valida==1?'green':'orange') }}>{valida==1?"NO":"SI"}</td>
              <td className="columnasFila tamanoDeLetraFecha" style={{backgroundColor: filaSeleccionada === index ?"#0078D7":(fechaHoraReporte==-1?'red':(diferenciaFechas(fechaHoraReporte)<=5?'green':(diferenciaFechas(fechaHoraReporte)>5?'orange':'green')))}}>{fechaHoraReporte==-1?fechaHoraReporte:convertirEpochAFecha(fechaHoraReporte)}</td>
            </tr>
            
          ))}

        </tbody>
      </table>
  )
}

export default MostrarBandas



/* if (valor.toLowerCase() === ("Temperatura").toLowerCase() ) {
        setBanderaOrdenar(true)
        datosOrdenados.sort((a, b) => parseInt(a.Temperatura) - parseInt(b.Temperatura));
      } else if (valor === "Potencia") {
        datosOrdenados.sort((a, b) => parseInt(a.Potencia) - parseInt(b.Potencia));
      } else if (valor === "Corriente") {
        datosOrdenados.sort((a, b) => parseInt(a.Corriente) - parseInt(b.Corriente));
      } */