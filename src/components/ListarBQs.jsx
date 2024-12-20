import React, { useState,useContext,useEffect } from 'react';
import { ImPlay3 } from "react-icons/im";
import { UserContext } from '../context/UserContext'; 
import '../assets/css/listarBQS.scss';

const ListarBQs = ({isSmallScreen,setShowBQ,setCargarTiempo}) => {
    const [filaSeleccionada, setFilaSeleccionada] = useState(0);


// USE CONTEXTS
    const {listarBQS,setSeleccionarBQS,setSeleccionarBQSA1,setTiempo}=useContext(UserContext);

    const handleClickFila = (index,mid,nombre) => {
        setSeleccionarBQSA1(nombre); 
        setSeleccionarBQS(mid);
        setFilaSeleccionada(index);
        if(isSmallScreen){
            setTiempo(400)
            setShowBQ(prev=>!prev); 
        }
    };

    const filaStyles = (index) => ({
        backgroundColor: index === filaSeleccionada ? '#3498DB' : 'transparent',
    });


    return (
        <>


            <div className='tamanoListarBQ' >
                <div className='glass-effect'>
                <div className='row fw-bold' style={{ width: "104%"/* ,color:"white" */}}>
                    <div className='col' style={{ textAlign: 'left', width: "20%" }}></div>
                    <div className='col' style={{ textAlign: 'left', width: "40%" }}>MID</div>
                    <div className='col' style={{ textAlign: 'left', width: "50%" }}>A1</div>
                </div>
                <div style={{ width: "100%",overflowY:'auto',height:'60vh',cursor:'pointer'}}>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            {Object.keys(listarBQS).length > 0 && (listarBQS["mids"]).map(({ id,mid, nombre }, index) => (
                                <tr key={index}
                                    onClick={() => handleClickFila(index,mid,nombre)}
                                    className={index === filaSeleccionada ? 'fila-seleccionada' : ''}
                                    style={filaStyles(index)}>
                                    <td style={{ textAlign: 'left', width: "20%" }}>{index === filaSeleccionada ? <ImPlay3 /> : ''}</td>
                                    <td style={{ textAlign: 'left', width: "30%" }}>{mid}</td>
                                    <td style={{ textAlign: 'left', width: "50%" }}>{nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </>
    );
};

export default ListarBQs;

