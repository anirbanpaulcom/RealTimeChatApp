import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './pages/chat/chat.jsx'
import Login from "./pages/login/login.jsx";
import Register from "./pages/register/register.jsx";
import axios from 'axios';
import PrivateRoutes from './authentication/privateRoutes.js'; 

axios.defaults.withCredentials = true;


function App() {

  return (
    
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login /> } /> 
          <Route path="/register" element={<Register /> } />
          <Route element={<PrivateRoutes/>}>
              <Route path= '/chat' element={<Chat /> } />
          </Route> 
      </Routes>
    </BrowserRouter>
   
  );
}

export default App;
