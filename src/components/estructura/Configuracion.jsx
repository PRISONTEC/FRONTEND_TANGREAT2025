import React, { useRef, useContext, useState, useEffect, useCallback } from 'react';
import '../../assets/css/configuracion.scss';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { UserContext } from '../../context/UserContext';


import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';

import { TiMediaPlay } from "react-icons/ti";
import "../../assets/css/configuracion.scss";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { BsFileBreakFill } from "react-icons/bs";
import CircularProgress from '@material-ui/core/CircularProgress';
import { FcOk } from "react-icons/fc";
/* import CircularProgress from '@mui/joy/CircularProgress'; */
/* import CircularProgress from '@mui/joy/CircularProgress'; */
import { render } from "react-dom";
import Excel from '../../components/grafico/components/Excel'

import { Dots } from "react-activity";
import "react-activity/dist/library.css";



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


const configuracion = ({ sendMessage, botonConfiguracion }) => {
    const [open, setOpen] = React.useState(false);
    const { datosBQS, setDatosBQS, listarBQS, selectedOption, setSelectedOption, datosModificacion, setDatosModificacion, actualizado, setActualizado, tiempo } = useContext(UserContext);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [banderaOrdenar, setBanderaOrdenar] = useState(false);
    const [imagenEncabezado, setImagenEncabezado] = useState(null);
    /* const [botonConfiguracion, setBotonConfiguracion] = useState(false); */


    const classes = useStyles();

    //!AGREGAR COLUMNAS
    const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, "BandaHex", "Banda", "CH1Low", "CH1High", "CH2Low", "CH2High", "CH3Low", "CH3High", "CH4Low", "CH4High", "Potencia", "Estado"];

    //!ABRIR Y CERRAR EL MODAL
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    //!ELEMENTO SELECCIONADO BQ Y ENVIAR COMANDO
    const handleChangeClick = (event) => {
        setDatosModificacion({})
        setDatosBQS("KOKO")
        setSelectedOption(event.target.value);
        setActualizado(true)
        sendMessage(`{"command": "preguntarStatusBandasMID", "mid":"${event.target.value}"}`)
    };


    //!BANDERA PARA QUITAR EL COLOR AZUL DE LA FILA

    const handleFilaClick = (e, index) => {
        /* setColumnaOrdenada(index) */
        /* setFilaSeleccionada(index); */
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
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, por lo que sumamos 1
        const anio = fecha.getFullYear();
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds();
        // Formatear la fecha y hora en el formato deseado
        const fechaNormal = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
        // Muestra la fecha y hora normal
        return fechaNormal;


    }

    /*  {"MID": "D800", "frecuencia": 700, "frecCh1Low": 765, "frecCh1High": 766, "frecCh2Low": 780, 
     "frecCh2High": 781, "frecCh3Low": 795, "frecCh3High": 796, "frecCh4Low": 0, "frecCh4High": 0, "potencia": 47, "estadoSW": 0} */

    //!OBTENER JSON DE LA TABLA PARA CAMBIAR DE VALOR  Y ENVIAR CONSULTA
    const obtenerContenidoTablaEnJSON = () => {
        const filas = document.querySelectorAll('.responsive-table tbody tr');
        const contenidoTabla = [];
        const columnas = ['MID', 'frecuencia', 'frecCh1Low', 'frecCh1High', 'frecCh2Low', 'frecCh2High', 'frecCh3Low', 'frecCh3High', 'frecCh4Low', 'frecCh4High', 'potencia', 'estadoSW'];

        filas.forEach((fila) => {
            const celdas = fila.querySelectorAll('td');
            const filaJSON = {};
            // Comenzamos desde la segunda celda (columna 1)
            for (let i = 0; i < celdas.length; i++) {
                const columna = columnas[i]; // Nombre genérico para las columnas
                /* filaJSON[columna] = celdas[i].textContent; */
                if (i == 0) {
                    filaJSON[columna] = celdas[i].textContent;
                } else {
                    filaJSON[columna] = parseInt(celdas[i].textContent);
                }
            }

            contenidoTabla.push(filaJSON);
        });
        const sinNegativos = contenidoTabla.filter(obj => obj.frecuencia != -1);
        const nuevoArreglo = sinNegativos.map(objeto => ({
            ...objeto,
            MID: selectedOption
        }));

        let contenidoEnviarActualizar = JSON.stringify({ command: "actualizarParametrosMID", dataDetalleMID: nuevoArreglo });
        actualizarEnviar(contenidoEnviarActualizar);
    };

    const actualizarEnviar = (contenidoEnviarActualizar) => {
/*         console.log("contenidoEnviarActualizar", contenidoEnviarActualizar)
 */        sendMessage(`${contenidoEnviarActualizar}`)
        setActualizado(true)
        /* setDatosModificacion({}) */
        setDatosBQS("KOKO")
    }

    //!VER EN QUE COLUMNA ESTOY PARA COLOR
    const handleColumnaClick = (index, valor) => {
        if (index == 0) {
            setImagenEncabezado(null);
            setFilaSeleccionada(null);
        }

    }

    return (
        <div>
            {/* {{(listarBQS["ultimosDatosObtenidos"] &&  botonConfiguracion) ? }<button className='button-59 menuConfiguracion' onClick={() => handleClickOpen()}>
                CONFIGURACION</button>{ :
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<Dots />}
                    class={` buttonDesabilitado`}
                >
                    CONFIGURACION
                </Button>
                }} */}

            {botonConfiguracion == true ?
                <button className='button-59 menuConfiguracion' onClick={() => handleClickOpen()}>
                    CONFIGURACION
                </button> :
                <button className='buttonDesabilitado menuConfiguracion' disabled onClick={() => handleClickOpen()}>
                    CONFIGURACION
                </button>
            }


            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                maxWidth="md"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <div className='tituloDeTablas'>
                        Control Modificación Parámetros
                    </div>

                </DialogTitle>
                <DialogContent>
                    <div>
                        <FormControl className={classes.formControl} style={{ width: "35%", marginTop: "0.5vw" }}>
                            <InputLabel htmlFor="uncontrolled-native" style={{ fontSize: "18px", color: "#0504B5", fontFamily: "bold" }}>SELECCIONAR BLOQUEADOR</InputLabel>
                            <NativeSelect
                                /* defaultValue={null} */
                                style={{ marginTop: "5vw" }}
                                value={selectedOption.length > 1 ? selectedOption : ""}
                                onChange={handleChangeClick}
                                inputProps={{
                                    name: 'name',
                                    id: 'uncontrolled-native',
                                }}
                            /* disabled={seleccionHabilitar} */
                            >
                                <option disabled value={null}></option>
                                {Object.keys(listarBQS).length > 0 && (listarBQS["mids"]).map(({ id, mid, nombre }, index) => (
                                    <option value={mid} key={index}>{nombre}</option>
                                ))}

                            </NativeSelect>
                            {actualizado == true ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}> ACTUALIZANDO</FormHelperText > :
                                (actualizado == false ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", fontSize: "15px", marginTop: "1vw" }}> ACTUALIZADO </FormHelperText> : <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}> SELECCIONAR  </FormHelperText>)}
                            {<FormHelperText>{datosBQS == "KO" ? "NO HAY DATOS PARA MOSTRAR" : null}</FormHelperText>}
                        </FormControl>
                    </div>
                    {(Object.keys(datosModificacion).length > 0 && actualizado == false) ?
                        <div>
                            <table className="responsive-table" style={{ backgroundColor: '#d5d5d0' }} >
                                <thead>
                                    <tr align="center">
                                        {columnas.map((valor, index) => (
                                            <th className='columnasConfiguracion' scope="col" key={index} style={{ color: "#190707" }} onClick={() => handleColumnaClick(index, valor)}>{valor}{index == imagenEncabezado && banderaOrdenar == false ? <TiArrowSortedDown /> : (index == imagenEncabezado && banderaOrdenar == true ? <TiArrowSortedUp /> : null)}</th>

                                        ))}
                                    </tr>
                                </thead>
                                <tbody >
                                    {(Object.keys(datosModificacion).length > 0 && Array.isArray(datosModificacion)) && datosModificacion

                                        .map(({ frecuenciaHex, frecuencia, frecCh1Low, frecCh1High, frecCh2Low, frecCh2High, frecCh3Low, frecCh3High, frecCh4Low, frecCh4High, potencia, estadoSW }, index) => (

                                            <tr
                                                key={index}
                                                align="center"
                                                onClick={(e) => handleFilaClick(e, index)}
                                                style={{ color: filaSeleccionada === index ? 'white' : '#190707' }}
                                            >
                                                <th scope="row" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{filaSeleccionada === index ? <TiMediaPlay></TiMediaPlay> : null}</th>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecuenciaHex}</td>

                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecuencia}
                                                </td>

                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecCh1Low}
                                                </td>

                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecCh1High}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecCh2Low}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecCh2High}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecCh3Low}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecCh3High}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecCh4Low}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{frecCh4High}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{potencia}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" contentEditable="true" suppressContentEditableWarning={true} style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{estadoSW}</td>
                                            </tr>

                                        ))}

                                </tbody>

                            </table>
                            <div style={{ display: "flex", justifyContent: "end", alignItems: "center", marginTop: "4vw" ,gap:'10px'}}>
                                <div>
                                    <button className='buttonConfiguracion' onClick={handleClose}>CANCELAR</button>
                                </div>
                                <div style={{ marginLeft: "1vw" }}>
                                    <button className='buttonConfiguracion' onClick={obtenerContenidoTablaEnJSON}>ACTUALIZAR</button>
                                </div>
                                <div>
                                    <Excel data={datosModificacion}></Excel>
                                </div>

                            </div>

                        </div> : ((datosBQS == "KOKO") ? (<div style={{ marginTop: "2vw", margin: '0px 0px 3px 0px', display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress disabled={true} />
                        </div>) : null)}
                </DialogContent>
                {/* <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Subscribe
                    </Button>
                </DialogActions> */}
            </Dialog>
        </div>
    )
}

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default configuracion;