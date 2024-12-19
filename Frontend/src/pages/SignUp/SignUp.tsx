import React, { useState } from 'react'
import Navbar from '../../components/navbar/navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password,setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("Admin");
  const [company, setCompany] = useState<string>("");
  const [error,setError] = useState<string | null>(null);

  
  const navigate = useNavigate();



  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if(!name){
        setError("Please Enter Your Name");
        return;
    }

      if(!validateEmail(email)){
          setError("Please Enter a Valid Email Address");
          return;
      }
      if(!password){
          setError("Please Enter a Valid Email Address");
          return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setError("");

              // Sign Up API Call
              try{
                const response = await axiosInstance.post("/create-account",{
                    fullName:name,
                    email:email,
                    password:password,
                    role:role,
                    company:company
                });
                console.log(response);
                //Handle successful registration success
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
  {/* <Navbar userInfo={undefined} onSearchNote={function (): void {
            throw new Error('Function not implemented.');
        } } handleClearSearch={function (): void {
            throw new Error('Function not implemented.');
        } }/> */}
  
  <div className="flex items-center justify-center mt-28" >
      <div className="py-10 bg-white border rounded w-96 px-7">
          <form onSubmit={handleSignUp} >
              <h4 className='text-2xl mb-7'>Sign Up</h4>
              <input type="text" placeholder='Name' className='input-box'
              value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder='Email' className='input-box'
              value={email} onChange={(e) => setEmail(e.target.value)} />
              <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
              <PasswordInput
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }/>
              {error && <p className='pb-1 text-xs text-red-500'>{error}</p>}

              <button type='submit' className='btn-primary'>
                  Create Account
              </button>
              <p className='mt-4 text-sm text-center'>
                  Already have a Account?{" "}
                  <Link to='/login' className='font-medium underline text-primary'>
                  Log In
                  </Link>
              </p> 
          </form>

      </div>
  </div>
  </>
)
}

export default SignUp;