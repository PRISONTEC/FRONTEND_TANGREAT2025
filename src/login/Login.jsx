import { useContext, useEffect } from 'react';
import '../assets/css/login.scss'
import { UserContext } from '../context/UserContext';
import { useNavigate } from "react-router";
import cargando from '../assets/imagenes/cargando.gif'
import ingeniero from '../assets/imagenes/ingeniero.png'
import warning from '../assets/imagenes/warning.png'
import CryptoJS from 'crypto-js';

const Login = () => {
    const urlParams = new URLSearchParams(window.location.search);
    // http://192.237.253.176:3700/?ref=sidebar&prefijo=103
    //const urlParams = new URLSearchParams('http://192.237.253.176:3700/?ref=sidebar&prefijo=129');
    const prefijo = urlParams.get('prefijo') ?? null;
    /* const prefijo = 103; */
    /* const id = urlParams.get('id');
    const ipPenal = urlParams.get('ipPenal'); */

    //!Penales
    let dbConfigs = {101:"192.168.150.5",102:"192.168.151.5",103:[7603,9003],104:"192.168.153.5",105:"192.168.154.5",106:"192.168.155.5",
        107:"192.168.156.5",108:[7608,9008],107:"192.168.156.5",110:"192.168.158.5",111:[7611,9011],112:[7612,9012],
        113:"192.168.161.5",114:[7614,9014],115:"192.168.163.5",116:"192.168.164.5",117:"192.168.165.5",118:"192.168.166.5",
        119:"192.168.167.5",120:[7620,9020],121:[7654,9021],122:"192.168.170.5",123:"192.168.171.5",124:"192.168.172.5",
        125:"192.168.173.5",126:[7626,9026],127:"192.168.175.5",128:"192.168.176.5",129:[7629,9029],130:"192.168.169.253"};
    //let ipPenal = { 101: '192.168.150.5', 102: '192.168.151.5', 103: '192.168.152.5', 104: '192.168.153.5', 105: '192.168.154.5', 106: '192.168.155.5', 107: '192.168.156.5', 108: '192.168.157.5', 107: '192.168.156.5', 110: '192.168.158.5', 111: '192.168.159.5', 112: '192.168.160.5', 113: '192.168.161.5', 114: '192.168.162.5', 115: '192.168.163.5', 116: '192.168.164.5', 117: '192.168.165.5', 118: '192.168.166.5', 119: '192.168.167.5', 120: "192.168.168.5", 121: "192.168.169.253", 122: '192.168.170.5', 123: '192.168.171.5', 124: '192.168.172.5', 125: '192.168.173.5', 126: '192.168.174.5', 127: '192.168.175.5', 128: '192.168.176.5', 129: '192.168.177.5', 130: '192.168.169.253'}
    //const keysPrefijo = Object.keys(dbConfigs)

    //!USERCONTEXT
    const { setPuerto, loginProteger, setLoginProteger,setIPBACKEND,IPBACKEND,setPrefijo } = useContext(UserContext);

    //!NAVEGAR
    const navigate = useNavigate();

    useEffect(() => {
        obtenerIp()
    }, [])

    useEffect(() => {
        if(IPBACKEND.toString().length>0){
            tiempo()
        }
    }, [IPBACKEND])


    function tiempo() {      
        if (prefijo !== null && IPBACKEND.length>0) {
            setLoginProteger(true)
            // Decrypt
            var decryptedPenal = prefijo
            /* console.log("prefijo", decryptedPenal) */
            setTimeout(() => {
                obteniendoDatos(decryptedPenal)
            }, 2000)
        } else if (prefijo == null) {
            setLoginProteger(false)
        }
    }

    function obteniendoDatos(decryptedPenal) {
        setPuerto(dbConfigs[decryptedPenal])
        navigate('/modulo')
    }

    //Cambiar de ip
    const obtenerIp = async () => {
        try {
            setPrefijo(prefijo)
            const response = await fetch('https://api.ipify.org/?format=json');
            const data = await response.json();
            if (data.ip == "190.187.248.85" || data.ip =="200.37.171.122" || data.ip=="104.130.67.32") {
                /* console.log({"ipPenalInterno":data.ip,prefijo :prefijo}) */
                setIPBACKEND("10.19.10.2")
            } else {
                /* console.log({"ipExterno":data.ip,prefijo :prefijo}) */
                /* console.log("ipExterno", data.ip) */
                setIPBACKEND("190.187.248.85")
            }
        } catch (error) {
            console.error("errorIP",error); 
        }
    }


    // Función para desencriptar
    function desencriptar(textoEncriptado) {
        const clave = '123'; // Reemplaza con tu clave secreta
        const bytes = CryptoJS.AES.decrypt(textoEncriptado, clave);
        const textoDesencriptado = bytes.toString(CryptoJS.enc.Utf8);
        return textoDesencriptado;
    }



    return (
        <div style={{ height: '100vh', width: '100%', background: "black", display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            {loginProteger == true ? <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ zIndex: '1' }}>
                    <img style={{ width: '45vh', height: '45vh' }} src={ingeniero}></img>
                </div>
                <div>
                    <img style={{ width: '35vh', height: '35vh' }} src={cargando}></img>
                </div>

            </div> : (loginProteger == false ? <div style={{ background: 'white', zIndex: '1', display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'center', width: '50vw', height: '70vh', border: '5px solid white' }}>

                <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ background: '#D5472B ', width: '50vw', height: '12vh' }}>
                        <img style={{ display: 'block', margin: '0 auto', padding: '8px 0px 0px 0px', height: '10vh' }} src={warning}></img>
                    </div>
                    <div style={{ background: 'white', width: '50vw', height: '60vh' }}>
                        <h1 style={{ padding: '20px 15px 10px 15px' }}>Por favor, ingrese por la página de bloqueo.</h1>
                    </div>
                </div>

            </div> : null)}

        </div>
    )
}

export default Login

