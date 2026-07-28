import {useContext} from "react";
import { AuthContext } from "../auth.context";
import {login,Register,logout,getMe} from "../Services/auth.api"



export const useAuth=()=>{
    const context=useContext(AuthContext);
    const {user,setUser,loading,setLoading}=context;

    // NOTE: handleLogin and handleRegister do NOT touch the shared `loading`
    // state anymore. That state is ONLY for the initial getMe() auth check.
    // Login/Register pages manage their own local isSubmitting state.

    const handleLogin= async ({email,password})=>{
        try{
            const data=await login({email,password});
            setUser(data.user);
        }
        catch(err){
            throw err;
        }
    }

    
    const handleRegister= async ({username,email,password})=>{
        try{
            const data=await Register({username,email,password});
            setUser(data.user);
        }catch(err){
            throw err;
        }
    }
    

    const handleLogout=async ()=>{
        try{
            await logout();
            setUser(null);
        }catch(err){
            throw err;
        }
    }


    return {user,loading,handleLogin,handleRegister,handleLogout}
}