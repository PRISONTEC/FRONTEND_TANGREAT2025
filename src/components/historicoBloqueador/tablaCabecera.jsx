import React, { useState, useContext } from 'react';
import { TiMediaPlay } from "react-icons/ti";
import "../../assets/css/yonlit.scss";
import { TiArrowSortedDown } from "react-icons/ti"; //abajo
import { TiArrowSortedUp } from "react-icons/ti"; //arriba
import { UserContext } from '../../context/UserContext';
import { BsFileBreakFill } from "react-icons/bs";
import "react-activity/dist/library.css";
import { makeStyles } from '@material-ui/core/styles';

const columnas = [<div style={{ display: "flex", justifyContent: "center" }}><BsFileBreakFill></BsFileBreakFill></div>, "MID", "A1"];

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
const tablaCabecera = ({datosBloqueadores,mostrarTablaUltimoEstado}) => {

    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [banderaOrdenar, setBanderaOrdenar] = useState(false);
    const [imagenEncabezado, setImagenEncabezado] = useState(null);

    //!Use Contexts
    const {}=useContext(UserContext);
    

    //Ordenar de manera descendente y ascendente
    const handleColumnaClick = (index) => {
        if (index == 0) {
            setImagenEncabezado(null);
            setFilaSeleccionada(null);
        }
    }

    //BANDERA PARA QUITAR EL COLOR AZUL DE LA FILA
    const handleFilaClick = (e, index,mid) => {
        /* setColumnaOrdenada(index) */
        /* console.log("setFilaSeleccionada",e,index,mid) */
        mostrarTablaUltimoEstado(mid)
        setFilaSeleccionada(index);
    };

    return (
            <div style={{background:'#F0F3F2',height:'72.2vh'}}>
                <table className="responsive-tableyonlit" style={{ backgroundColor: '#d5d5d0' }} >
                    <thead >
                        <tr align="center">
                            {columnas.map((valor, index) => (
                                <th className='columnasYonlit' scope="col" key={index} style={{ color: "#190707" }} onClick={() => handleColumnaClick(index, valor)}>{valor}{index == imagenEncabezado && banderaOrdenar == false ? <TiArrowSortedDown /> : (index == imagenEncabezado && banderaOrdenar == true ? <TiArrowSortedUp /> : null)}</th>

                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(datosBloqueadores.hasOwnProperty('resultado')&&
                            datosBloqueadores.resultado.map(({ mid, nombre}, index) => (

                                <tr
                                    key={index}
                                    align="center"
                                    onClick={(e) => handleFilaClick(e, index,mid)}
                                    style={{ color: filaSeleccionada === index ? '#0BB077' : '#190707', height: "1px" }}
                                >
                                    <th scope="row" style={{ backgroundColor: filaSeleccionada === index ? '#0078D7' : 'white' }}>{filaSeleccionada === index ? <TiMediaPlay></TiMediaPlay> : null}</th>
                                    <td className="columnasFilaYonlit tamanoDeLetraContenidoYonlit" >{mid}</td>
                                    <td className="columnasFilaYonlit tamanoDeLetraContenidoYonlit">{nombre}
                                    </td>
                                </tr>

                            )))}

                    </tbody> 
                </table>
            </div>

    )
}

export default tablaCabecera;
