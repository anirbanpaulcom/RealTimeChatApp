import './chat.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaUserPlus, FaChevronRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ReactScrollToBottom from 'react-scroll-to-bottom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketIO from "socket.io-client";



const Chat = ()=> {

    const [ phoneNumber, setPhoneNumber ] = useState('');
    const [ userName, setUserName ] = useState('');
    const [ allContact, setAllContact ] = useState([]);
    const [ allChat, setAllChat ] = useState([]);
    const [ receiverNumber, setReceiverNumber ] = useState('');
    const [ receiverUserName, setReceiverUserName ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ newContact, setNewContact ] = useState('');
    const [ openUnsend, setOpenUnsend ] = useState('');
    const [ online, setOnline ] = useState([]);
    

    var chatOpener=null;

    
    const ENDPIONT = "http://localhost:3001";
    const socket = socketIO(ENDPIONT);

    const navigate = useNavigate();


    useEffect(()=>{
      
        axios.get('http://localhost:3001/contact')
        .then((response) =>{
           setPhoneNumber(response.data.phoneNumber);
           setUserName(response.data.userName);
           setAllContact(response.data.allContact);
        }).catch(error =>{
         console.error(error);
        })
    },[newContact])


    const handleAddContact = async ()=>{

        try{
            if(newContact){
                await axios.post('http://localhost:3001/contact', {  newContact: newContact })
                setNewContact('');
            }
        }catch(error){
          console.error(error);
          toast.error( "Please Enter Correct Number",{
            position:"top-center"
        }); 
        }

    }


    const openChat = async (data)=> {
        

        if(chatOpener===data){
            console.log("chat is already open");
            return ;
        }
        chatOpener=data;
        setReceiverNumber(data);
        socket.emit('join', phoneNumber);
            if(data){ 
                
                await axios.get('http://localhost:3001/chat', { params: { receiverNumber: data }})
                .then(response => {
                    
                    setReceiverUserName(response.data.receiverUserName)
                    if(response.data.existChat){
                        setAllChat( response.data.existChat.conversation );
                    }else{
                        setAllChat([]);
                    }
                
                }).catch(error=>{
                console.error(error);
                })
            }

    }


    const handleSendMessage = async() =>{

        try{        
            if(receiverNumber && message){
                socket.emit('sendMessage', { to: receiverNumber, sender: phoneNumber, message: message, time: Date.now()})
                await axios.post('http://localhost:3001/chat', { receiverNumber: receiverNumber, message: message } );
                setMessage('');
            }
        }catch(error){
         console.error(error);
        }
    }


    const handleUnsend = async (data) =>{

        try{
            await axios.put('http://localhost:3001/chat', { id : data });
        }catch(error){
            console.error(error);
        }

    }


    const handleLogout = async ()=>{

        try{
            axios.post('http://localhost:3001/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('auth');
            navigate('/');
        }catch(error){
            console.error(error);
        }
    }
    useEffect(()=>{     
         
        socket.on('online', (onlineUser)=>{
            setOnline(onlineUser);
        })

        socket.on('getMessage', (data) => {
           
            if(data.sender === phoneNumber || chatOpener === data.sender ){
                setAllChat((prevMessages) => [...prevMessages, data]);
            }else{

                toast.dark( `Contact:${data.sender} Message:${data.message}`,{
                    position:"top-center"
                });        
            }
        });      
        socket.on('disconnect',()=>{
            console.log("Socket get disconnected");
        })     
            
    })

  
    return(

    <div className="chatPage">

    <ToastContainer  />

        <div className="sideBox">
            <div className="about">
            <div className="Logo" />
               <div>
                    <div className="name">{ userName }</div>
                    <div className="number">{ phoneNumber }</div>
               </div>
            </div>
            <div className="snip">
                <div className="snipBio">
                    <h4>Welcome to Snip!</h4> 
                    <h6>Connect, chat, & make lasting connection with ease.</h6>
                </div>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </div>
        </div>

        <div className="contactBox">


            <div className='addContectBox'>
                <input type="number" value={newContact} onChange={(e)=>setNewContact(e.target.value)} className="addContact" placeholder='Add contact' required/>
                <FaUserPlus onClick={handleAddContact}  className='addContectButton'/>
            </div>



            <div className='allContactBox'>  
                {allContact.map((allContact)=>(
                <div key={allContact} className={receiverNumber === allContact ? 'active' : 'allContact'} onClick={() =>  openChat(allContact) }>
                    <div className="contact">{allContact}</div>
                    {online.includes(allContact) && <div className="online">online</div>}   
                </div> 
                ))}                
            </div>

        </div>


        <div className="chatBox">
            <div className="chatNavBox">
                <div className="chatNav">{receiverUserName}
                    {online.includes(receiverNumber) && <div className="online">online</div>}   
                </div>
            </div>

            <ReactScrollToBottom className="chatSection">


                        {allChat.length===0 && (
                            <div className="defaultChat">
                                <h1>Start the conversation!👋</h1>
                                <h6>Make new connections, add new friends.</h6>
                            </div>
                        )}

                {allChat.map((data) => (
                <div className={data.sender === phoneNumber ? 'rightBox' : "leftBox"}>
                    <div key={data._id} className={data.sender === phoneNumber ? 'right' : 'left'}  onClick={() => setOpenUnsend(data._id)}>
                        {data.message}
                        <div className="chatTimeBox">
                            <div className="chatTime">{format(new Date(data.time), 'HH:mm a')}</div>
                        </div>
                    </div> 

                        {openUnsend === data._id && data.sender === phoneNumber && (
                        <div className="unsend" onClick={() => handleUnsend(data._id)}>
                        Unsend
                        </div>
                        )}
                    
                </div>
                ))}
  
            </ReactScrollToBottom>

            <div className="chatTextBar">
                <input value={message} onChange ={(e)=> setMessage(e.target.value)}  type="text"  className='sendInput' placeholder='Type your message' />
                <FaChevronRight onClick={handleSendMessage} className='sendButton' />
            </div>

        </div>   
            
    </div>
    )
}

export default Chat; 