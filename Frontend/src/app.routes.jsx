import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Home from "./features/ai/pages/Home.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import InterviewPlan from "./features/ai/pages/Interview.jsx";
import ResumeRewriter from "./features/resume/pages/ResumeRewriter.jsx";
export const router=createBrowserRouter([
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/register",
        element:<Register />
    },
    
    {
        path:"/",
        element:<Protected>
                <Home /> 
            </Protected>
    },{
        path:"/interview/:interviewId",
        element:<Protected>
            <InterviewPlan />
        </Protected>
    },{
        path:"/resume-rewriter",
        element:<Protected>
            <ResumeRewriter />
        </Protected>
    }
]);