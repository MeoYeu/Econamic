import React, { useState ,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetPassWord } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import toast, { Toaster } from "../../node_modules/react-hot-toast/dist/index";

function ResetPassWord(props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const newpass=useSelector(state=>state.newpassReducer);
  const token = props.location.search
    ? props.location.search.split('=')[1]
    : '/';
  const {loading,error,success}=newpass;
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const handlerSubmit=(e)=>{
    e.preventDefault();
    if(password!==confirmPassword)
    {
        alert('nhập lại mật khẩu không khớp');
    }
    dispatch(resetPassWord(password,token));
    
  }
  
  useEffect(() => {
    
     if(success)
     {
         
          props.history.push('/signin')
       
        
     }
  }, [props.history,success])
  return (
    <div>
      <div>
        <Toaster />
      </div>
      <form className="form" onSubmit={handlerSubmit}>
      <div>{loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}</div>
        <div>
          <h3>đặt lại mật khẩu</h3>
        </div>
        <div>
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="nhập lại mật khẩu"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
            <button type="submit" className='primary'>Cập nhật</button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassWord;
