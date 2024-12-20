import { AiOutlineClose } from "react-icons/ai";

const NavBar2 = ({ functionBtnMenu,conectado }) => {

    return (
        <>
            <nav className="navbar text-white " style={{height:"100%",backgroundColor:"#272F53"}}>
                <div className="container-fluid">
                    <div>
                        SISTEMA MONITOR
                    </div>
                    <div>
                        <AiOutlineClose onClick={functionBtnMenu} />
                    </div>

                </div>
            </nav>
        </>
    );
}

export default NavBar2;

/* navbar-dark bg-dark */