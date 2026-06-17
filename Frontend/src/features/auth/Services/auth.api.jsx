import axious from "axios";

export async function Register({username,email,password}){
    try{

        const response= await axious.post('http://localhost:3000/api/auth/register',{
            username,email,password
        },{
            withCredentials:true
        })
        return response.data;
    }
    catch(err){
        console.log(err);
    }
    
} 

export async function login({email,password}){
    try{
        const response=await axious.post(
            'http://localhost:3000/api/auth/login',
            {email,password},
            {
            withCredentials:true
        })

        return response.data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export async function logout(){
    try{

        const response=await axious.get('http://localhost:3000/api/auth/logout',{
            withCredentials:true
        })
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export async function getMe(){
    try{
        const response=await axious.get('http://localhost:3000/api/auth/get-me',{
            withCredentials:true
        })
        return response.data;
    }
    catch(err){
        console.log(err);
    }
}