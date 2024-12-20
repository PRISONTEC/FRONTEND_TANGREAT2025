import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { UserContext } from '../context/UserContext';
import ListarBQs from './ListarBQs';
import NavBar from './NavBar';
import NavBar2 from './NavBar2';
import MostrarBandas from './MostrarBandas';
import '../assets/css/mostrarBandas.scss';
import Configuracion from './estructura/configuracion';
import Yonlit from './yonlit/Yonlit';
import Umbrales from './estructura/Umbrales';
import PreguntarStatus from './estructura/PreguntarStatus';
import YonlitComando from './estructura/YonlitComando';
import { Dots } from "react-activity";
import HistoricoBloqueador from './historicoBloqueador/historicoBloqueador';
import Bloqueador from './estructura/Bloqueador';
import Inventario from './estructura/inventario';


const MainWebSocket = () => {
  //UseContext
  const { puerto, IPBACKEND, listarBQS, setDatosBQS, seleccionarBQSA1, setDatosModificacion, selectedOption, setActualizado,
    setDataUmbrales, setUmbralesVisualizar, setDataStatus, setStatusVisualizar, setDataYonlit, setYonlitVisualizar, cambiarPagina, setRespuestaYonlit } = useContext(UserContext);

  //Public API that will echo messages sent to it back to the client
  const socketUrl = `ws://${IPBACKEND}:${puerto[0]}/monitorBQ/consultaDatos`;

  //const [startConexion, setStartConexion] = useState(true);
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  const isMediumScreen = useMediaQuery({ minWidth: 800, maxWidth: 1024 });
  const [showBQ, setShowBQ] = useState(false);
  const [botonConfiguracion, setBotonConfiguracion] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [conectado, setConectado] = useState(null)
  const [socketUrlState, setSocketUrlState] = useState(socketUrl);
  const [variableReconexion, setVariableReconexion] = useState(true)

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true, // Solo reconectar si estás en línea
    reconnectAttempts: 10,
    reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 3000), // Máximo 10 segundos
  });



  const handleClickSendMessage = useCallback(() => sendMessage('prisontec:$t3l3ph0ny$'), []);
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  useEffect(() => {
    setConectado(connectionStatus);
  
    // Si estamos conectados y es la primera conexión
    if (variableReconexion) {
      handleClickSendMessage(); // Envía el mensaje
       // Desactiva la reconexión automática hasta nuevo aviso
       setVariableReconexion(prev => !prev);
    }
  
    // Si la conexión está cerrada
    if (connectionStatus.toLowerCase() == 'closed') {
      setVariableReconexion(prev => !prev);
    }

      processing();
  
  }, [lastMessage, readyState]);



  useEffect(() => {
    const handleOnline = () => {
      if (connectionStatus.toLowerCase() == 'open') {
        setConectado('Open');
      }
    };

    const handleOffline = () => {
        setConectado('closed');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, readyState]);


  const processing = () => {
    /* console.log("lastMessage", new Date(), lastMessage) */
    /* console.log("lastMessage", new Date(), lastMessage) */
    //{ultimosDatosObtenidos: [{5000: Array(7), 5300: Array(4), B900: Array(6)], mids: [{id: 1, mid: '5000', nombre: 'BQ1'},{id: 1, mid: 'D200', nombre: 'BQ2'}]}
    if (lastMessage !== null && lastMessage.data != 'Access Granted!!!' && lastMessage.data != 'Invalid Command') {
      /* console.log("Se conectó", lastMessage)  */
      let dataMids = JSON.parse(lastMessage.data);
      let datosRecibidos = JSON.parse(lastMessage.data);
      let datosRecibidosDialogo = JSON.parse(lastMessage.data);
      if (dataMids.mids) {
        // ultimosDatosObtenidos
        const resultado = Object.groupBy(dataMids.ultimosDatosObtenidos, (mids) => {
          return mids.mid
        })
        listarBQS["ultimosDatosObtenidos"] = [resultado]
        listarBQS["mids"] = dataMids.mids
        setDatosBQS(dataMids.mids);
        /* ejecutarTiempo(); */
        setBotonConfiguracion(true)

      } else if (dataMids["res"] == "OK") {
        //!Cambiar parámetros y obtener los datos de configuración
        if (typeof datosRecibidosDialogo["rptaCommand"] === "string") {
          sendMessage(`{"command": "preguntarStatusBandasMID", "mid":"${selectedOption}"}`);
          setDatosBQS("KOKO");
        } else if (Array.isArray(datosRecibidosDialogo["rptaCommand"])) {
          if (datosRecibidosDialogo["rptaCommand"][0]["MID"] == selectedOption) {
            setDatosModificacion(datosRecibidosDialogo["rptaCommand"])
            setActualizado(false)
            setDatosBQS(dataMids["res"]);
          }
        }
      } else if (dataMids["res"] == "KO") {
        setDatosBQS(dataMids["res"]);
        setActualizado(false)
      }
      //OBTENER LOS DATOS DE CADA MID
      else {
        if (listarBQS["ultimosDatosObtenidos"] && dataMids[0]) {
          const resultado = Object.groupBy(dataMids[0], (mids) => {
            return mids.mid
          })
          const clave = Object.keys(resultado)[0];
          listarBQS["ultimosDatosObtenidos"][0][clave] = resultado[clave];

        } else if (listarBQS["ultimosDatosObtenidos"] && dataMids['misUmbrales']) {
          setUmbralesVisualizar(false); // falta ver que tiene
          setDataUmbrales(dataMids['misUmbrales'])
        } else if (listarBQS["ultimosDatosObtenidos"] && dataMids['status']) {
          setStatusVisualizar(false); // falta ver que tiene
          setDataStatus(dataMids['status'])
        } else if (listarBQS["ultimosDatosObtenidos"] && dataMids['CommandOnOffYonlit']) {
          setYonlitVisualizar(false); // falta ver que tiene
          setDataYonlit(JSON.parse(dataMids['CommandOnOffYonlit']))
        }
      }
    } else {
      /*  console.log("Datos",lastMessage) */
    }

  }

  return (
    <div>
      <div className='grid-container'>
        <div className='header'/* style={{ height: "50px" }} */>
          {
            !showBQ ?
              <>
                <NavBar isSmallScreen={isSmallScreen} conectado={conectado} functionBtnMenu={() => setShowBQ(prev => !prev)} />
              </>

              :
              <NavBar2 isSmallScreen={isSmallScreen} conectado={conectado} functionBtnMenu={() => setShowBQ(prev => !prev)} />
          }
        </div>
        {!cambiarPagina ? <>
          <div className='aside' style={{ display: 'flex', justifyContent: 'flex-start' }}/* style={{ height: `calc(100vh - 50px)`, width: "100vw", marginLeft: "-2vw" }} */>
            {showBQ || !isSmallScreen ? <ListarBQs isSmallScreen={isSmallScreen} setShowBQ={setShowBQ} /> : null}
          </div>


          {!showBQ ?
            <div className='section'/* className='tamanoCuadroConfiguracion marginTopCelularConfiguracion' */ >
              <div className='sectionDiv' /* style={{ height: "120vh", overflowY: "auto", maxHeight: "86vh", backgroundColor: "#3C4364", borderStyle: "solid", borderWidth: "5px", borderColor: "white", marginTop: "10vw", marginLeft: "1vw", marginRight: "2vw", borderRadius: "10px" }} */ >
                {/* //!MENU CONFIGURACION */}
                <div className='row' style={{ zIndex: '1', display: 'flex', flexWrap: 'wrap', marginTop: ".5vw", marginLeft: "1vw", marginRight: "1.5vw" }}>
                  <div className='tamanoContenedorYonli' style={{ background: '#CCD1D1', borderRadius: '8px', margin: '4px 8px 0px 0px', border: '2px solid white', display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                    <div className='menuConfiguracionTitulos' style={{ margin: '0px', padding: '0px' }}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <h6 style={{ marginRight: '10px' }} >Test Yonlit</h6>
                        {botonConfiguracion == false ? <Dots /> : null}
                      </div>
                    </div>
                    <div>
                      <div className='col col-12 col-sm-12 col-lg pb-1' >
                        <YonlitComando sendMessage={sendMessage} botonConfiguracion={botonConfiguracion}></YonlitComando>
                      </div>
                    </div>

                  </div>
                  <div className='col ' style={{ background: '#CCD1D1', margin: '4px 17px 0px 0px', border: '2px solid white', borderRadius: '8px' }}>
                    <div className='row menuConfiguracionTitulos' style={{ margin: '0px', padding: '0px' }}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <h6 style={{ marginRight: '10px' }}>Mantenimiento tangreat</h6>
                        {botonConfiguracion == false ? <Dots /> : null}
                      </div>
                    </div>
                    <div className='row pb-1'>
                      <div className='col col-3 col-sm-12 col-md-6 col-lg-4 col-xl p-md-1' >
                        <Umbrales sendMessage={sendMessage} botonConfiguracion={botonConfiguracion}></Umbrales>
                      </div>
                      <div className='col col-4 col-sm-12 col-md-6 col-lg-4 col-xl p-md-1'>
                        <Configuracion sendMessage={sendMessage} botonConfiguracion={botonConfiguracion}></Configuracion>
                      </div>
                      <div className='col col-5 col-sm-12 col-md-12 col-lg-4 col-xl p-md-1' >
                        <PreguntarStatus sendMessage={sendMessage} botonConfiguracion={botonConfiguracion}></PreguntarStatus>
                      </div>
                      <div className='col col-5 col-sm-12 col-md-12 col-lg-4 col-xl p-md-1' >
                        <Bloqueador sendMessage={sendMessage} botonConfiguracion={botonConfiguracion}></Bloqueador>
                      </div>
                      <div className='col col-5 col-sm-12 col-md-12 col-lg-4 col-xl p-md-1' >
                        <Inventario sendMessage={sendMessage} botonConfiguracion={botonConfiguracion}></Inventario>
                      </div>
                    </div>
                  </div>
                </div>

                {/* //!CUERPO */}
                <div className="tamanoBQ" style={{ marginTop: ".5vw", marginLeft: "1vw", marginRight: "2vw", fontWeight: "bold", color: "white" }}>
                  {seleccionarBQSA1 != null ? seleccionarBQSA1 : null}
                </div>
                <div>


                  <div style={{ borderStyle: "solid", borderWidth: "2px", borderColor: "white", marginTop: ".5vw", marginLeft: "1vw", marginRight: "2vw" }}>
                    <MostrarBandas  ></MostrarBandas>
                  </div>
                  <div style={{ marginBottom: 10,/* borderStyle: "solid", borderWidth: "2px", borderColor: "white", */marginTop: "0.5vw", marginLeft: "1vw", marginRight: "2vw", overflow: "auto", maxHeight: "100vh" }}>
                    <Yonlit></Yonlit>
                  </div>
                </div>
              </div>
            </div>
            : null}
        </> :
          <div>
            <HistoricoBloqueador></HistoricoBloqueador>
          </div>
        }
      </div>
    </div>
  );
};

export default MainWebSocket;


/* 
ReadyState.CONNECTING: Cuando se está intentando conectar al servidor.
ReadyState.OPEN: Cuando la conexión está abierta y puedes enviar y recibir mensajes.
ReadyState.CLOSING: Cuando la conexión se está cerrando.
ReadyState.CLOSED: Cuando la conexión se ha cerrado.
ReadyState.UNINSTANTIATED: Cuando la conexión aún no ha sido inicializada.

1. conexión al WebSocket se realiza automáticamente cuando: El componente MainWebSocket se monta
2. No necesitas llamar manualmente handleClickSendMessage para que el WebSocket se conecte. Este se conecta automáticamente una vez que el componente se carga
3. En React, cuando se utiliza useWebSocket como lo estás haciendo, la conexión al WebSocket está ligada a una URL (socketUrlState en este caso). Cada vez que la 
URL del WebSocket cambia (mediante setSocketUrlState), la conexión se restablece automáticamente.


5. Aquí estás comprobando si el código de cierre (event.code) no es 1000.
Código 1000 es el código estándar que indica que la conexión WebSocket se cerró de forma normal (una finalización limpia de la conexión, sin errores o problemas).
Si el código de cierre NO es 1000, significa que la conexión no se cerró normalmente. Esto puede ocurrir por varios motivos, como errores de red, problemas en el servidor o interrupciones inesperadas.
1000: Cierre normal.
1001: El endpoint (servidor o cliente) se va, por ejemplo, si cierras el navegador o la pestaña.
1006: El cierre fue anormal, por ejemplo, si se pierde la conexión de red sin haber podido cerrar la sesión adecuadamente.
1011: Error inesperado del servidor. 
*/