import React, {useState} from 'react';
import { API_BASE_URL } from '../config';
import BusinessForm from './BusinessForm'
import { normalizeResponseErrors } from '../functions/normalizeResponse';

export default function AddBusiness(props) {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [telephone, setTelephone] = useState('')
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [hours, setHours] = useState({})
  const [resetHours, setResetHours] = useState(false)
  const [serverMessage, setServerMessage] = useState(null);

  const reset = () => {
    setBusinessName('')
    setCategory('')
    setTelephone('')
    setStreet('')
    setCity('')
    setState('')
    setZip('')
    setLatitude('')
    setLongitude('')
    setHours({})
    setResetHours(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return (fetch(`${API_BASE_URL}/business/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        'user_id': localStorage.userId,
        'name': businessName,
        category,
        'address': {
          street,
          city,
          state,
          zip,
          'coordinates': [longitude, latitude]
        },
        "hours": hours,
        telephone
      })
    }))
    .then(res => normalizeResponseErrors(res))
    .then(res => {
      return res.json();
    })
    .then(res => {
      setServerMessage(null);
      reset()
      setServerMessage(`${res.name} succesfully added`)
      setTimeout(() => { setServerMessage(null) }, 4000)
    })
    .catch(err => {
      let message;
      if (err.code === 422 || 400) {
        message = err.message;
        } else if (err.code === 500) {
          message = 'Internal server error';
        } else {
          message = 'Something went wrong, please try again later';
        }
      setServerMessage(message)
    })
  };

  const handleHoursChange = (day, value) => {
    hours[day] = value
  }
  
  return(
    <form className='add-business-form' onSubmit={handleSubmit}>
      <fieldset>
        <legend>Add New Business</legend>
        <BusinessForm
          {...props}

          handleHoursChange={handleHoursChange}

          businessName={businessName}
          setBusinessName={setBusinessName}

          category={category}
          setCategory={setCategory}

          telephone={telephone}
          setTelephone={setTelephone}

          street={street}
          setStreet={setStreet}

          city={city}
          setCity={setCity}

          state={state}
          setState={setState}

          zip={zip}
          setZip={setZip}

          latitude={latitude}
          setLatitude={setLatitude}

          longitude={longitude}
          setLongitude={setLongitude}

          resetHours={resetHours}
          setResetHours={setResetHours}
        />
        {serverMessage}
      </fieldset>
    </form>
  )
}