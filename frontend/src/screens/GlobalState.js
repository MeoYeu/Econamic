import React,{useState,createContext,useEffect} from 'react';
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
export const NameConText=createContext();

function GlobalState({children}) {
    const [message, setMessage] = useState(0)
    const [socket, setsocket] = useState();
    const [listuser, setListUser] = useState([])
    const productList = useSelector((state) => state.productList);
    const { loading, error, products,pages,page,count } = productList;
    const ENDPOINT = "localhost:5000";
    useEffect(() => {
        
         let socket=io(ENDPOINT, {
            transports: ["websocket"],
            timeout: 30000,
            "force new connections": true,
            reconnectAttempts: "Infinity",
          });
                  setsocket(socket);
        return () =>  socket.close()
    }, [])
    const state = {
        
        socket,
        message:message,
        setMessage:setMessage,
        listuser:listuser,
        setListUser:setListUser,


       
    }
    return (
        <NameConText.Provider value={state}>
            {children}
         </NameConText.Provider>
    )
}

export default GlobalState
