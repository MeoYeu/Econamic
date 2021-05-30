import React,{useEffect,useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { dispatch } from '../../node_modules/react-hot-toast/dist/index';
import {detailsUser } from "../actions/userActions";
import axios from 'axios'
function UserChat({item,currentItem}) {
    
  const [user, setUser] = useState();
  useEffect(() => {
      const friendId=item.members.find(m=>m!==currentItem);
      const getUser=async()=>{
          try {
            const res=await axios.get("/api/users/"+friendId);
            
            setUser(res.data)
          } catch (error) {
              console.log("lỗi UserChat Router",error);
          }
      }
      getUser()
  }, [currentItem,item])
    return (
        <div className="listchat" key={item}>
            
                <img className="imgchat" src={user? user.logo:""}></img>
                <span>{user?user.name:""}</span>
        </div>
    )
}

export default UserChat
