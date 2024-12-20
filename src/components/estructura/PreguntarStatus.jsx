import React, { useContext, useState } from 'react';
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
import { TiMediaPlay } from "react-icons/ti";
import "../../assets/css/configuracion.scss";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { BsFileBreakFill } from "react-icons/bs";
import CircularProgress from '@material-ui/core/CircularProgress';
import "react-activity/dist/library.css";
import check from '../../assets/imagenes/check.svg'
import error from '../../assets/imagenes/error.svg'


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


const PreguntarStatus = ({ sendMessage,botonConfiguracion }) => {
    const [open, setOpen] = React.useState(false);
    const { listarBQS, selectedOption, dataStatus, setDataStatus, setStatusVisualizar, statusVisualizar } = useContext(UserContext);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [banderaOrdenar, setBanderaOrdenar] = useState(false);
    const [imagenEncabezado, setImagenEncabezado] = useState(null);
    const [seleccionarBQ, setSeleccionarBQ] = useState("")

    const classes = useStyles();

    //!AGREGAR COLUMNAS
    const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, "Modulo", "TramaHex", "Potencia", "Voltaje", "Temperatura", "Corriente", "FechaHora"];

    //!ABRIR Y CERRAR EL MODAL
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //!COLOR DE FONDO A FILAS

    const handleColumnaClick = (index, valor) => {
        if (index == 0) {
            setImagenEncabezado(null);
            setFilaSeleccionada(null);
        }

    }

    const handleFilaClick = (e, index) => {
        setFilaSeleccionada(index);
    };

    //!CONVERTIR EPOCH A FECHA D/M/A

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

    //!ELEMENTO SELECCIONADO BLOQUEADOR Y REALIZAR CONSULTA
    const handleChangeClick = (event) => {
        setStatusVisualizar(true)
        setSeleccionarBQ(event.target.value)
        setDataStatus(null)
/*         console.log("umbral", `{"command": "preguntarStatusOneMID", "mid":"${event.target.value}"}`)
 */        sendMessage(`{"command": "preguntarStatusOneMID", "mid":"${event.target.value}"}`)
    };

    return (
        <div>
            {botonConfiguracion == true ?
                <button className='button-59 menuConfiguracion' onClick={() => handleClickOpen()}>
                    PREGUNTAR STATUS
                </button> :
                <button className='buttonDesabilitado menuConfiguracion' disabled onClick={() => handleClickOpen()}>
                    PREGUNTAR STATUS
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
                        PREGUNTAR STATUS
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div>
                        <FormControl className={classes.formControl} style={{ width: "35%", marginTop: "0.5vw" }}>
                            <InputLabel htmlFor="uncontrolled-native" style={{ fontSize: "18px", color: "#0504B5", fontFamily: "bold" }}>SELECCIONAR BLOQUEADOR</InputLabel>
                            <NativeSelect
                                /* defaultValue={null} */
                                style={{ marginTop: "5vw" }}
                                value={seleccionarBQ.length > 1 ? seleccionarBQ : ""}
                                onChange={handleChangeClick}
                                inputProps={{
                                    name: 'name',
                                    id: 'uncontrolled-native',
                                }}
                            /* disabled={seleccionHabilitar} */
                            >
                                <option disabled value={null}></option>
                                {/*Lista de los bq */}
                                {Object.keys(listarBQS).length > 0 && (listarBQS["mids"]).map(({ id, mid, nombre }, index) => (
                                    <option value={mid} key={index}>{mid}</option>
                                ))}

                            </NativeSelect>
                            {statusVisualizar == true ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}> ACTUALIZANDO</FormHelperText > :
                                (dataStatus && dataStatus.length > 0 ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", fontSize: "15px", marginTop: "1vw" }}> ACTUALIZADO </FormHelperText> :
                                    <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}> SELECCIONAR  </FormHelperText>)}
                            {<FormHelperText>{dataStatus && dataStatus.length == 0 ? "NO HAY DATOS PARA MOSTRAR" : null}</FormHelperText>}
                        </FormControl>
                    </div>
                    {(dataStatus && statusVisualizar == false && dataStatus.length > 0) ?
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
                                    {(dataStatus && statusVisualizar == false && dataStatus.length > 0) && dataStatus

                                        .map(({ modulo, tramaHex, potencia, voltaje, temperatura, corriente, fechaHoraReporte }, index) => (

                                            <tr
                                                key={index}
                                                align="center"
                                                onClick={(e) => handleFilaClick(e, index)}
                                                style={{ color: filaSeleccionada === index ? 'white' : '#190707' }}
                                            >
                                                <th scope="row" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{filaSeleccionada === index ? <TiMediaPlay></TiMediaPlay> : null}</th>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{modulo}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{(tramaHex.length > 2 ? <img style={{ width: '4vh' }} src={check}></img> : <img style={{ width: '3vh' }} src={error}></img>)}
                                                </td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{potencia}
                                                </td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{voltaje}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{temperatura}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{corriente}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{convertirEpochAFecha(fechaHoraReporte)}</td>

                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div> : ((statusVisualizar == true) ? (<div style={{ marginTop: "2vw", margin: '0px 0px 3px 0px', display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress disabled={true} />
                        </div>) : null)}
                </DialogContent>
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

export default PreguntarStatus;