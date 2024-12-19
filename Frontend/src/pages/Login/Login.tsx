import React, { useState } from 'react'
import Navbar from '../../components/navbar/navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/input/PasswordInput';
import axios from 'axios';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';



const Login = () => {

    const [email, setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [error,setError] = useState<string | null>(null);

    const navigate = useNavigate(); 

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!validateEmail(email)){
            setError("Please Enter a Valid Email Address");
            return;
        }
        if(!password){
            setError("Please Enter a Valid Password");
            return;
        }
        setError("");

        // Login API Call
        try{
            const response = await axiosInstance.post("/login",{
                email:email,
                password:password,
            });
            //Handle successful login success
            if(response.data && response.data.error){
                setError(response.data.message);
                return;
            }
            if(response.data ){
                localStorage.setItem("token",response.data.accessToken);
                navigate("/dashboard")
            }
        }catch(error){
            setError("Login failed. Please check your credentials and try again.");
        }

    }


  return (
    <>
    {/* <Navbar onSearchEmployee={() => {}} handleClearSearch={() => {}}/> */}
    
    <div className="flex items-center justify-center mt-28" >
        <div className="py-10 bg-white border rounded w-96 px-7">
            <form onSubmit={handleLogin} >
                <h4 className='text-2xl mb-7'>Login</h4>
                <input type="text" placeholder='Email' className='input-box'
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
                {error && <p className='pb-1 text-xs text-red-500'>{error}</p>}

                <button type='submit' className='btn-primary'>
                    Login
                </button>
                <p className='mt-4 text-sm text-center'>
                    Not registered yet?{""}
                    <Link to='/signUp' className='font-medium underline text-primary'>
                    Create an Account
                    </Link>
                </p> 
            </form>

        </div>
    </div>
    </>
  )
}

export default Login;