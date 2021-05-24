import React, { useState, useRef, useContext } from "react";
import { NameConText } from "./GlobalState";
import { Modal, Button, Input, Row, Col } from "antd";
import UserChat from "./UserChat";
import { useDispatch, useSelector } from "react-redux";
function Thongbao() {
  const state = useContext(NameConText);
  const socket = state.socket;
  const setListUser = state.setListUser;
  const listuser = state.listuser;
  const [selectITEM, setselectITEM] = useState();
const [message, setMessage] = useState("")
  const HanldeSelect = (item) => {
    setselectITEM(item);
  };
  const [room, setRoom] = useState()
  
  socket &&
    socket.on("sendmsg", (data) => {
        console.log('tin từ server',data.msg);
      let check = listuser.every((user) => user._id !== data.sender._id);
      setRoom(data.room);
      
      if (!check) {
        
      } else {
        setListUser([...listuser, data.sender]);

      }
    });
    const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const [currentItem, setCurrentItem] = useState();
  const sendmessage=()=>{
        currentItem  && socket && socket.emit("sendreceive",{
            msg:message,
            userInfo,
            currentItem:currentItem._id,
            room:room
  })}
  return (
    <>
      <Row>
        <Col span={8}>
          <div className="thongbao">
            <h2> nội dung</h2>
            {listuser.map((item, index) => (
              <div
                onClick={() => {
                  setCurrentItem(item);
                }}
                style={{ cursor: "pointer" }}
              >
                <UserChat key={index} item={item}></UserChat>
              </div>
            ))}
          </div>
        </Col>
        <Col span={16}>
          <div className="thongbao">
            {currentItem ? (
              <>
                <div className="">
                  <div className="">
                    <div>
                    
                    </div>
                    <input onChange={e=>setMessage(e.target.value)}></input>
                    <button onClick={sendmessage}>send</button>
                  </div>
                </div>
              </>
            ) : (
              <span>Mở cuộc trò chuyện mới </span>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Thongbao;
