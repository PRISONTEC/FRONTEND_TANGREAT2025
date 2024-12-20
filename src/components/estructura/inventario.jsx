import React, { useContext, useState, useEffect, useRef } from 'react';
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
import preCheck from '../../assets/imagenes/preCheack.gif';
import Tabla from '../tabla/tabla';

//9008 y 9008

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


const Inventario = ({ botonConfiguracion }) => {

    //!Context
    const { listarBQS, IPBACKEND,puerto,prefijo } = useContext(UserContext);

    //!VARIABLES
    const [open, setOpen] = React.useState(false);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [imagenEncabezado, setImagenEncabezado] = useState(null);
    const [visualizarpreCheck, setVisualizarpreCheck] = useState(null);
    const [tipoDeConsulta, setTipoDeConsulta] = useState(null);
    const [datosInventario, setDatosInventario] = useState([]);
    const [nombreBanda, setNombreBanda] = useState([]);
    const [id, setId] = useState({ id: null, tramaInt: null });
    const [selectDataMid, setSelectDataMid] = useState([]);
    const [fechaPorDefecto,setFechaPorDefecto]=useState(new Date())
    const imageDuration = 6000;
    const [values,setValues]=useState({
        mid:'',
        fecha:'',
        id:'',
        banda:''
    });

    //agregar
    const bandaRef=useRef('');
    const fhUltimoReporteRef=useRef('');
    const midRef=useRef('');
    const paraEstadisticaRef=useRef('');
    const prefijoPenalRef=useRef('');
    const tramaIntRef=useRef('');

    //actualizar
        //banda: actualizar.actualizarBanda,fhUltimoReporte:actualizar.fecha,id:actualizar.actualizarId,mid:actualizar.actualizarMid,paraEstadistica:
        //actualizar.actualizarEstadistica,prefijoPenal:actualizar.actualizarprefijoPenal,tramaInt:actualizarTramaInt
    const actualizarbandaRef=useRef('');
    const actualizarfhUltimoReporteRef=useRef('');
    const actualizaridRef=useRef('');
    const actualizarmidRef=useRef('');
    const actualizarparaEstadisticaRef=useRef('');
    const actualizarprefijoPenalRef=useRef('');
    const actualizartramaIntRef=useRef('');

    //ELIMINAR
    const eliminaridRef=useRef('');

    //boton activo
    const colorBotonActivo=useRef('')


    const classes = useStyles();

    //!USEEFFECT
    useEffect(() => {
        obtenerInventario();
        fechasObtener();
    }, [])


    //!COLUMNA DE LA TABLA
    /*  const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, 'ID', 'PENAL', 'MID', 'BANDA', 'FECHA', 'TramaInt', 'Estadistica']
     */
    const columnas = [{ nombre: 'ID', key: 'id', filtro: false }, { nombre: 'PENAL', key: 'prefijoPenal', filtro: false }, { nombre: 'MID', key: 'mid', filtro: true }, { nombre: 'BANDA', key: 'banda', filtro: true }, { nombre: 'Fh_Reporte', key: 'fhUltimoReporte', filtro: false }, { nombre: 'TramaInt', key: 'tramaInt', filtro: false }, { nombre: 'ESTADISTICA', key: 'paraEstadistica', filtro: false }];
    
    //!HOOKSAXIOS 
    const { peticionGet, peticionPost, peticionDelete, peticionPut } = hookAxios();

    //!ABRIR Y CERRAR EL MODAL Y GET OBTENER BLOQUEADORES
    const handleClickOpen = () => {
        resetear();
        setTipoDeConsulta(null)
        setVisualizarpreCheck(null)
        obtenerInventario();
        setOpen(true);
    };

    /* const rptaBckEn = await peticionGet(`http://${IPBACKEND}:3100/deudas/${prefijoPenal}`) */

    const handleClose = () => {
        setDatosInventario([])
        setNombreBanda([])
        /* setSelectDataMid([]) */
        setId((prevState) => ({
            ...prevState,
            id: '',
            tramaInt: ''
        }))
        setValues({
            mid:'',
            fecha:'',
            id:'',
            banda:''
        })
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
    const obtenerInventario = async () => {
        //[{"banda": "700","fhUltimoReporte": 0,"id": 1,"mid": "B900","paraEstadistica": 0,"prefijoPenal": "121","tramaInt": "10"}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        const obtenerInventario = await peticionGet(`http://${IPBACKEND}:${puerto[1]}/api/inventario/`);
        if (obtenerInventario && obtenerInventario.length > 0) {
            const datosNombreBQ = Object.groupBy(obtenerInventario, dato => {
                return dato.mid;
            })
            setSelectDataMid(Object.keys(datosNombreBQ))
            setDatosInventario(obtenerInventario);
        }
    }

    //!FUNCIONES
    //Todo:Obtener BANDA
    const obtenerBanda = (mid) => {
        if (datosInventario.length > 0 && mid != null && mid !='seleccionar') {
            setId((prevState) => ({
                ...prevState,
                id: '',
                tramaInt: ''
            }))
            setValues({
                ...values,
                ['mid']:mid,
                ['banda']:''
            })
            const datosNombreBQ = Object.groupBy(datosInventario, dato => {
                return dato.mid;
            })
            //{B900: Array(1), BB00: Array(1), D700: Array(1), D800: Array(1), D900: Array(1), …}
            setNombreBanda(datosNombreBQ[mid])
            //[{banda: '700', fhUltimoReporte: 0, id: 14, mid: 'D700', paraEstadistica: 0, …}, {…}, {…}, {…}, {…}, {…}]
        }else{
            setNombreBanda([])
            setId((prevState) => ({
                ...prevState,
                id: null,
                tramaInt: null
            }))
        }
    }

    //TODO:OBTENER ID
    const obtenerId = (bandaTrama) => {
        if(bandaTrama!='seleccionar'){
            let objetoDatos = JSON.parse(bandaTrama)
            setValues({
                ...values,
                ['banda']:bandaTrama
            })
            nombreBanda.map((datos) => {
                if (objetoDatos.banda == datos.banda && objetoDatos.trama == datos.tramaInt) {
                    setId((prevState) => ({
                        ...prevState,
                        id: datos.id,
                        tramaInt: datos.tramaInt
                    }))
                    /* setId(datos.id)  */
                }
            })
        }else{
            setId((prevState) => ({
                ...prevState,
                id: '',
                tramaInt: ''
            }))
        }

    }

    //!Todo:ADD

    const botonAgregarBQ = async () => {
        if(bandaRef.current.value.length==0 || fechaPorDefecto.length==0 || midRef.current.value.length==0 || paraEstadisticaRef.current.value.length==0 || prefijoPenalRef.current.value.length==0 || tramaIntRef.current.value.length==0) return alert('Completa los campos')
        setVisualizarpreCheck(null)
        const fecha = new Date(fhUltimoReporteRef.current.value); 
        const fechaFinEstado = fecha.getTime() / 1000;
        try {
                const add = await peticionPost(`http://${IPBACKEND}:${puerto[1]}/api/inventario/add`, { 
                    banda: bandaRef.current.value, fhUltimoReporte: fechaFinEstado, mid: midRef.current.value, 
                    paraEstadistica:paraEstadisticaRef.current.value, prefijoPenal:prefijoPenalRef.current.value, 
                    tramaInt:tramaIntRef.current.value });
                if (add.rowsAffected == 1) {
                    setVisualizarpreCheck(true)
                    tiempo();
                    resetear();
                    setValues({
                        mid:'',
                        fecha:'',
                        id:'',
                        banda:''
                    })

                    bandaRef.current.value = ''; 
                    /* fhUltimoReporteRef.current.value = new Date(); */  // O cualquier valor por defecto que quieras
                    midRef.current.value = ''; 
                    paraEstadisticaRef.current.value = ''; 
                    /* prefijoPenalRef.current.value = prefijo;  */ // Si tienes un valor por defecto para prefijo
                    tramaIntRef.current.value = ''; 
                    setFechaPorDefecto(new Date())
                }
        } catch (error) {
            setVisualizarpreCheck("error")
        }
    }

    //!Todo:Update
    const botonActualizarBQ = async () => {
        if(actualizarbandaRef.current.value.length==0 || fechaPorDefecto.length==0 || actualizaridRef.current.value.length==0 || actualizarmidRef.current.value.length==0 || actualizarparaEstadisticaRef.current.value.length==0 || actualizarprefijoPenalRef.current.value.length==0 || actualizartramaIntRef.current.value.length==0) return alert('Completa los campos')
        setVisualizarpreCheck(null)
        const fecha = new Date(actualizarfhUltimoReporteRef.current.value); 
        const fechaFinEstado = fecha.getTime() / 1000;
        try {
                const update = await peticionPut(`http://${IPBACKEND}:${puerto[1]}/api/inventario/update/${actualizaridRef.current.value}`, 
                    { banda: actualizarbandaRef.current.value, fhUltimoReporte: fechaFinEstado, id: actualizaridRef.current.value, 
                        mid: actualizarmidRef.current.value, paraEstadistica: actualizarparaEstadisticaRef.current.value, 
                        prefijoPenal: actualizarprefijoPenalRef.current.value, tramaInt: actualizartramaIntRef.current.value })
                    if (update) {
                    setVisualizarpreCheck(true)
                    tiempo();
                    resetear();
                    setValues({
                        mid:'',
                        fecha:'',
                        id:'',
                        banda:''
                    })
                    actualizarbandaRef.current.value = ''; 
                   /*  actualizarfhUltimoReporteRef.current.value = ''; */  // O cualquier valor por defecto
                    actualizaridRef.current.value = ''; 
                    actualizarmidRef.current.value = ''; 
                    actualizarparaEstadisticaRef.current.value = ''; 
                    /* actualizarprefijoPenalRef.current.value = ''; */ 
                    actualizartramaIntRef.current.value = ''; 
                    setFechaPorDefecto(new Date())
                }
        } catch (error) {
            setVisualizarpreCheck("error")
        } 
    }

    //Todo:DELETE
    const botonEliminarBQ = async () => {
        if(eliminaridRef.current.value.length==0) return alert('Complete los campos')
       setVisualizarpreCheck(null)
        try {
                const delete1 = await peticionDelete(`http://${IPBACKEND}:${puerto[1]}/api/inventario/del/${eliminaridRef.current.value}`);
                if (delete1.rowsAffected == 1) {
                    setVisualizarpreCheck(true)
                    tiempo();
                    resetear();
                    setValues({
                        mid:'',
                        fecha:'',
                        id:'',
                        banda:''
                    })
                    eliminaridRef.current.value=''
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

    //!Agregar fecha por defecto
    const fechasObtener = () => {
        const fecha = new Date();
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
      
        const fechaFormateada = `${año}-${mes}-${dia}T${horas}:${minutos}`;
        setFechaPorDefecto(fechaFormateada)
      }



    //!BOTONES DE BLOQUEADOR
    const mostrarBloqueadores = () => {
        setTipoDeConsulta(1)
    }
    const agregarBloqueadores = () => {
        setVisualizarpreCheck(null)
        fechasObtener();
        setTipoDeConsulta(2)
    }

    const actualizarBloqueadores = () => {
        setVisualizarpreCheck(null)
        fechasObtener()
        setTipoDeConsulta(3)
    }

    const eliminarBloqueadores = () => {
        setVisualizarpreCheck(null)
        setTipoDeConsulta(4)
    }

    //!RESETAER VALORES BLOQUEADFORES
    const resetear = () => {
        setDatosInventario([])
        setNombreBanda([])
        setSelectDataMid([])
        setId((prevState) => ({
            ...prevState,
            id: '',
            tramaInt: ''
        }))
        obtenerInventario();
    }


    return (
        <div>
            {botonConfiguracion == true ?
                <button className='button-59 menuConfiguracion' onClick={() => handleClickOpen()}>
                    INVENTARIO
                </button> :
                <button className='buttonDesabilitado menuConfiguracion' disabled onClick={() => handleClickOpen()}>
                    INVENTARIO
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
                        INVENTARIO
                    </div>

                </DialogTitle>
                <DialogContent  >
                    <div className='dialogContent'>
                        <div className='selectores'>
                            <label className='selectorNombre' >MID</label>
                            <select className='selectorOpciones' style={{margin:'0px 5px 0px 5px'}} value={values.mid || 'seleccionar'}   onChange={(event) => obtenerBanda(event.target.value)}>
                                <option className='opciones' style={{background:'white'}} disabled value='seleccionar' >Seleccionar</option>
                                {selectDataMid.map((mid, index) => (
                                    <option type='button' value={mid} key={index}>{mid}</option>
                                ))}

                            </select>
                        </div>
                        <div className='selectores'>
                            <label className='selectorNombre'>BANDA</label>
                            <select className='selectorOpciones' style={{margin:'0px 5px 0px 5px'}} value={values.banda || 'seleccionar'} onChange={(event) => obtenerId(event.target.value)}>
                                <option className='opciones' style={{background:'white'}} disabled type='button' value='seleccionar'>Seleccionar</option>
                                {nombreBanda.map(({ banda, tramaInt },index) => (
                                    <option type='button' value={JSON.stringify({ "banda": banda, "trama": tramaInt })} key={index}>{banda}</option>
                                ))}
                            </select>
                        </div>

                        <div className='selectores'>
                            <label className='selectorNombre'>ID</label>
                            <select className='selectorOpciones' style={{margin:'0px 5px 0px 5px'}}>
                                <option type='button' value={id.id} >{id.id}</option>
                            </select>
                        </div>
                        <div className='selectores'>
                            <label className='selectorNombre'>TramaInt</label>
                            <select className='selectorOpciones' style={{margin:'0px 5px 0px 5px'}}>
                                <option type='button' value={id.tramaInt} >{id.tramaInt}</option>
                            </select>
                        </div>

                    </div>
                    <div className='operacionBloqueadores'>
                        <div className='encabezado'>
                            <button style={{background: tipoDeConsulta==1?'#907D06':null}} className='cabeceraOpciones primary' onClick={() => mostrarBloqueadores()}>MOSTRAR INVENTARIO</button>
                            <button style={{background: tipoDeConsulta==2?'#907D06':null}} className='cabeceraOpciones primary' onClick={() => agregarBloqueadores()}>AGREGAR</button>
                            <button style={{background: tipoDeConsulta==3?'#907D06':null}} className='cabeceraOpciones primary' onClick={() => actualizarBloqueadores()}>ACTUALIZAR</button>
                            <button style={{background: tipoDeConsulta==4?'#907D06':null}} className='cabeceraOpciones primary' onClick={() => eliminarBloqueadores()}>ELIMINAR</button>
                        </div>
                        <div>
                            {tipoDeConsulta == 1 &&
                                <div>
                                    <Tabla cabecera={columnas} mostarDatosDeTablas={datosInventario} filtro={true} ></Tabla>
                                </div>
                            }
                            {tipoDeConsulta == 2 &&
                                <div className='agregarBQ'>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Mid</label>
                                        <input className='digitarOpciones' style={{ width: '10vw',background:'#cbf9f6',color:'black' }} disabled type='text' value={values.mid} ref={midRef}></input>
                                    </div>

                                    <div className='digitar'>
                                        <label className='digitarLabel'>Banda</label>
                                        <input className='digitarOpciones' type='number' ref={bandaRef} style={{ width: '10vw' }}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Fecha Reporte</label>
                                        <input id="datetime-local" label="FechaFin" type="datetime-local"  disabled defaultValue={fechaPorDefecto} className='digitarOpciones' style={{background:'#cbf9f6',color:'black'}} /* style={{ width: '20vw' }} */ /* type='number' */ ref={fhUltimoReporteRef}></input>
                                    </div>

                                    <div className='digitar'>
                                        <label className='digitarLabel'>Estadistica</label>
                                        <input className='digitarOpciones' style={{ width: '10vw' }} type='number' ref={paraEstadisticaRef} ></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Prefijo_Penal</label>
                                        <input className='digitarOpciones'style={{ width: '10vw',background:'#cbf9f6',color:'black' }} type='number' disabled defaultValue={prefijo} ref={prefijoPenalRef}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>trama_Int</label>
                                        <input className='digitarOpciones'style={{ width: '10vw' }} type='number' max={49} ref={tramaIntRef}></input>
                                    </div>
                                    <div>
                                        <button className='botonAxios' onClick={() => botonAgregarBQ()}>Agregar</button>
                                    </div>
                                </div>
                            }

                            {tipoDeConsulta == 3 &&
                                <div className='actualizarBQ'>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Mid</label>
                                        <input className='digitarOpciones' type='text' style={{ width: '10vw',background:'#cbf9f6',color:'black' }} disabled value={values.mid} ref={actualizarmidRef}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Banda</label>
                                        <input className='digitarOpciones'  type='number' style={{ width: '10vw' }} ref={actualizarbandaRef}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Id</label>
                                        <input className='digitarOpciones' type='number' style={{ width: '10vw',background:'#cbf9f6',color:'black' }} disabled value={id.id} ref={actualizaridRef}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Fecha Reporte</label>
                                        <input id="datetime-local" label="number" type="datetime-local" disabled style={{background:'#cbf9f6',color:'black' }} defaultValue={fechaPorDefecto} /* type='number' */  ref={actualizarfhUltimoReporteRef}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Estadistica</label>
                                        <input className='digitarOpciones' type='number' style={{ width: '10vw' }} ref={actualizarparaEstadisticaRef}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>Prefijo_Penal</label>
                                        <input className='digitarOpciones' type='number' style={{ width: '10vw',background:'#cbf9f6',color:'black' }} disabled defaultValue={prefijo} ref={actualizarprefijoPenalRef}></input>
                                    </div>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>tramaInt</label>
                                        <input className='digitarOpciones' type='number' style={{ width: '10vw' }} ref={actualizartramaIntRef}></input>
                                    </div>
                                    <div>
                                        <button className='botonAxios' onClick={() => botonActualizarBQ()}>Actualizar</button>
                                    </div>
                                </div>
                            }
                            {tipoDeConsulta == 4 &&
                                <div className='eliminarBQ'>
                                    <div className='digitar'>
                                        <label className='digitarLabel'>ID</label>
                                        <input className='digitarOpciones' type='number' style={{ width: '10vw',background:'#cbf9f6',color:'black' }} disabled value={id.id} ref={eliminaridRef}></input>
                                    </div>
                                    <div>
                                        <button className='botonAxios' onClick={() => botonEliminarBQ()}>Eliminar</button>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='imagenCheck'>
                            {tipoDeConsulta == 2 && visualizarpreCheck == true ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={preCheck} alt='check1'></img> :
                                (tipoDeConsulta == 2 && visualizarpreCheck == false ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={check} alt='check1'></img> : (
                                    tipoDeConsulta == 2 && visualizarpreCheck == 'error' ? <div className="alert errorDatos" style={{ animationDuration: `${imageDuration}ms` }}>
                                        <span className="closebtn" onClick="this.parentElement.style.display='none';">&times;</span>
                                        <strong>Verificar!</strong> que los datos ingresados sean correctos.
                                    </div> : null
                                ))}

                            {tipoDeConsulta == 3 && visualizarpreCheck == true ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={preCheck} alt='check1'></img> :
                                (tipoDeConsulta == 3 && visualizarpreCheck == false ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={check} alt='check1'></img> : (
                                    tipoDeConsulta == 3 && visualizarpreCheck == "error" ? <div className="alert errorDatos" style={{ animationDuration: `${imageDuration}ms` }}>
                                        <span className="closebtn" onClick="this.parentElement.style.display='none';">&times;</span>
                                        <strong>Verificar!</strong> que los datos ingresados sean correctos.
                                    </div> : null
                                ))}

                            {tipoDeConsulta == 4 && visualizarpreCheck == true ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={preCheck} alt='check1'></img> :
                                (tipoDeConsulta == 4 && visualizarpreCheck == false ? <img className="image" style={{ width: '40px', animationDuration: `${imageDuration}ms` }} src={check} alt='check1'></img> : (
                                    tipoDeConsulta == 4 && visualizarpreCheck == 'error' ? <div className="alert errorDatos" style={{ animationDuration: `${imageDuration}ms` }}>
                                        <span className="closebtn" onClick="this.parentElement.style.display='none';">&times;</span>
                                        <strong>Verificar!</strong> que los datos ingresados sean correctos.
                                    </div> : null
                                ))}
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

export default Inventario;


{/* <table className="responsive-table" style={{ backgroundColor: '#d5d5d0' }} >
                                        <thead>
                                            <tr align="center">
                                                {columnas.map((valor, index) => (
                                                    <th className='columnasConfiguracion' scope="col" key={index} style={{ color: "#190707" }} onClick={() => handleColumnaClick(index, valor)}>{valor} {index == imagenEncabezado && banderaOrdenar == false && <TiArrowSortedDown />} </th>

                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {datosInventario.map(({ id, prefijoPenal, mid, banda, fhUltimoReporte, tramaInt, paraEstadistica }, index) => (
                                                <tr
                                                    key={index}
                                                    align="center"
                                                    onClick={(e) => handleFilaClick(e, index)}
                                                    style={{ color: filaSeleccionada === index ? 'white' : '#190707' }}
                                                >
                                                    <th scope="row" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{filaSeleccionada === index ? <TiMediaPlay></TiMediaPlay> : null}</th>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{id}</td>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{prefijoPenal}</td>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{mid}</td>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{banda}</td>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{fhUltimoReporte}</td>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{tramaInt}</td>
                                                    <td className="columnasFilaConfiguracion tamanoDeLetraContenidoConfiguracion" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }} >{paraEstadistica}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table> */}