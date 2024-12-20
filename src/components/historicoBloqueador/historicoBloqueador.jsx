import React, { useContext, useEffect, useState } from 'react';
import '../../assets/css/historicoBloqueador.scss';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { UserContext } from '../../context/UserContext';
import { hookAxios } from '../hooks';
import Grafico from '../grafico/Grafico';
import TablaCabecera from './tablaCabecera';
import Tabla from '../tabla/tabla';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,

  },
}));

const fechasObtener = () => {
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');

  const fechaFormateada = `${año}-${mes}-${dia}T${horas}:${minutos}`;
  return fechaFormateada
}

const historicoBloqueador = () => {

  //!CREACION DE VARIABLES
  const [banda, setBanda] = useState([]);
  const [datosBloqueadores, setDatosBloqueadores] = useState([{}]);
  const [datosAgrupadosPorMid, setDatosAgrupadosPorMid] = useState([{}])
  const [idInventario, setIdinvetario] = useState(null);
  const [mid, setMid] = useState("");
  const [frecuencia, setFrecuencia] = useState({});
  const [fechaInicio, setFechaInicio] = useState(fechasObtener)
  const [fechaFin, setFechaFin] = useState(fechasObtener);
  const [visualizarGrafico, setVisualizarGrafico] = useState(false);
  const [datosUltimoReporte, setDatosUltimoReporte] = useState([{}]);
  const [mostarDatosDeTablas, setMostarDatosDeTablas] = useState([{}]);
  const [mostarDatosPorFecha, setMostarDatosPorFecha] = useState([{}]);

  /* console.log("new Date",new Date()) */
  const classes = useStyles();
  //!UseContext
  const { setDataGrafica, prefijo } = useContext(UserContext)

  //!Hooks
  const { peticionGet } = hookAxios()

  //!Cabecera para ultimo reporte
  const cabecera = [{ nombre: 'fecha', key: 'fechaHoraReporte', filtro: false }, { nombre: 'banda', key: 'modulo', filtro: true }, { nombre: 'potencia', key: 'potencia', filtro: false }, { nombre: 'temperatura', key: 'temperatura', filtro: false }, { nombre: 'voltaje', key: 'voltaje', filtro: false }, { nombre: 'corriente', key: 'corriente', filtro: false }, { nombre: 'VSWR', key: 'vswr', filtro: false }];

  //!USEEFFECT

  useEffect(() => {
    setDataGrafica({count:0,items:[]})
    obtenerInventadrio();
    obtenerDatosPenal();
    /* obtenerDataUltimoReporte(); */
  }, [])

  //!DATA DESDE LA BASE DE DATOS CHORRILLOS 
  //TODO:Obtener el idInventario por mid 
  const obtenerInventadrio = async () => {
    const obtenerDatosInventario = await peticionGet(`http://190.187.248.85:2860/penal/idInvetario/?prefijo=${prefijo}`);
    agruparDatosIdInventario(obtenerDatosInventario[0].resultado);
  }
  const agruparDatosIdInventario = (resultado) => {
    const idInventario = Object.groupBy(resultado, result => {
      return result.mid
    })
    setDatosAgrupadosPorMid(idInventario)
    //{0300:[{mid: '0300', banda: '700', tramaInt: '10', idInventario: 960, prefijoPenal: '101', …}]}
  }

  //Todo:Obtener datos nombre y mid
  const obtenerDatosPenal = async () => {
    //{mid: '0300', nombre: 'BQ2', prefijoPenal: '101'}
    const obtenerDatosInventario = await peticionGet(`http://190.187.248.85:2860/penal/bloqueador/?prefijo=${prefijo}`);
    /* console.log("obtenerDatosInventario", obtenerDatosInventario[0]) */
    setDatosBloqueadores(obtenerDatosInventario[0])
  }



  //!Obtener mid boton Seleccionar bloqueador
  const elegirIdInventario = (mid) => {
    setBanda([])
    if (datosAgrupadosPorMid[mid]) {
      setMid(mid)
      setBanda(datosAgrupadosPorMid[mid])
      setFrecuencia({})
    } else {
      setBanda([])
    }
  }

  //!Obtener banda(frecuancia) boton Banda seleccionar
  const elegirBanda = (frecuencia) => {
    let datos = JSON.parse(frecuencia)
    setFrecuencia(datos)
  }

  //!Obtener fecha entre actual y final
  const obtenerFechaFinal = (fechaFin) => {
    setFechaFin(fechaFin)
  }

  const obtenerFechaInicio = (fechaInicio) => {
    setFechaInicio(fechaInicio)
  }

  //!Obtener datos dynamo Boton traer datos o dabilitado (me sirive para la grafica)
  const obtenerdatosDynamo = () => {
    if (mid.length > 0 && frecuencia.tramaInt) {
      convertirFechaAEpoch();
    } else {
      console.log("elija la opción")
    }

  }

  const consultadoDatosDynamo = async (fechaInicioLocal, fechaFinLocal) => {
    const datosDynamo = await peticionGet(`http://190.187.248.85:2860/dynamo/?fechaInicio=${fechaInicioLocal}&fechaFin=${fechaFinLocal}&idInventario=${frecuencia.idInventario}&tramaInt=${frecuencia.tramaInt}`)
    if (datosDynamo.count > 0) {
      setDataGrafica(datosDynamo)
    } else {
    }
  }

  //!Convertir fecha a epoch
  const convertirFechaAEpoch = () => {
    //fechaInicio
    const fechaInicioLocal = new Date(fechaInicio);
    const timestampInicio = fechaInicioLocal.getTime() / 1000;

    //FechaFin
    const fechaFinLocal = new Date(fechaFin);
    const timestampFinal = fechaFinLocal.getTime() / 1000;

    consultadoDatosDynamo(timestampInicio, timestampFinal)
    consultarDatosEntreFechas(timestampInicio, timestampFinal)
  }


  //!Consulta datos del boton tabla
  const consultarDatosEntreFechas = async (fechaInicioLocal, fechaFinLocal) => {
    const datosDynamo = await peticionGet(`http://190.187.248.85:2860/dynamo/porFecha?fechaInicio=${fechaInicioLocal}&fechaFin=${fechaFinLocal}&prefijoPenal=${prefijo}`)
    setMostarDatosPorFecha(datosDynamo.items)
    console.log("por fecha ", datosDynamo.items)
  }

  //!Mostrar grafico
  const mostrarGrafico = () => {
    setVisualizarGrafico(2)
  }
  //!Mostar datos entre Fechas
  const mostrarGraficoEnteFechas = () => {
    setVisualizarGrafico(3)
  }

  //!Obtener data último reporte realizar consulta del boton ultimo estado
  const obtenerDataUltimoReporte = () => {
    //Obtener la fecha actual 
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const fechaFormateada = `${año}-${mes}-${dia}T${horas}:${minutos}`

    const newEpochTimeFin = new Date(fechaFormateada);
    const fechaFinEstado = newEpochTimeFin.getTime() / 1000;

    // Obtener la fecha hace 20 minutos
    const newEpochTimeInicio = fechaFinEstado * 1000 - (90 * 60 * 1000);
    const fechaInicioEstado = newEpochTimeInicio / 1000;

    obteniendoDataUltimoReporte(fechaInicioEstado, fechaFinEstado);
  }
  const obteniendoDataUltimoReporte = async (fechaInicioEstado, fechaFinEstado) => {
/*     console.log("obteniendoDataUltimoReporte", fechaInicioEstado,fechaFinEstado)
 */    const datosDynamo = await peticionGet(`http://190.187.248.85:2860/dynamo/fechaActual?fechaInicio=${fechaInicioEstado}&fechaFin=${fechaFinEstado}&prefijoPenal=${prefijo}`)
    if (datosDynamo.hasOwnProperty('items')) {
      let itemsFiltrados = datosDynamo.items
      const datosUltimoEstadoLocal = Object.groupBy(itemsFiltrados, result => {
        return result.mid
      })

      setDatosUltimoReporte(datosUltimoEstadoLocal)
      setVisualizarGrafico(1)
      mostrarTablaUltimoEstado(null);
    }
  }

  //!Obtener el id seleccionado de tablaCabecera

  const mostrarTablaUltimoEstado = (mid) => {
    //{0400: Array(11), 0300: Array(53), 0500: Array(9), FF02: Array(1)}
    if (mid != null && datosUltimoReporte[mid]) {
      const datos = datosUltimoReporte[mid]
      setMostarDatosDeTablas(datos)

    } else {
      setMostarDatosDeTablas([{}])
      console.log("no ingreso")
    }
  }

  return (
    <div className=' containerBloqueador' >
      <div className='row containerHeader'>
        <div className='header1'>

          <div className='bloqueador' style={{ alignSelf: 'center' }}>
            <label htmlFor="bloqueador">BLOQUEADOR</label>
            <select id="bloqueador" onChange={(e) => elegirIdInventario(e.target.value)} /* value={selectedValue} */>
              <option value="">Seleccionar</option>
              {datosBloqueadores.resultado && datosBloqueadores.resultado.map((datos) => (
                <option key={datos.mid} value={datos.mid}>{datos.nombre}</option>
              ))}
            </select>
          </div>

          <div className='bloqueador' style={{ alignSelf: 'center' }}>
            <label for="bloqueador">BANDA</label>
            <select id="bloqueador" onChange={(e) => elegirBanda(e.target.value)}>
              <option value="">Seleccionar</option>
              {banda.length > 0 && banda.map((datos, index) => (
                <option key={index} value={JSON.stringify({ "banda": datos.banda, "tramaInt": datos.tramaInt, "idInventario": datos.idInventario })}>{datos.banda}</option>
              ))}
            </select>
          </div>

          <div className='bloqueador' style={{ alignSelf: 'center' }}>
            <label for="bloqueador">TRAMA_INT</label>
            <button className='botonTraer' style={{}}>{frecuencia?.tramaInt ? frecuencia?.tramaInt : '?'}</button>
          </div>


          <div style={{ alignSelf: 'center' }}>
            <form className={classes.container} noValidate>
              <TextField
                id="datetime-local"
                label="FechaInicio"
                type="datetime-local"
                defaultValue={fechaInicio}
                /* defaultValue="2017-05-24T10:30" */
                onChange={(e) => obtenerFechaInicio(e.target.value)}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </div>

          <div style={{ alignSelf: 'center' }}>
            <form className={classes.container} noValidate>
              <TextField
                id="datetime-local"
                label="FechaFin"
                type="datetime-local"
                defaultValue={fechaFin}
                onChange={(e) => obtenerFechaFinal(e.target.value)}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </div>

          <div className={Object.keys(frecuencia).length === 0 ? 'bloqueadorTraerDatos' : 'bloqueador'} style={{ alignSelf: 'center' }}>
            <button disabled={Object.keys(frecuencia).length === 0} onClick={() => obtenerdatosDynamo()}>
              {Object.keys(frecuencia).length === 0 ? 'DESABILITADO' : 'TRAER DATOS'}
            </button>
          </div>
        </div >
      </div>

      <div className='section2'>
        <div className='section1'>

        </div>
      </div>

      <div className='menu' style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <div className='menuHijo'>
          <div style={{ alignSelf: 'center' }}>
            <button className='botonCabecera2' onClick={() => obtenerDataUltimoReporte()}>ULTIMO ESTADO</button>
          </div>
          <div style={{ alignSelf: 'center' }}>
            <button className='botonCabecera2' onClick={() => mostrarGraficoEnteFechas()}>TABLA</button>
          </div>
          <div style={{ alignSelf: 'center' }}>
            <button className='botonCabecera2' onClick={() => mostrarGrafico()}>GRAFICO</button>
          </div >
        </div>
      </div>

      {visualizarGrafico == 1 &&
        <div className='mostrardataGrafico'>
          <div className='ultimoEstado'>
            <div className='tablaCabecera'>
              <TablaCabecera datosBloqueadores={datosBloqueadores} mostrarTablaUltimoEstado={mostrarTablaUltimoEstado} ></TablaCabecera>
            </div>
            <div >
              <Tabla cabecera={cabecera} mostarDatosDeTablas={mostarDatosDeTablas} width={'75vw'}></Tabla>
            </div>
          </div>
        </div>
      }
      {visualizarGrafico >= 2 &&
        <div className='mostrardataGrafico'>
          {visualizarGrafico == 2 && <Grafico></Grafico>}
          {visualizarGrafico == 3 && <Tabla cabecera={cabecera} mostarDatosDeTablas={mostarDatosPorFecha} width={'95vw'}></Tabla>}
        </div>}

    </div>
  )
}

export default historicoBloqueador