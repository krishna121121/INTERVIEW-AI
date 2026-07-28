import axious from "axios";

export async function Register({username,email,password}){
    try{

        const response= await axious.post('https://interview-ai-xo9l.onrender.com/api/auth/register',{
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
            'https://interview-ai-xo9l.onrender.com/api/auth/login',
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

        const response=await axious.get('https://interview-ai-xo9l.onrender.com/api/auth/logout',{
            withCredentials:true
        })
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export async function getMe(){
    try{
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for Render cold starts
        const response=await axious.get('https://interview-ai-xo9l.onrender.com/api/auth/get-me',{
            withCredentials:true,
            signal: controller.signal
        })
        clearTimeout(timeoutId);
        return response.data;
    }
    catch(err){
        console.log(err);
        throw err; // re-throw so auth context can properly set loading=false
    }
}