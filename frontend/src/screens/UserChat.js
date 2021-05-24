import React,{useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { dispatch } from '../../node_modules/react-hot-toast/dist/index';
import {detailsUser } from "../actions/userActions";
function UserChat(props) {
    const {item}=props
  
    return (
        <div className="listchat" >
            
                <img className="imgchat" src={item.logo}></img>
                <span>{item.name}</span>
        </div>
    )
}

export default UserChat
