import React from 'react'
import { generateCaptainAvatar } from '../utils/avatarGenerator'

const WaitingForDriver = (props) => {
  return (
    <div className='h-full flex flex-col'>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.setWaitingForDriver(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

      <h3 className='text-2xl font-semibold mb-5'>Driver Found!</h3>

      <div className='flex-1 flex flex-col justify-between'>
        <div>
          <div className='flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg'>
            <img
              className='h-16 w-16 rounded-full object-cover border-2 border-green-200'
              src={generateCaptainAvatar(props.ride?.captain)}
              alt="Captain Avatar"
              onError={(e) => {
                e.target.src = generateCaptainAvatar({ fullname: { firstname: 'Captain' } });
              }}
            />
            <div className='text-right'>
              <h2 className='text-lg font-medium capitalize'>{props.ride?.captain?.fullname?.firstname || 'Driver'}</h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain?.vehicle?.plate || 'ABC-123'}</h4>
              <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
              <div className='mt-2 bg-green-100 px-3 py-1 rounded-full'>
                <span className='text-sm font-medium text-green-800'>OTP: {props.ride?.otp || '1234'}</span>
              </div>
            </div>
          </div>

          <div className='w-full'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-user-fill text-lg"></i>
              <div>
                <h3 className='text-lg font-medium'>Pickup Location</h3>
                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Destination</h3>
                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-currency-line text-lg"></i>
              <div>
                <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 p-4 bg-blue-50 rounded-lg text-center'>
          <p className='text-blue-800 font-medium'>Your driver is on the way!</p>
          <p className='text-blue-600 text-sm mt-1'>Please wait at the pickup location</p>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver