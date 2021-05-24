import React,{useState} from 'react'

function ForgetPassword() {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const submitHandler=()=>{

    }
    return (
        <div>
           <form className='form' onSubmit={submitHandler}>
           <div>
              
              <input
                id="password"
                type="password"
                placeholder="nhập mật khẩu mới"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div>
              
              <input
                id="confirmPassword"
                type="password"
                placeholder="nhập lại mật khẩu"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>
            <div>
              
              <input
                id="code"
                type="text"
                placeholder="nhập mã đăng nhập"
                onChange={(e) => setCode(e.target.value)}
              ></input>
            </div>
           </form>
        </div>
    )
}

export default ForgetPassword
