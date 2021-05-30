import React, { useState, useRef, useContext, useEffect } from "react";
import { NameConText } from "./GlobalState";
import { Modal, Button, Input, Row, Col } from "antd";
import UserChat from "./UserChat";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Message from "./Message";
function Thongbao() {
  const state = useContext(NameConText);
  const socket = state.socket;
  const [message, setMessage] = useState([]);
  const setNumberMessage = state.setMessage;
  const [conversation, setConversation] = useState([]);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const [newMessage, setNewMessage] = useState("");
  const [currentItem, setCurrentItem] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState();
  const ScollRef = useRef();
  const [name, setName] = useState("");
  const [recei, setRecei] = useState();
  useEffect(() => {
    socket &&
      socket.on("sendmsg", (data) => {
        const setarr = async () => {
          const t = await setArrivalMessage({
            sender: data.sender,
            text: data.msg,
            createdAt: Date.now(),
          });
        };
        setarr();
        console.log("message",message);
      });
  }, []);

  useEffect(() => {
    socket &&
      socket.on("guinua",async (data) => {
        console.log("gửi nưa",data);
        const setarr = async () => {
         
          
            const t = await setArrivalMessage(
           
               {
                sender: data.userInfo,
                text: data.msg,
                createdAt: Date.now(),
              },
              );
            };
          
        setarr();
       
      });
  }, []);

  useEffect(() => {
    if (
      arrivalMessage &&
      arrivalMessage.text &&
      arrivalMessage.sender &&
      currentItem?.members?.includes(arrivalMessage.sender._id)
    ) {
      setMessage((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentItem]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get("/api/conversation/" + userInfo?._id);
        setConversation(res.data);
      } catch (error) {}
    };
    getConversation();
  }, [userInfo._id]);

  useEffect(() => {
    const getMessage = async () => {
      if (currentItem && currentItem._id) {
        const recei =
          currentItem.members &&
          currentItem.members.find((x) => x !== userInfo._id);
        setRecei(recei);
        const res = await axios.get("/api/message/" + currentItem?._id);
        const name = await axios.get("/api/users/" + recei);
        setName(name);
        setMessage(res.data);
      }
    };
    getMessage();
  }, [currentItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messages = {
      text: newMessage,
      sender: userInfo._id,
      conversationId: currentItem._id,
    };
    const mes = await axios.post("/api/message", messages);

    setMessage([...message, mes.data]);
    setNewMessage("");
    socket.emit("guilai", {
      msg: newMessage,
      userInfo: userInfo._id,
      userReceive: recei,
    });
  };
  useEffect(() => {
    if (ScollRef && ScollRef.current)
      ScollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Tìm kiếm" className="chatMenuInput" />
            {conversation.map((item, index) => (
              <div
                onClick={() => setCurrentItem(item)}
                style={{ cursor: "pointer" }}
              >
                <UserChat item={item} currentItem={userInfo._id} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentItem ? (
              <>
                {/* {setNumberMessage(0)} */}
                <div className="chatBoxTop">
                  {message.map((item, index) => (
                    <div ref={ScollRef} >
                      {
                        
                        (<Message
                          key={index+1}
                          message={item}
                          own={item?.sender === userInfo._id}
                          recei={recei}
                        />)
                      }
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder={`gửi tin nhắn đến ${name && name.data.name}`}
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Chọn người cần nhắn tin
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Thongbao;
