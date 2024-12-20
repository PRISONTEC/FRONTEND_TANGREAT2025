import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import pdf from '../../assets/imagenes/pdf.svg'
import '../../assets/css/tabla.scss'

import jsPDF from "jspdf";
import "jspdf-autotable";

const tabla = ({ cabecera = [{}], mostarDatosDeTablas = [{}], filtro = true }) => {
    /* console.log("mostarDatosDeTablas TABLAS...............",mostarDatosDeTablas) */

    //!CREACION DE VARIABLES
    const [currentPage, setCurrentPage] = useState(0);
    const [filtros, setFiltros] = useState({});


    //!CONTEXTS
    const { prefijoPenal, setWelcome, modoDark, open } = useContext(UserContext);

    //!CREACION DE VARIABLES PARA LA TABLA CABECERA
    /*     const cabecera = [{ nombre: 'CODIGO', key: 'codAzulito', filtro: true }, { nombre: 'NOMBRE', key: 'nombres', filtro: false }, { nombre: 'LISTA', key: 'idLista', filtro: true }, { nombre: 'QUITAR', key: null, filtro: false }];
     */
    useEffect(() => {
    }, [])


    //!PAGINACIÓN
    //TODO:OBTENER NUEVOS DATOS AL REALIZAR EL FILTRO
    let displayData = mostarDatosDeTablas
        .filter((item) => {
            return Object.keys(filtros).every((key) => {
                const filtroValue = filtros[key].toLowerCase();
                return item[key].toString().toLowerCase().includes(filtroValue);
            });
        })


    //TODO:OBTENER LOS CARACTERES ESCRITOS EN EL FILTRO {codAzulito:'84',idLista:'2'}
    const filtroElementos = (e, key) => {
        const newFiltros = { ...filtros, [key]: e.target.value };
/*         console.log('newFiltros', { [key]: e.target.value })
 */        setFiltros(newFiltros);
    };

    //TODO:RENDERIZAR SI LA VARIABLE FILTRO CAMBIA PARA OBTENER DATOS FILTRADOS PARA LA TABLA
    useEffect(() => {
        setCurrentPage(0);
    }, [filtros]);

    //!Convertir fecha a epoch
    const convertirEpochAFecha = (fechaHora) => {
        if(fechaHora>0){
            const fecha = new Date(fechaHora * 1000);
            // Obtener los componentes de la fecha y hora
            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0, por lo que sumamos 1
            const anio = fecha.getFullYear();
            const horas = fecha.getHours().toString().padStart(2, '0');
            const minutos = fecha.getMinutes().toString().padStart(2, '0');
            const segundos = fecha.getSeconds();
            // Formatear la fecha y hora en el formato deseado
            const fechaNormal = `${dia}/${mes}/${anio} ${horas}:${minutos}`;
            // Muestra la fecha y hora normal
            return fechaNormal;
        }
    }



    //!GENERAR PDF
    const dataRows = [
        { codAzulito: 80095208, nombres: 'John Doe', idLista: 30 },
        { codAzulito: 80095208, nombres: 'Jane Smith', idLista: 25 },
        { codAzulito: 80095208, nombres: 'Bob Johnson', idLista: 40 }
    ];

    const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'PENAL', dataKey: 'prefijoPenal' },
        { header: 'FECHA', dataKey: 'fhUltimoReporte' },
        { header: 'MID', dataKey: 'mid' },
        { header: 'BANDA', dataKey: 'banda' },
        { header: 'ESTADISTICA', dataKey: 'paraEstadistica' },
        { header: 'TRAMA_INT', dataKey: 'tramaInt' }
    ];



    const exportToPDF = () => { 
        let datosParaPdf=mostarDatosDeTablas
        datosParaPdf.map((datos)=>{
                datos['fhUltimoReporte']=convertirEpochAFecha(datos.fhUltimoReporte)
        })
        const doc = new jsPDF();
        const tableData = datosParaPdf.map(row => columns.map(({ dataKey }) => row[dataKey]));
        doc.autoTable({
            head: [columns.map(({ header }) => header)],
            body: tableData
        });
        doc.save("tabla.pdf");
    };


    return (
        <div id="containerColaborador" className='containerColaborador' /* style={{width:width}} */>
            <div className='tablaContainer'>
                {/*             const cabecera = [{ nombre: 'codAzulito', key: 'id', filtro: true }, { nombre: 'NOMBRE', key: 'nombre', filtro: false }, { nombre: 'DEUDA', key: 'saldo', filtro: true }, { nombre: 'FECHA', key: 'fecha', filtro: true }];
 */}
                <table className="table tablaColaborador">
                    <thead className='cabeceraTabla'>
                        <tr>
                            {cabecera.map((datosCabecera, index) => (
                                <th key={index} scope="col" /* onClick={() => cabeceraElemento(datosCabecera.key)} */>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                                        <div style={{ textAlign: 'center' }}>{datosCabecera.nombre}</div>
                                        {filtro && <div >{datosCabecera.filtro ? (
                                            <input
                                                type="text"
                                                className='inputFiltros'
                                                placeholder={`${datosCabecera.nombre}...`}
                                                value={filtros[datosCabecera.key] || ''}
                                                onChange={(e) => filtroElementos(e, datosCabecera.key)}
                                            />
                                        ) : <input disabled style={{ border: "none", backgroundColor: "transparent" }}
                                            type="text"
                                        />}</div>}
                                    </div>
                                </th>
                            ))}

                        </tr>
                    </thead>
                    <tbody className={`bodyTablaColaborador ${modoDark ? null : 'text-white'}`}>
                        {displayData.map(({ id, prefijoPenal, mid, banda, fhUltimoReporte, tramaInt, paraEstadistica }, index) => (
                            <tr key={index}>
                                {/* <th scope="row">{(fechaHoraReporte ? convertirEpochAFecha(fechaHoraReporte) : null)}</th> */}
                                <td >{id}</td>
                                <td >{prefijoPenal}</td>
                                <td >{mid}</td>
                                <td >{banda}</td>
                                <td >{fhUltimoReporte>0?convertirEpochAFecha(fhUltimoReporte):fhUltimoReporte}</td>
                                <td >{tramaInt}</td>
                                <td >{paraEstadistica}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='paginacionColaborador'>
                {mostarDatosDeTablas.length > 0 ? <button onClick={exportToPDF} style={{ border: 'none', background: 'none' }}><img style={{ width: '45px', marginRight: '10px' }} src={pdf}></img></button>
                    : <button disabled onClick={exportToPDF} style={{ border: 'none', background: 'none' }}><img style={{ width: '45px', marginRight: '10px' }} src={pdf}></img></button>
                }
                
            </div>
        </div>
    )
}

export default tabla;