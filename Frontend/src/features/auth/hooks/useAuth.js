import {useContext} from "react";
import { AuthContext } from "../auth.context";
import {login,Register,logout,getMe} from "../Services/auth.api"



export const useAuth=()=>{
    const context=useContext(AuthContext);
    const {user,setUser,loading,setLoading}=context;

    const handleLogin= async ({email,password})=>{
        setLoading(true);
        try{

            const data=await login({email,password});
            setUser(data.user);
        }
        catch(err){
            throw err;
        } finally{

            setLoading(false);
        }
    }

    
    const handleRegister= async ({username,email,password})=>{
        setLoading(true);
        try{

            const data=await Register({username,email,password});
            setUser(data.user);
        }catch(err){
            throw err;
        }
        finally{

            setLoading(false);
        }
    }
    

    const handleLogout=async ()=>{
        setLoading(true);
        try{
            
            const data=await logout();
            setUser(null);
        }catch(err){
            throw err;
        }finally{

            setLoading(false);
        }
    }


    return {user,loading,handleLogin,handleRegister,handleLogout}
}