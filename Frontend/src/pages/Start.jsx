
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import homepageCover from '../assets/homepage-cover.jpg'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center h-screen pt-8 flex justify-between flex-col w-full' style={{ backgroundImage: `url(${homepageCover})` }}>
        <img className='w-16 ml-8' src={logo} alt="Uber Logo" />
        <div className='bg-white pb-8 py-4 px-4'>
          <h2 className='text-[30px] font-semibold'>Get Started with Uber</h2>
          <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start