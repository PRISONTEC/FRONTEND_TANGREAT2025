import React, { useContext, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { UserContext } from '../../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import { TiMediaPlay } from "react-icons/ti";
import "../../assets/css/configuracion.scss";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { BsFileBreakFill } from "react-icons/bs";
import "react-activity/dist/library.css";
import { hookAxios } from '../hooks';
import check from '../../assets/imagenes/checkBloqueador.svg';
import preCheck from '../../assets/imagenes/preCheack.gif'



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


const Bloqueador = ({ botonConfiguracion }) => {

    //!VARIABLES
    const [open, setOpen] = React.useState(false);
    const { listarBQS, IPBACKEND,puerto } = useContext(UserContext);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [banderaOrdenar, setBanderaOrdenar] = useState(false);
    const [imagenEncabezado, setImagenEncabezado] = useState(null);
    const [seleccionarBQ, setSeleccionarBQ] = useState("");
    const [visualizarpreCheck, setVisualizarpreCheck] = useState(null);
    const [tipoDeConsulta, setTipoDeConsulta] = useState(null);
    const [datosBloqueadores, setDatosBloqueadores] = useState([]);
    const [nombreMid, setNombreMid] = useState([]);
    const [agregar, setAgregar] = useState({ agregarBq: '', agregarMid: '' });
    const [actualizar, setActualizar] = useState({ actualizarId: '', actualizarBq: '', actualizarMid: '' });
    const [encabezadoBQ,setencabezadoBQ]=useState('')
    const [eliminarId, setEliminarId] = useState('');
    const imageDuration = 6000;


    const classes = useStyles();

    //!USEEFFECT
    useEffect(() => {
        obtenerBloqueadores();
    }, [])


    //!COLUMNA DE LA TABLA
    const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, 'ID', 'MID', 'NOMBRE']


    //!HOOKSAXIOS 
    const { peticionGet, peticionPost, peticionDelete, peticionPut } = hookAxios();

    //!ABRIR Y CERRAR EL MODAL Y GET OBTENER BLOQUEADORES
    const handleClickOpen = () => {
        resetear();
        setTipoDeConsulta(null);
        setVisualizarpreCheck(null);
        obtenerBloqueadores();
        setOpen(true);
    };

    /* const rptaBckEn = await peticionGet(`http://${IPBACKEND}:3100/deudas/${prefijoPenal}`) */

    const handleClose = () => {
        setencabezadoBQ('')
        setActualizar({ 
            ['actualizarId']: '', 
            ['actualizarBq']: '', 
            ['actualizarMid']: '' });

        setDatosBloqueadores([])
        setNombreMid([])
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



    //!PETICION 
    const obtenerBloqueadores = async () => {
        //[{id: 1, mid: 'B900', nombre: 'BQ5-BQ5'}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        const obtenerBloqueadores = await peticionGet(`http://${IPBACKEND}:${puerto[1]}/api/bloqueadores/`);
        if (obtenerBloqueadores && obtenerBloqueadores.length > 0) {
             setDatosBloqueadores(obtenerBloqueadores);
        }
    }

    //!FUNCIONES
    //Todo:Obtener MID
    const obtenerMid = (nombre) => {
        if (datosBloqueadores.length > 0 && nombre != null) {
            const datosNombreBQ = Object.groupBy(datosBloqueadores, dato => {
                return dato.nombre;
            })
            setencabezadoBQ(nombre)
            setActualizar({
                ...actualizar,
                ['actualizarId']:datosNombreBQ[nombre][0].id
            })

            setNombreMid(datosNombreBQ[nombre])
            //{B900: Array(1), BB00: Array(1), D700: Array(1), D800: Array(1), D900: Array(1), …}
       }
    }


    //!Todo:ADD

    const obtenerAgregarBQ = (bq) => {
        setAgregar((prevState) => ({
            ...prevState,
            agregarBq: bq
        }))
    }

    const obtenerAgregarMid = (mid) => {
        setAgregar((prevState) => ({
            ...prevState,
            agregarMid: mid
        }))
    }

    const botonAgregarBQ = async (event) => {
        event.preventDefault();
       setVisualizarpreCheck(null)
        try {
            const add = await peticionPost(`http://${IPBACKEND}:${puerto[1]}/api/bloqueadores/add`, { nombre: agregar.agregarBq, mid: agregar.agregarMid });
             if (add.rowsAffected == 1) {
                setVisualizarpreCheck(true)
                tiempo();
                resetear();
            }
        } catch (error) {
            setVisualizarpreCheck("error")
        }
    }

    //!Todo:Update
    const obtenerActualizarID = (ID) => {
        setActualizar((prevState) => ({
            ...prevState,
            actualizarId: ID
        }))

    }
    const obtenerActualizarBQ = (BQ) => {
        setActualizar(prevState => ({
            ...prevState,
            actualizarBq: BQ
        }))

    }
    const obtenerActualizarMid = (MID) => {
        setActualizar(prevState => ({
            ...prevState,
            actualizarMid: MID
        }))

    }
    const botonActualizarBQ = async (event) => {
        event.preventDefault();
        if(actualizar.actualizarId.length===0) return  alert("Completa los campos")
       setVisualizarpreCheck(null)
        try {
            const update = await peticionPut(`http://${IPBACKEND}:${puerto[1]}/api/bloqueadores/update/${actualizar.actualizarId}`, { id: actualizar.actualizarId, mid: actualizar.actualizarMid, nombre: actualizar.actualizarBq })
            if (update) {
                setVisualizarpreCheck(true)
                tiempo();
                resetear();
            }
        } catch (error) {
            setVisualizarpreCheck("error")
        }
    }

    //Todo:DELETE
    const obtenerEliminarID = (ID) => {
        setEliminarId(ID)
    }

    const botonEliminarBQ = async (event) => {
        event.preventDefault();
        if(actualizar.actualizarId.length===0) return  alert("Completa los campos")
        setVisualizarpreCheck(null)
        try {
            const delete1 = await peticionDelete(`http://${IPBACKEND}:${puerto[1]}/api/bloqueadores/del/${actualizar.actualizarId}`);
            if (delete1.rowsAffected == 1) {
                setVisualizarpreCheck(true)
                tiempo();
                resetear();
            }
        } catch (error) {
            setVisualizarpreCheck("error")
        }
    }

    //!timout
    const tiempo = () => {
        setTimeout(() => {
            setVisualizarpreCheck(false)
        }, 2000);
    }



    //!BOTONES DE BLOQUEADOR
    const mostrarBloqueadores = () => {
        setVisualizarpreCheck(null)
        setTipoDeConsulta(1)
    }
    const agregarBloqueadores = () => {
        setVisualizarpreCheck(null)
        setTipoDeConsulta(2)
    }

    const actualizarBloqueadores = () => {
        setVisualizarpreCheck(null)
        setTipoDeConsulta(3)
    }

    const eliminarBloqueadores = () => {
        setVisualizarpreCheck(null)
        setTipoDeConsulta(4)
    }

    //!RESETAER VALORES BLOQUEADFORES
    const resetear = () => {
        setDatosBloqueadores([])
        setNombreMid([])
        obtenerBloqueadores();
    }



    return (
        <div>
            {botonConfiguracion == true ?
                <button className='button-59 menuConfiguracion' onClick={() => handleClickOpen()}>
                    BLOQUEADOR
                </button> :
                <button className='buttonDesabilitado menuConfiguracion' disabled onClick={() => handleClickOpen()}>
                    BLOQUEADOR
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
                        BLOQUEADOR
                    </div>

                </DialogTitle>
                <DialogContent>
                    <div className='dialogContent'>
                        <div className='selectores'>
                            <label className='selectorNombre'>BQ</label>
                            <select className='selectorOpciones' style={{margin:'0px 5px 0px 5px'}} value={encabezadoBQ || 'Seleccionar'}  onChange={(event) => obtenerMid(event.target.value)}>
                                <option className='opciones' disabled style={{background:'white'}} value='Seleccionar' >Seleccionar</option>
                                {datosBloqueadores.map(({ nombre },index) => (
                                    <option type='button' value={nombre} key={index}>{nombre}</option>
                                ))}

                            </select>
                        </div>
                        <div className='selectores'>
                            <label className='selectorNombre'>MID</label>
                            <select className='selectorOpciones' style={{margin:'0px 5px 0px 5px'}}>
                                {nombreMid.map(({ mid},index) => (
                                    <option type='button' value={mid} key={index}>{mid}</option>
                                ))}
                            </select>
                        </div>

                        <div className='selectores'>
                            <label className='selectorNombre'>ID</label>
                            <select className='selectorOpciones' style={{margin:'0px 5px 0px 5px'}}>
                                {nombreMid.map(({ id},index) => (
                                    <option type='button' value={id} key={index}>{id}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <div className='operacionBloqueadores'>
                        <div className='encabezado'>
                            <button style={{background: tipoDeConsulta==1?'#907D06':null}} className='cabeceraOpciones primary' onClick={() => mostrarBloqueadores()}>MOSTRAR BLOQUEADORES</button>
                            <button style={{background: tipoDeConsulta==2?'#907D06':null}} className='cabeceraOpciones primary' onClick={() => agregarBloqueadores()}>AGREGAR</button>
                            <button style={{background: tipoDeConsulta==3?'#907D06':null}} className='cabeceraOpciones primary' onClick={() => actualizarBloqueadores()}>ACTUALIZAR</button>
                            <button style={{background: tipoDeConsulta==4?'#907D06':null}} className='cabeceraOpciones primary' onClick={() => eliminarBloqueadores()}>ELIMINAR</button>
                        </div>
                        <div>
                            {tipoDeConsulta == 1 &&
                                <div>
                                    <table className="responsive-table" style={{ backgroundColor: '#d5d5d0' }} >
                                        <thead>
                                            <tr align="center">
                                                {columnas.map((valor, index) => (
                                                    <th className='columnasConfiguracion' scope="col" key={index} style={{ color: "#190707" }} onClick={() => handleColumnaClick(index, valor)}>{valor} {index == imagenEncabezado && banderaOrdenar == false && <TiArrowSortedDown />} </th>

                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {datosBloqueadores.map(({ id, mid, nombre }, index) => (
                                                <tr
                                                    key={index}
                                                    align="center"
                                                    onClick={(e) => handleFilaClick(e, index)}
                                                    style={{ color: filaSeleccionada === index ? 'white' : '#190707' }}
                                                >
                                                    <th scope="row" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{filaSeleccionada === index ? <TiMediaPlay></TiMediaPlay> : null}</th>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{id}</td>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }} >{mid}</td>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }} >{nombre}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                       
                            {tipoDeConsulta == 2 &&
                            <form onSubmit={botonAgregarBQ}>
                                <div className='agregarBQ'>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>BQ</label>
                                        <input className='digitarOpciones' type='text'  style={{ width: '20vw' }} required value={agregar.agregarBq} onChange={(e) => obtenerAgregarBQ(e.target.value)}></input>
                                    </div>
                                    <div  className='digitar'>
                                        <label className='digitarLabel'>Mid</label>
                                        <input className='digitarOpciones' style={{ width: '20vw' }} type='text' required value={agregar.agregarMid} onChange={(e) => obtenerAgregarMid(e.target.value)}></input>
                                    </div>
                                    <div>
                                        <button type='submit' className={`botonAxios`}   /* disabled={agregar.agregarMid.length || agregar.agregarBq.length===0}  */ /* onClick={() => botonAgregarBQ()} */>Agregar</button>
                                    </div>
                                </div>
                                </form>
                            }

                            {tipoDeConsulta == 3 &&
                             <form onSubmit={botonActualizarBQ}>
                                <div className='actualizarBQ'>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>ID</label>
                                        <input className='digitarOpciones' type='number' style={{ width: '10vw',background:'#cbf9f6',color:'black' }}  disabled value={actualizar.actualizarId}  onChange={(e) => obtenerActualizarID(e.target.value)}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>BQ</label>
                                        <input className='digitarOpciones' type='text' style={{ width: '10vw' }} required value={actualizar.actualizarBq} onChange={(e) => obtenerActualizarBQ(e.target.value)}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Mid</label>
                                        <input className='digitarOpciones' style={{ width: '10vw' }} type='text' required value={actualizar.actualizarMid} onChange={(e) => obtenerActualizarMid(e.target.value)}></input>
                                    </div>
                                    <div>
                                        <button type='submit' className='botonAxios'>Actualizar</button>
                                    </div>
                                </div>
                                </form>
                            }
                            {tipoDeConsulta == 4 &&
                            <form onSubmit={botonEliminarBQ}>
                                <div className='eliminarBQ'>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>ID</label>
                                        <input className='digitarOpciones' type='number' style={{ width: '10vw',background:'#cbf9f6',color:'black' }} required disabled value={actualizar.actualizarId} onChange={(e) => obtenerEliminarID(e.target.value)}></input>
                                    </div>
                                    <div>
                                        <button type='submit' className='botonAxios' /* disabled={eliminarId == ''} */ /* onClick={() => botonEliminarBQ()} */>Eliminar</button>
                                    </div>
                                </div>
                                </form>
                            }
                        </div>
                        <div className='imagenCheck'>
                            {tipoDeConsulta == 2 && visualizarpreCheck == true ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={preCheck} alt='check1'></img> :
                                (tipoDeConsulta == 2 && visualizarpreCheck == false ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={check} alt='check1'></img> : (
                                    tipoDeConsulta == 2 && visualizarpreCheck == "error" ? <div className="alert errorDatos" style={{ animationDuration: `${imageDuration}ms` }}>
                                        <span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                                        <strong>Verificar!</strong> que los datos ingresados sean correctos.
                                    </div> : null
                                ))}

                            {tipoDeConsulta == 3 && visualizarpreCheck == true ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={preCheck} alt='check1'></img> :
                                (tipoDeConsulta == 3 && visualizarpreCheck == false ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={check} alt='check1'></img> : (
                                    tipoDeConsulta == 3 && visualizarpreCheck == "error" ? <div className="alert errorDatos" style={{ animationDuration: `${imageDuration}ms` }}>
                                        <span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                                        <strong>Verificar!</strong> que los datos ingresados sean correctos.
                                    </div> : null
                                ))}

                            {tipoDeConsulta == 4 && visualizarpreCheck == true ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={preCheck} alt='check1'></img> :
                                (tipoDeConsulta == 4 && visualizarpreCheck == false ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={check} alt='check1'></img> : (
                                    tipoDeConsulta == 4 && visualizarpreCheck == "error" ? <div className="alert errorDatos" style={{ animationDuration: `${imageDuration}ms` }}>
                                        <span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                                        <strong>Verificar!</strong> que los datos ingresados sean correctos.
                                    </div> : null
                                ))}





                            {/*  {tipoDeConsulta == 3 && visualizarpreCheck == true ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={preCheck} alt='check1'></img> :
                                (tipoDeConsulta == 3 && visualizarpreCheck == false ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={check} alt='check1'></img> : null)}
                            {tipoDeConsulta == 4 && visualizarpreCheck == true ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={preCheck} alt='check1'></img> :
                                (tipoDeConsulta == 4 && visualizarpreCheck == false ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={check} alt='check1'></img> : null)}



                            {tipoDeConsulta == 2 && visualizarpreCheck == 'error' ?
                                <div className="alert">
                                    <span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                                    <strong>Danger!</strong> Indicates a dangerous or potentially negative action.
                                </div> : null
                            } */}


                        </div>

                    </div>
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

export default Bloqueador;


/* : ((umbralesVisualizar == true) ? (<div style={{ marginTop: "2vw", margin: '0px 0px 3px 0px', display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress disabled={true} />
                        </div>) : null)} */

/* {umbralesVisualizar == true ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}> ACTUALIZANDO</FormHelperText > :
(dataUmbrales && dataUmbrales.length > 0 ? <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", fontSize: "15px", marginTop: "1vw" }}> ACTUALIZADO </FormHelperText> :
    <FormHelperText style={{ color: "#CA4C31", fontFamily: "Fantasy", marginTop: "1vw" }}> SELECCIONAR  </FormHelperText>)}
{<FormHelperText>{dataUmbrales && dataUmbrales.length == 0 ? "NO HAY DATOS PARA MOSTRAR" : null}</FormHelperText>} */