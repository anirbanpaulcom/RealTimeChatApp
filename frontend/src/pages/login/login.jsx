import './login.css';
import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';




const Login =  () => {

  const [ phoneNumber, setPhoneNumber ]= useState('');
  const [ password, setPassword ]= useState('');


 const navigate = useNavigate();

    const handleLogin = async (e)=> {
     
        e.preventDefault();

                         
    try{
      await axios.post('http://localhost:3001/', { phoneNumber, password })
      localStorage.setItem('auth', true);
      navigate('/chat') 
     }
     catch(error){
        console.error(error);
        toast.error( "Please Enter Correct Info",{
          position:"top-center"
      });
     }
    }

    return (

        <div className='loginPage'>

        <ToastContainer  />

                <form  onSubmit={handleLogin}>
                    <h1 className='login'>Join Now</h1>
                    <div className="inputBox">
                        <input type="number" placeholder="Enter Phone Number" value={phoneNumber} onChange={(e)=> setPhoneNumber(e.target.value)}  required/>
                        <input type="password" placeholder="Enter Password"  value={ password } onChange={ (e)=> setPassword(e.target.value)}   required/>
                        <button >Login</button>
                    </div>
                </form>

            <div className="registerview">
                <h1>Welcome back!</h1>
                <h6>Don't have an account?</h6>
                <a href='/register'>Signup</a>
            </div>
            
        </div>
    )
};

export default Login;


