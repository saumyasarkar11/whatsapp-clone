import React, {useState} from 'react'
import './Login.css'
import LoginIcon from '@mui/icons-material/Login';
import axios from '../axios';
import logo from '../images/whatsapp.png';

export default function LoginAlt({setStat}) {
  const [formData, setFormData] = useState(
    {
        phone: "",
        password: "",
        keepSigned: true
    }
  )  
  
  function handleChange(event){
    const{name, value, type, checked} = event.target
    (type === "number" && value.length < 10) &&
    setFormData(prevData => {
        return (                 
            {
                ...prevData,    
                [name]: type === "checkbox" ? checked : value
            }
        )
    })
  }
  
  function handleSubmit(e){
    e.preventDefault();
    axios.get(`/api/v1/auth?phone=${formData.phone}&password=${formData.password}`).then((response) => {
        if(response.data.log){
            localStorage.setItem('rememberMe', formData.keepSigned);
            localStorage.setItem('user', formData.phone);
            localStorage.setItem('user_id', response.data.id);
            localStorage.setItem('image', response.data.image);
            setStat(true);
        } else {
            alert("Phone number or password is wrong");
        }
    })        
  }

  return (
    <div className='login-wrapper'>
      <div className='login-card'>
        <div className='login-card-body'>
          <h4><img src={logo} style={{"height": "30px"}}/>&nbsp;WhatsApp Web</h4>
          <div align='center'>
            <h2>Sign in to account</h2>
            <hr />
          </div>  
          <form className='login-form' onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control"
                type="text" 
                onChange={handleChange} 
                name='phone' 
                placeholder='Phone'
                value={formData.phone} 
                required 
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                type="password" 
                onChange={handleChange} 
                name='password'
                placeholder='Password'
                value={formData.password} 
                required 
              />
            </div>
            <div className='mb-3' style={{display: "flex", alignItems: "center"}}>
              <input
                type="checkbox"
                id="signed"
                className='form-check'
                onChange={handleChange} 
                name='keepSigned'
                checked={formData.keepSigned}
              />
                <label htmlFor="signed" style={{"fontSize": "14px"}}>Keep me signed in</label>
            </div>
            
            {/* <Form.Group className="mb-3 forgot_link">
                <a href="https://saumyasarkar.com">Forgot Password?</a>
            </Form.Group> */}
            <button type='submit' className='btn' name="submitBtn">Sign In</button>
          </form>  
          <p>Privacy Policy | Terms and Conditions</p>      
        </div>
        <div className='login-card-background' align="center">
          <h2>Hello, Friend!</h2>
          <hr />
          <p>Fill up personal information and start your journey with us.</p>
          <button type='button'>Sign Up</button>
        </div>
      </div>
    </div>
  )
}
