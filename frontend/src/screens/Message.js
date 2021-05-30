import React, { useState, useEffect } from "react";
import axios from "axios";
import * as timeago from "timeago.js";

function Message({ message, own, recei }) {
  // console.log("message",message);
  const [user, setUser] = useState();
  useEffect(() => {
    const getUser = async () => {
      try {
        if (message && message.sender && message.text) {
          {
            try {
              const res = await axios.get("/api/users/" + message?.sender);
              await setUser(res.data);
            } catch (error) {
              const res = await axios.get("/api/users/" + recei);
              await setUser(res.data);
            }
          }
        }
      } catch (error) {
        console.log("lỗi UserChat Router", error);
      }
    };
    getUser();
  }, []);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img className="messageImg" src={user?.logo} alt={user?.name} />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">{timeago.format(message?.createdAt)}</div>
    </div>
  );
}

export default Message;
