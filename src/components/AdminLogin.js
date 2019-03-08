import React, {useState} from 'react';
import { API_BASE_URL } from '../config';
import { Redirect } from 'react-router-dom';
import { normalizeResponseErrors } from '../functions/normalizeResponse';
import './AdminLogin.css';


export default function AdminLogin(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = e => {
    e.preventDefault(e);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return (fetch(`${API_BASE_URL}/api/auth/bigboss/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        username,
        password
      })
    }))
    .then(res => normalizeResponseErrors(res))
    .then(res => {
      return res.json();
    })
    .then(res => {
      setError(null);
      localStorage.removeItem('error');
      localStorage.setItem('user', username);
      localStorage.setItem('authToken', res.authToken);
      localStorage.setItem('userId', res.user.id);
      localStorage.setItem('loggedIn', true);
      console.log(localStorage);
    })
    .catch(err => {
      let message;
      if (err.code === 401) {
        message = 'Incorrect username or password';
        } else if (err.code === 403) {
          message = err.message;
        } else {
          message = 'Unable to login, please try again';
        }
      localStorage.setItem('error', message)
      setError(message)
    })
  };

  return (
    <section className='login-container'>
      
      {
        localStorage.loggedIn ? (
          <Redirect to='/dashboard' />
        ) : (
          <section className='login'>
            <form className='login-form'
              onSubmit={handleSubmit}
            >
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder='enter username'
                type='text'
                name='username'
                pattern='[A-Za-z0-9_]{1,15}'
                title='Username should only contain letters, numbers and underscores; no more than 15 characters e.g. Jojo_123'
                id='login-username'
                required
                aria-labelledby='login-username'
              />

              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='enter password'
                type='password'
                name='password'
                // pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$' 
                title='Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
                required
                id='login-password'
                aria-labelledby='login-password'
              />

              <button type='submit' className='login-submit'>
                Submit
              </button>
              {/* <Button /> */}
            </form>
            {error}
        </section>
        )
      }
  </section>
  );
}