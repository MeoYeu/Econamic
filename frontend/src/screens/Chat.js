import React,{useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import '../index.css'


function Chat({location}) {

const [name, setName] = useState("");
const [room, setRoom] = useState("")
const ENDPOINT='localhost:5000';
let socket;
    useEffect(() => {
        const {name,room}=queryString.parse(location.search);
        socket=io(ENDPOINT,{
            transports:["websocket"],
            "timeout" : 3000,
            "force new connections" : true,
            "reconnectAttempts" : "Infinity",
            query:name
        })
        socket.emit('join',{room},()=>{
           
        })
        
        return ()=>{
            socket.emit('disconnect');
            socket.off();
        } 
    }, [ENDPOINT,location.search])
    return (
        <div className='app'>
            <div className='Chatcontainer'>
            <div className='message'>

            </div>
            <div className='messageInputs'>
                <input type='text' placeholder="nhập nội dung">

                </input>
                <button type='button' >Send</button>
            </div>

        </div>
        </div>
    )
}

export default Chat

