import { useState } from "react";
import { UserContext } from "./UserContext"



const UserProvider = ({children}) => {
  /* const IPBACKEND = "190.187.248.85"; */
    const [IPBACKEND,setIPBACKEND] = useState("");
    const [puerto,setPuerto] = useState([]);
    const [loginProteger, setLoginProteger] = useState();
    const [prefijo,setPrefijo]=useState('');
    const [listarBQS,setListarBQS]=useState({});
    const [datosBQS, setDatosBQS] = useState("");
    const [seleccionarBQS,setSeleccionarBQS] = useState("");
    const [seleccionarBQSA1, setSeleccionarBQSA1] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [datosModificacion, setDatosModificacion] = useState({});
    const [seleccionHabilitar,setSeleccionHabiliar] = useState(false);
    const [actualizado,setActualizado] = useState(null);
    const [tiempo,setTiempo]=useState(20000);
    const [dataUmbrales,setDataUmbrales]= useState(null);
    const [umbralesVisualizar,setUmbralesVisualizar]=useState(null);
    const [dataStatus,setDataStatus]= useState(null);
    const [statusVisualizar,setStatusVisualizar]=useState(null);
    const [yonlitVisualizar,setYonlitVisualizar]=useState(null);
    const [dataYonlit,setDataYonlit]= useState(null);
    const [cambiarPagina,setCambiarPagina] = useState(false);
    const [dataGrafica,setDataGrafica]=useState({count:0,items:[]}); 
    const [midTablaCabecera,setMidTablaCabecera]=useState(null);
    const [prefijoPenal,setPrefijoPenal]=useState('')

  return (
    <UserContext.Provider 
      value={{
              IPBACKEND,setIPBACKEND,
              datosBQS,setDatosBQS,
              listarBQS,setListarBQS,
              seleccionarBQS,setSeleccionarBQS,
              seleccionarBQSA1, setSeleccionarBQSA1,
              selectedOption, setSelectedOption,
              datosModificacion, setDatosModificacion,
              seleccionHabilitar,setSeleccionHabiliar,
              actualizado,setActualizado,
              tiempo,setTiempo,
              dataUmbrales,setDataUmbrales,
              umbralesVisualizar,setUmbralesVisualizar,
              dataStatus,setDataStatus,
              statusVisualizar,setStatusVisualizar,
              yonlitVisualizar,setYonlitVisualizar,
              dataYonlit,setDataYonlit,
              cambiarPagina,setCambiarPagina,
              prefijo,setPrefijo,
              dataGrafica,setDataGrafica,
              midTablaCabecera,setMidTablaCabecera,
              loginProteger, setLoginProteger,
              prefijoPenal,setPrefijoPenal,
              puerto,setPuerto

              }}>
        {children}
    </UserContext.Provider>
  )
}

export default UserProvider
