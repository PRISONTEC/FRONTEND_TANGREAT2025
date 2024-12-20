import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { hookAxios } from './hookAxios';
import { useNavigate } from 'react-router-dom';

export const hookPeticiones = () => {
    const [respuestaAgregarColaborador,setRespuestaAgregarColaborador]=useState(null);
    //!CREACION DE VARIABLES
    const { peticionGet, peticionPost,peticionPut } = hookAxios();

    //!NAVIGATE
    const navigate = useNavigate()

    //!CONTEXTS
    const { prefijoPenal, welcome, setWelcome, setDatos,IPBACKEND} = useContext(UserContext)

    //!=======PETICIONES AXIOS COLABORADOR====================
    //TODO: OBTENER COLABORADOR GET
        const obtenerColaboradores = async (e) => {
            try {
                const data = await peticionGet(`http://${IPBACKEND}:3100/colaboradores/${prefijoPenal}`);
                validandoColaboradores(data)
            } catch (error) {
                console.log("error", error)
                validandoColaboradores(error)
            }
        }


        const validandoColaboradores = (data) => {
            if (data.res == 'OK') {
                let arrayCodigoAzulito = [];
                data.data.map((datos) => {
                    arrayCodigoAzulito.push(datos['codAzulito'])
                })
                obtenerNombreDeColaboradores(arrayCodigoAzulito, data.data)
            } else {
                console.log(`%c Error: ${data}`, 'color:red')
            }

        }
        //POST PARA OBTENER LOS NOMBRES
        const obtenerNombreDeColaboradores = async (arrayCodigoAzulito, data) => {
            try {
                const dataPorNombre = await peticionPost(`http://${IPBACKEND}:3100/usuarios/nombres/`, { usuarios: arrayCodigoAzulito });

                const listaNueva = data.map((item) => {
                    const matchingItem = dataPorNombre.data.find((el) => el.id === item.codAzulito);
                    return {
                        codAzulito: item.codAzulito,
                        idLista: item.idLista,
                        nombres: matchingItem ? matchingItem.nombres : null,
                        id: matchingItem.id
                    };
                }).concat(data.filter((el) => !dataPorNombre.data.some((item) => item.codAzulito === el.id)));

                setDatos(listaNueva);
                setWelcome(true);
                navigate('/modulos/colaborador')

            } catch (error) {
                console.log(`%c Error: ${error}`, 'color:red')
            }
        }
    
    //TODO:AGREGAR COLABORADOR PUT
    const agregarColaborador=async(agregarCodigo,agregarIdLista)=>{
        try{
            const addColaborador=await peticionPut(`http://${IPBACKEND}:3100/colaboradores/${prefijoPenal}`,{idLista:agregarIdLista,codAzulito:agregarCodigo})
            validarAgregarColaborador(addColaborador);
        }catch(error){
            validarAgregarColaborador(error);
        }
        
    }

    const validarAgregarColaborador=(addColaborador)=>{
        if(addColaborador['res']=='OK'){
            setRespuestaAgregarColaborador(addColaborador)
        }else{
            setRespuestaAgregarColaborador(addColaborador)
        }
    }


    return (
        {
            obtenerColaboradores,
            agregarColaborador,
            respuestaAgregarColaborador
        }
    )
}
