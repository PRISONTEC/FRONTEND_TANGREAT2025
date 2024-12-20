/* import React, { useState } from 'react';
import { ImPlay3 } from "react-icons/im";

const ListarBQs = ({isSmallScreen}) => {
    const [filaSeleccionada, setFilaSeleccionada] = useState(0);
    const [datos, setDatos] = useState([{ mid: "0300", a1: "ANCON 1-BQ 3" }, { mid: "0301", a1: "ANCON 1-BQ 4" }])

    const generarDatos = () => {
        let objeto = { mid: "", a1: "" };
        let data = []

        for (let i = 11; i <= 90; i++) {
            let ob = { ...objeto }
            ob.mid = "03" + String(i);
            ob.a1 = "ANCON 1-BQ " + String(i);
            data.push(ob);
        }
        setDatos(data)
    }

    const handleClickFila = (index) => {
        setFilaSeleccionada(index);
    };

    const filaStyles = (index) => ({
        backgroundColor: index === filaSeleccionada ? '#3498DB' : 'transparent',
    });

    return (
        <>


            <div className="col-lg-2 col-md-2 col-sm-12" style={{ height: "100%", fontSize: isSmallScreen?"4vw":"1vw", backgroundColor: "#BDBDBD" }}>
                <div className='row fw-bold' style={{ width: "100%",overflowY: "auto"}}>
                    <div className='col' style={{ textAlign: 'left', width: "20%" }}></div>
                    <div className='col' style={{ textAlign: 'left', width: "30%" }}>MID</div>
                    <div className='col' style={{ textAlign: 'left', width: "50%" }}>A1</div>
                </div>
                <div style={{ width: "100%", maxHeight: "95%",overflowY: "auto"}}>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            {datos.map(({ mid, a1 }, index) => (
                                <tr key={mid}
                                    onClick={() => handleClickFila(index)}
                                    className={index === filaSeleccionada ? 'fila-seleccionada' : ''}
                                    style={filaStyles(index)}>
                                    <td style={{ textAlign: 'left', width: "20%" }}>{index === filaSeleccionada ? <ImPlay3 /> : ''}</td>
                                    <td style={{ textAlign: 'left', width: "30%" }}>{mid}</td>
                                    <td style={{ textAlign: 'left', width: "50%" }}>{a1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ListarBQs;
 */



// BACKUP DE LISTARBQS
/* import React, { useState } from 'react';
import { ImPlay3 } from "react-icons/im";
import { useMediaQuery } from 'react-responsive';

const ListarBQs = () => {
    const [filaSeleccionada, setFilaSeleccionada] = useState(0);
    const [datos, setDatos] = useState([{ mid: "0300", a1: "ANCON 1-BQ 3" }, { mid: "0301", a1: "ANCON 1-BQ 4" }])
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const isMediumScreen = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

    const generarDatos = () => {
        let objeto = { mid: "", a1: "" };
        let data = []

        for (let i = 11; i <= 90; i++) {
            let ob = { ...objeto }
            ob.mid = "03" + String(i);
            ob.a1 = "ANCON 1-BQ " + String(i);
            data.push(ob);
        }
        setDatos(data)
    }

    const handleClickFila = (index) => {
        setFilaSeleccionada(index);
    };

    const filaStyles = (index) => ({
        backgroundColor: index === filaSeleccionada ? '#3498DB' : 'transparent',
    });

    return (
        <>
            <button type='button' className='btn btn-primary' onClick={generarDatos} >generar</button>
            <div style={{width:"20vw", height:"80vh", fontSize:"1.1vw"}}>
                <div className='tbl-header'>
                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', width: "20%" }}></th>
                                <th style={{ textAlign: 'left', width: "30%" }}>MID</th>
                                <th style={{ textAlign: 'left', width: "50%" }}>A1</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div style={{ width: "100%", overflowY: "scroll", maxHeight: "100%" }}>
                    <table style={{ width: "100%"}}>
                        <tbody>
                            {datos.map(({ mid, a1 }, index) => (
                                <tr key={mid}
                                    onClick={() => handleClickFila(index)}
                                    className={index === filaSeleccionada ? 'fila-seleccionada' : ''}
                                    style={filaStyles(index)}>
                                    <td style={{ textAlign: 'left', width: "20%" }}>{index === filaSeleccionada ? <ImPlay3 /> : ''}</td>
                                    <td style={{ textAlign: 'left', width: "30%" }}>{mid}</td>
                                    <td style={{ textAlign: 'left', width: "50%" }}>{a1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>Cantidad de Resustados: {datos.length}</div>
        </>
    );
};

export default ListarBQs; */