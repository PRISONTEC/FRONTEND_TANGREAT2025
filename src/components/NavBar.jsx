import React, { useContext } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";
import { UserContext } from "../context/UserContext";
import { datos } from './hooks/datos'


const NavBar = ({ isSmallScreen, functionBtnMenu,conectado }) => {
    const isXxlScreen = useMediaQuery({ minWidth: 1200 });
    const { cambiarPagina, setCambiarPagina, prefijo } = useContext(UserContext);
    const { nameEps } = datos({});

    const cambiarPaginaF = () => {
        setCambiarPagina(!cambiarPagina)
    }


    return (
        <>
            <nav className="navbar text-white" style={{ backgroundColor: "#272F53", height: "100%" }}>
                <div className="container-fluid" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div>
                            {isSmallScreen ? <AiOutlineMenu onClick={functionBtnMenu} /> : null}
                        </div>
                        <div style={{ paddingLeft: '30px' }}>
                            SISTEMA MONITOR {prefijo.length > 0 &&
                                (() => {
                                    const result = nameEps.find(datos => datos.prefijo === Number(prefijo));
                                    return result ? result.value : '';
                                })()
                            }
                            {/* <div>
                        SISTEMA MONITOR
                    </div> */}
                        </div>
                        <div>
                            <div className="form-check form-switch">
                                {/* <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" onClick={()=>cambiarPaginaF()}/> */}
                                {/* <label className="form-check-label" for="flexSwitchCheckChecked">Cambiar página</label> */}
                            </div>
                        </div>
                    </div>
                    {conectado==='Open'?<div style={{background:'#5ab842',borderRadius:'8px',padding:'0px 3px 0px 3px'}}>CONECTADO</div>:
                    <div style={{background:'red',borderRadius:'8px',padding:'0px 3px 0px 3px'}}>DESCONECTADO</div>}
                </div>

            </nav>
        </>
    );
}

export default NavBar;

/* import { AiOutlineMenu } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";

const NavBar = ({ isSmallScreen, functionBtnMenu }) => {
    const isMdScreen = useMediaQuery({ minWidth: 768, maxWidth: 991 });
    const isLgScreen = useMediaQuery({ minWidth: 992, maxWidth: 1199 });
    const isXlScreen = useMediaQuery({ minWidth: 1200, maxWidth: 1399 });
    const isXxlScreen = useMediaQuery({ minWidth: 1400 });

    return (
        <>
            <nav className="navbar text-white" style={{ backgroundColor: "#272F53", height: "100%" }}>
                <div className="container-fluid">
                    <div>
                        {isSmallScreen ? <AiOutlineMenu onClick={functionBtnMenu} /> : null}
                    </div>
                    <div style={{ fontSize: isMdScreen ? "20px" : '' }}> 
                        SISTEMAS
                    </div>
                    <div >

                        <p className={isLgScreen ? 'texto-lg' : ''}>

                        </p>
                        <p className={isXlScreen ? 'texto-xl' : ''}>

                        </p>
                        <p className={isXxlScreen ? 'texto-xxl' : ''}>

                        </p>
                    </div>
                    <div>

                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar; */