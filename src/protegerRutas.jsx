import { Navigate } from "react-router";
import { useContext } from 'react';
import { UserContext } from './context/UserContext'


export const ProtegerRutas =({children})=>{
    const {loginProteger}=useContext(UserContext);
    if(!loginProteger){ 
        return <Navigate to="/"></Navigate>
    }

    return children;
}