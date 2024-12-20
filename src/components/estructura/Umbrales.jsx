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


const Umbrales = ({ sendMessage, botonConfiguracion }) => {
    const [open, setOpen] = React.useState(false);
    const { listarBQS, selectedOption, dataUmbrales, setDataUmbrales, setUmbralesVisualizar, umbralesVisualizar } = useContext(UserContext);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [banderaOrdenar, setBanderaOrdenar] = useState(false);
    const [imagenEncabezado, setImagenEncabezado] = useState(null);
    const [seleccionarBQ, setSeleccionarBQ] = useState("")

    const classes = useStyles();

    //!AGREGAR COLUMNAS
    const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, "Modulo", "FrecMin", "FrecMax", "PotMin", "PotMax", "Canales"];

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


    //!ELEMENTO SELECCIONADO BLOQUEADOR Y REALIZAR CONSULA
    const handleChangeClick = (event) => {
        setUmbralesVisualizar(true)
        setSeleccionarBQ(event.target.value)
        setDataUmbrales(null)
/*         console.log("umbral", `{"command": "consultarUmbrales", "mid":"${event.target.value}"}`)
 */        sendMessage(`{"command": "consultarUmbrales", "mid":"${event.target.value}"}`)
    };

    return (
        <div>
            {botonConfiguracion == true ?
                <button className='button-59 menuConfiguracion' onClick={() => handleClickOpen()}>
                    UMBRALES
                </button> :
                <button className='buttonDesabilitado menuConfiguracion' disabled onClick={() => handleClickOpen()}>
                    UMBRALES
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
                        UMBRALES
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
                            {umbralesVisualizar == true ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}> ACTUALIZANDO</FormHelperText > :
                                (dataUmbrales && dataUmbrales.length > 0 ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", fontSize: "15px", marginTop: "1vw" }}> ACTUALIZADO </FormHelperText> :
                                    <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}> SELECCIONAR  </FormHelperText>)}
                            {<FormHelperText>{dataUmbrales && dataUmbrales.length == 0 ? "NO HAY DATOS PARA MOSTRAR" : null}</FormHelperText>}
                        </FormControl>
                    </div>
                    {(dataUmbrales && umbralesVisualizar == false && dataUmbrales.length > 0) ?
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
                                    {(dataUmbrales && umbralesVisualizar == false && dataUmbrales.length > 0) && dataUmbrales

                                        .map(({ modulo, FrecMin, FrecMax, PotMin, PotMax, Canales }, index) => (

                                            <tr
                                                key={index}
                                                align="center"
                                                onClick={(e) => handleFilaClick(e, index)}
                                                style={{ color: filaSeleccionada === index ? 'white' : '#190707' }}
                                            >
                                                <th scope="row" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{filaSeleccionada === index ? <TiMediaPlay></TiMediaPlay> : null}</th>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{modulo}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }} >{FrecMin}
                                                </td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{FrecMax}
                                                </td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{PotMin}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{PotMax}</td>
                                                <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{Canales}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div> : ((umbralesVisualizar == true) ? (<div style={{ marginTop: "2vw", margin: '0px 0px 3px 0px', display: "flex", justifyContent: "center", alignItems: "center" }}>
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

export default Umbrales;