const { Chat, User } = require('../database/models');
const jwt = require('jsonwebtoken');


exports.register = async (req, res)=>{

    const { userName, phoneNumber, password } = req.body;

    try{

        const alreadyExist = await User.findOne({phoneNumber: phoneNumber});

        if(alreadyExist){

           return res.status(400).json({ success:false, message:"already exist" });
        }
        else{

            await User.create({ userName:userName, phoneNumber:phoneNumber, password:password });

            res.status(200).json({ success:true, message:"register successfully" });
        }
    }
    catch(error){
        console.error(error);
    }
}



exports.login =  async (req, res)=> {
    
    const { phoneNumber, password } = req.body;

    try{

        const exist = await User.findOne({ phoneNumber: phoneNumber, password: password });

        if(exist){


            const token = await jwt.sign( { phoneNumber: phoneNumber } , 'anirbanpaulpassword' , { expiresIn: "5h" } );


            res.status(200).cookie('token', token).json({ success: true, message: "logged in", token} )
            
            

        }
        else{

           return res.status(400).json({ success: false, message: "login failed due to wrong information"});
        }

    }
    catch(error){
        console.error(error);
    }
}


exports.addContact = async(req,res)=> {

     const { newContact } = req.body;

     const phoneNumber = req.phoneNumber;


    try{
        const exist = await User.findOne({phoneNumber: newContact});

        if(exist){
          
            const account = await User.findOne({phoneNumber: phoneNumber});

            if(account.contacts.includes(newContact)){

            return res.status(400).json({ success: false, message: "already added"});

            }

            account.contacts.push(newContact);
            await account.save();
            
            res.status(200).json({ success: true, message: "added successfully"});

               
        }
        else{
            return res.status(400).json({ success: false, message: "which number you want to add, they aren't in this platform"});
        }

    }catch(error){
        console.error(error);
    }
    
}

exports.allContact = async(req,res)=>{
    

    try{
        const  phoneNumber  = req.phoneNumber;

        const account = await User.findOne({phoneNumber});

       if(account){

         const allContact = account.contacts;

         const userName = account.userName;

         res.status(200).json({ success:true, allContact: allContact, phoneNumber: phoneNumber , userName: userName });
       }else{

        res.status(200).json({ success:"ggygyugygy" });

       }

    }catch(error){
        console.error(error);
    }

}



exports.sendMessage = async(req, res)=> {

    try{
        const { receiverNumber, message } = req.body;

        const phoneNumber = req.phoneNumber;
        
        const sender = await User.findOne( { phoneNumber: phoneNumber } );
        const receiver = await User.findOne({ phoneNumber: receiverNumber });

        if(!sender || !receiver){

            return res.status(400).json({ success: false, message: "user not found"});
        }else if(phoneNumber === receiverNumber){
            return;
        }

        let existChat = await Chat.findOne({ members: { $all: [ phoneNumber, receiverNumber ]} })

        if(!existChat){

            existChat = Chat.create({

                members: [ phoneNumber, receiverNumber],

                conversation: [{ sender: phoneNumber, message: message, } ],
           });


           res.status(200).json({ success: true, message: "now you can start chat"});

        }else{

            existChat.conversation.push({ sender: phoneNumber, message: message })

            await existChat.save();

            res.status(200).json({ success: true, message: "message sent successfully"});
        }
    }catch(error){

        console.error(error);
        res.status(200).json({ success: false, message: "Failed to send message"});
    }
}


exports.getMessage = async (req, res)=> {

    try{

        const { receiverNumber } = req.query;

        const phoneNumber = req.phoneNumber;

        const receiver = await User.findOne({ phoneNumber: receiverNumber })

        const existChat = await Chat.findOne({
            members: { $all : [ phoneNumber, receiverNumber] }
        });
        
        if(existChat && receiver){

            const receiverUserName = receiver.userName;

            res.status(200).json({ success:true, existChat, receiverUserName});

        }else{

            return res.status(200).json({ success:true, existChat, message: "sorry there is no chat available"});
        }    
        
    }catch(error){

        console.error(error);
    }
}

exports.unsendMessage = async (req, res)=>{

    try{
         const { id } = req.body;
        await Chat.findOneAndUpdate(
            { 'conversation._id': id },
            { $pull: { conversation: { _id: id } } }, 
            { new: true }
          );

        res.status(200).json({ success: true, message: 'unsend done'});
    }catch(error){
        console.error(error);
    }
}


exports.logout = async (req,res)=>{

    res.clearCookie('token');
    res.status(200).json({ success: true, message: "logout successfully"});

}