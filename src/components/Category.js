import React, { useState, useEffect } from 'react';
import './Category.css';
import Search from './Search';
import NavBar from './NavBar';
import { normalizeResponseErrors } from '../functions/normalizeResponse';
const {API_BASE_URL} = require('../config');


export default function Businesses(props) {
  const [businesses, setBusinesses] = useState('');
  const [fetchingData, setFetchingData] = useState(true)

  const fetchCategory = async () => {
    const response = await fetch(`${API_BASE_URL}${props.props.location.pathname}${props.props.location.search}`)
    const normalize = await normalizeResponseErrors(response)
    const rcvdBusinesses = await normalize.json()
    setBusinesses(rcvdBusinesses)
    setFetchingData(false)
  }
  
  useEffect(
    () => {
      fetchCategory()
    }, []
  )

  const viewBusiness = (e) => {
    e.preventDefault()
    let businessId = e.target.id
    props.props.history.push(`/business/${businessId}`)
  }

  // 2. Display Results
  let business;
  let title;
  if (businesses.length > 0) {
    title = 'Businesses';
    business = businesses.map((business, index) => {
      return (
        <div className='listedBusinesses' key={index}>
          <h3>{business.name}</h3>
          <div className='location'>
            {business.city}
            {business.state}
          </div>
          <input type='button' id={business.id} key={index} value='View Business' onClick={viewBusiness}></input>
        </div>
      )
    })
  } else {
    title = 'No businesses in this area'
    business = 'Submit a business'
  }

  if(fetchingData) return (<div className='businesses'><h2>Getting the data insert a spining wheel</h2></div>)
  return (
    <div className='businesses'>
      <NavBar />
      <Search {...props} />
      <div>
      <h2>{title}</h2>
      <div>{business}</div>
      </div>
    </div>
  );
}