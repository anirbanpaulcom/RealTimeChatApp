import './register.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';




const Register =  () => {

  const [ userName, setuserName ] = useState('');
  const [ phoneNumber, setPhoneNumber ] = useState('');
  const [ password, setPassword ] = useState('');
  
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try { 
      await axios.post('http://localhost:3001/register', { userName, phoneNumber, password })
      navigate('/')
    }catch (error){
      toast.error( "Please Follow Proper Info",{
        position:"top-center"
    }); 
      console.error(error);
    }
  };


    return (
    <div className="registerPage"> 

      <ToastContainer  />
        <div className="registerview">
            <h1>Welcome to Snip!</h1>
            <h6>Now you can create account</h6>
            <a href='/'>Join</a>
        </div>
        <form  onSubmit={handleRegister}>
          <h1 className='register'>Create account</h1>
          <div className="inputBox">
            <input  type="text" placeholder="Enter Username"  value={ userName } onChange={(e) => setuserName(e.target.value)} required/>
            <input  type="number" placeholder="Enter Phone Number" value={phoneNumber} onChange={(e)=> setPhoneNumber(e.target.value)}  required/>
            <input  type="password" placeholder="Enter Password"  value={ password } onChange={ (e)=> setPassword(e.target.value)} required/>
            <button>Signup</button>
          </div>
        </form>
    </div>
  
 )
};

export default Register;