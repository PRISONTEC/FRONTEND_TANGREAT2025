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
import yonlitBien from '../../assets/imagenes/yonlitBien.svg'
import yonlitMal from '../../assets/imagenes/yonlitMal.svg'


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


const YonlitComando = ({ sendMessage, botonConfiguracion }) => {
    const [open, setOpen] = React.useState(false);

    const { datosBQS, listarBQS, selectedOption, tiempo, dataUmbrales, setDataUmbrales, setYonlitVisualizar, yonlitVisualizar, dataYonlit, setDataYonlit } = useContext(UserContext);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [banderaOrdenar, setBanderaOrdenar] = useState(false);
    const [imagenEncabezado, setImagenEncabezado] = useState(null);
    const [obtenerYonlit, setObtenerYonlit] = useState(null);
    const valor = false;

    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    //!ELEMENTO SELECCIONADO BLOQUEADOR
    const handleChangeClick = (event) => {
        setDataUmbrales([])  //variable para obtener la data de regreso
        setYonlitVisualizar(true)
        //sendMessage(`{"command": "consultarUmbrales", "mid":"${event.target.value}"}`)
    };

    //!ENVIAR COMANDO PARA PRENDER Y APAGAR YONLIT
    const imputYonlit = (e) => {
        setYonlitVisualizar(null)
        setObtenerYonlit(e.target.value)
    }

    const controlYonlit = () => {
        setYonlitVisualizar(true)
        setDataYonlit(null)
        setDataYonlit(null)
        console.log(`{"command": "OnOffYonlit", "address":"${obtenerYonlit}"}`)
        sendMessage(`{"command": "OnOffYonlit", "address":"${obtenerYonlit}"}`)
    };

    return (
        <div >
            {botonConfiguracion == true ?
                <button className='button-59 menuConfiguracion' onClick={() => handleClickOpen()}>
                    YONLIT COMANDO
                </button> :
                <button className='buttonDesabilitado menuConfiguracion' disabled onClick={() => handleClickOpen()}>
                    YONLIT COMANDO
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
                    CONTROL YOLINT
                </DialogTitle>
                <DialogContent>
                    <div>
                        <FormControl className={classes.formControl} style={{ width: "35%", marginTop: "0.5vw" }}>
                            <InputLabel htmlFor="uncontrolled-native" style={{ fontSize: "18px", color: "#0504B5", fontFamily: "bold", marginTop: '-30px', width: '23vh' }}>INGRESAR DATOS</InputLabel>
                            <div className="input-group input-group-sm mb-3" style={{ paddingTop: '20px' }}>
                                <span className="input-group-text botonEnviar" id="inputGroup-sizing-sm" type='Button' onClick={() => controlYonlit()}>Enviar</span>
                                <input value={obtenerYonlit} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={(e) => imputYonlit(e)} />
                            </div>
                            {/* <NativeSelect>
                            </NativeSelect> */}
                            {yonlitVisualizar == true ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", margin: "0px 0px 1vh 10vh" }}> ACTUALIZANDO</FormHelperText > :
                                (yonlitVisualizar == false ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", fontSize: "15px", margin: "0px 0px 0px 0vh" }}>
                                    
                                    {dataYonlit && dataYonlit ["comando"] && <div style={{ width: "400px", background: "#ffff" }}>
                                        {dataYonlit["potencia"]=="-1"?<div style={{ color: "#CA4C31", fontFamily: "Fantasy", fontSize: "15px", margin: "0px 0px 0px 0vh",width:"400px" }}>ERROR EN LA ACTUALIZACION</div>:
                                        <div style={{ color: "#CA4C31", fontFamily: "Fantasy", fontSize: "15px", margin: "0px 0px 0px 0vh" }}>ACTUALIZADO</div>}
                                        <table>
                                            <tr style={{border:"2px solid black",color:"#1E1D1D"}}>
                                                <td style={{padding:"2px",border:"2px solid #D6D2D1",whiteSpace:"pre-wrap"}}>Comando</td>
                                                <td style={{padding:"2px",border:"2px solid #D6D2D1"}}>HexReceived</td>
                                                <td style={{padding:"2px",border:"2px solid #D6D2D1"}}>Temperatura</td>
                                                <td style={{padding:"2px",border:"2px solid #D6D2D1"}}>Potencia</td>

                                            </tr>
                                            <tr style={{border:"2px solid black",color:"#1A45AF ",textAlign:"center"}}>
                                                <td style={{border:"2px solid #D6D2D1"}}>{dataYonlit["comando"]}</td>
                                                <td style={{border:"2px solid #D6D2D1"}}>{dataYonlit["hexReceived"]}</td>
                                                <td style={{border:"2px solid #D6D2D1"}}>{dataYonlit["temperatura"]}</td>
                                                <td style={{border:"2px solid #D6D2D1"}}>{dataYonlit["potencia"]}</td>
                                            </tr>
                                        </table>

                                    </div>}

                                </FormHelperText> :
                                    <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}>   </FormHelperText>)}
                            {<FormHelperText>{yonlitVisualizar == "KO" ? "NO HAY DATOS PARA MOSTRAR" : null}</FormHelperText>}
                        </FormControl>
                    </div>
                    {dataYonlit == 'OK' && yonlitVisualizar == false ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={yonlitBien} style={{ width: '10vh' }}></img>
                        </div> :
                        ((dataYonlit == 'KO' && yonlitVisualizar == false ? <div style={{ display: 'flex', justifyContent: 'center' }}><img src={yonlitMal} style={{ width: '10vh' }}></img></div> :
                            (yonlitVisualizar == true ? (<div style={{ marginTop: "2vw", margin: '0px 0px 3px 0px', display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress disabled={true} /></div>)
                                : null
                            )))}
                </DialogContent>
            </Dialog>
        </div>
    )
}

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[className*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default YonlitComando;