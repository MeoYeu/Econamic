import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { resetPassWord, sendEmail } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';


function SendTokenEmail(props) {

    const data=useSelector(state=>state.resetpassword);
    const {loading,error,success}=data;
    
    const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

    const dispatch = useDispatch();
    const sendHandlerEmail=(e)=>{
        e.preventDefault();
        
        dispatch(sendEmail(data.email.email))
      

    }
   
    return (
        <div>
            
            <form className='form' onSubmit={sendHandlerEmail}>
            <div>{loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}</div>
            <div>
                <h2 style={{color:'red'}}>Gửi mã xác nhận tới Email</h2>
            </div>
                <div>
                    <button type='submit'>Gửi mã</button>
                </div>
            </form>

        </div>
    )
}

export default SendTokenEmail
