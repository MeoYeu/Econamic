import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendEmail, updatePassWord } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import toast, { Toaster } from "../../node_modules/react-hot-toast/dist/index";


function SearchMail(props) {
  const [email, setEmail] = useState("");
  // const resetpassword = useSelector((state) => state.resetpassword);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
const newpasss=useSelector(state=>state.sendMailReducer);
const { loading, error, success } = newpasss;
  const dispatch = useDispatch();
  const check=false;
  const submitHandler =async (e) => {
    e.preventDefault();
  
   dispatch(sendEmail(email))
  //  console.log("success",success);
  
  };
  
 useEffect(() => {
   
  if(success)
  {
   toast.success('check email')
    
  }
 }, [success,dispatch])

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <form className="form" onSubmit={submitHandler}>
        <div>{loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}</div>

        <div>
          <label htmlFor="name">Email</label>
          <input
            type="email"
            id="email"
            placeholder="nhập email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
            <button type='submit' className='primary'>Tiếp tục</button>
        </div>
      </form>
    </div>
  );
}
export default SearchMail;
