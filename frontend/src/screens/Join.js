import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom'

function Join() {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    
    return (
        <div>
            <div>
                <input placeholder='nhập tên' onChange={e=>setName(e.target.value)}></input>
                <br/>
                <input placeholder='nhập phòng' onChange={e=>setRoom(e.target.value)}></input>
                <br/>
                <Link to={`/chat?name=${name}&room=${room}`}>
                <button type='button' >Sign in</button>
                </Link>
            </div>
        </div>
    )
}

export default Join
