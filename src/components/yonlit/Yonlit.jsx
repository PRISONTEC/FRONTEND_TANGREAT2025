import React, { useState, useRef, useContext, useEffect } from 'react';
import { TiMediaPlay } from "react-icons/ti";
import "../../assets/css/yonlit.scss";
import { TiArrowSortedDown } from "react-icons/ti"; //abajo
import { TiArrowSortedUp } from "react-icons/ti"; //arriba
import { UserContext } from '../../context/UserContext';
import { BsFileBreakFill } from "react-icons/bs";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Animator, ScrollContainer, ScrollPage, batch, Fade, FadeIn, FadeOut, Move, MoveIn, MoveOut, Sticky, StickyIn, StickyOut, Zoom, ZoomIn, ZoomOut } from "react-scroll-motion";

const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, "BQ", "Potencia", "Temperatura", "Fecha"];

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }, button: {
        margin: theme.spacing(1),
    }
}));
const Yonlit = () => {

    //UseContext
    const { listarBQS, seleccionarBQS, datosBQS } = useContext(UserContext);

    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [columnaOrdenada, setColumnaOrdenada] = useState();
    const [banderaOrdenar, setBanderaOrdenar] = useState(false);
    const [imagenEncabezado, setImagenEncabezado] = useState(null);
    const classes = useStyles();


    //Ordenar de manera descendente y ascendente
    const handleColumnaClick = (index) => {
        if (index == 0) {
            setImagenEncabezado(null);
            setFilaSeleccionada(null);
        }

    }

    //BANDERA PARA QUITAR EL COLOR AZUL DE LA FILA

    const handleFilaClick = (e, index) => {
        /* setColumnaOrdenada(index) */
        setFilaSeleccionada(index);
    };

    //OBTENER DIFERENCIA ENTRE FECHAS(más de 5 minutos de diferencia entre fechas se pone color naranja)
    const diferenciaFechas = (fechaHora) => {
        //convertir de epoch a 2024-02-09 15:38:19.000
        var fechaHora1 = new Date(fechaHora * 1000);

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

    //ACTUALIZAR YONLIT
    const actualizarYonlit = (event) => {
        sendMessage(`{"command": "preguntarStatusBandasMID", "mid":"${event.target.value}"}`)
    }
 

    return (
        <div>

            <div className='d-flex flex-row' style={{ borderWidth: "2px", marginTop: "0.5vw", marginLeft: "-1vw", marginRight: "2vw" }}>
                <div className="tamanoBQ" style={{ marginTop: "-0.2vw" }}>
                    <h5 className='yonlit'>YONLIT</h5>
                </div>
                {/* <div >
                    {false ? <button className='buttonYonlit' onClick={() => actualizarYonlit()}>
                        Actualizar
                    </button> :
                        <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Dots />}
                        class={` buttonDesabilitadoYonlit`}
                    >
                        Actualizando
                    </Button>
                    }
                </div> */}
            </div>
            <div >
                <table className="responsive-tableyonlit" style={{ backgroundColor: '#d5d5d0' }} >
                    <thead >
                        <tr align="center">
                            {columnas.map((valor, index) => (
                                <th className='columnasYonlit' scope="col" key={index} style={{ color: "#190707" }} onClick={() => handleColumnaClick(index, valor)}>{valor}{index == imagenEncabezado && banderaOrdenar == false ? <TiArrowSortedDown /> : (index == imagenEncabezado && banderaOrdenar == true ? <TiArrowSortedUp /> : null)}</th>

                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(seleccionarBQS.startsWith('FF') && Object.keys(listarBQS).length > 0 && (listarBQS["ultimosDatosObtenidos"][0][seleccionarBQS] != undefined)) && listarBQS["ultimosDatosObtenidos"][0][seleccionarBQS]

                            .map(({ modulo, potencia, temperatura, voltaje, corriente, vswr, estadoInterruptor, valida, fechaHoraReporte }, index) => (

                                <tr
                                    key={index}
                                    align="center"
                                    onClick={(e) => handleFilaClick(e, index)}
                                    style={{ color: filaSeleccionada === index ? 'white' : '#190707', height: "1px" }}
                                >
                                    <th scope="row" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{filaSeleccionada === index ? <TiMediaPlay></TiMediaPlay> : null}</th>
                                    <td className="columnasFilaYonlit tamanoDeLetraContenidoYonlit" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{modulo}</td>
                                    <td className="columnasFilaYonlit tamanoDeLetraContenidoYonlit" style={{ backgroundColor: filaSeleccionada === index ? "#0078D7" : (potencia < 33 ? 'red' : (potencia >= 33 && potencia < 40 ? 'orange' : (potencia >= 40 && potencia < 44 ? 'yellow' : (potencia >= 44 ? 'Green' : null)))) }}>{potencia}
                                    </td>
                                    <td className="columnasFilaYonlit tamanoDeLetraContenidoYonlit" style={{ backgroundColor: filaSeleccionada === index ? "#0078D7" : (temperatura == -1 ? 'red' : (temperatura < 35 ? 'green' : (temperatura >= 35 && temperatura < 40 ? 'yellow' : (temperatura >= 40 && temperatura < 50 ? 'orange' : (temperatura >= 50 ? 'red' : null))))) }}>{temperatura}
                                    </td>
                                    <td className="columnasFilaYonlit tamanoDeLetraFechaYonlit" style={{ backgroundColor: filaSeleccionada === index ? "#0078D7" : (fechaHoraReporte == -1 ? 'red' : (diferenciaFechas(fechaHoraReporte) <= 5 ? 'green' : (diferenciaFechas(fechaHoraReporte) > 5 ? 'orange' : 'green'))) }}>{fechaHoraReporte == -1 ? fechaHoraReporte : convertirEpochAFecha(fechaHoraReporte)}</td>
                                </tr>

                            ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Yonlit