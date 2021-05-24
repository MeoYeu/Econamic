import React,{useState} from 'react'

function TokenEmail() {
    const [token, setToken] = useState('')
    return (
        <div>
            
            <form className='form'>
            <div>
          <label htmlFor="name">Email</label>
          <input
            type="text"
            id="token"
            placeholder="nhập mã"
            required
            onChange={(e) => setToken(e.target.value)}
          ></input>
        </div>
        <div>
            <button type='submit' className='primary'>Tiếp tục</button>
        </div>

            </form>
        </div>
    )
}

export default TokenEmail
