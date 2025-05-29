import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { generateUserAvatar } from '../utils/avatarGenerator'

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()

        // Handle test rides differently
        if (props.ride?.isTestRide) {
            console.log('🧪 Test ride - skipping OTP validation');
            alert('✅ Test ride started successfully! This is just a test.');
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            return;
        }

        setIsLoading(true)
        try {
            console.log('🚀 Starting ride with OTP:', otp);
            console.log('🚀 Ride ID:', props.ride._id);

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: props.ride._id,
                    otp: otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                console.log('✅ Ride started successfully');
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: props.ride } })
            }
        } catch (error) {
            console.error('❌ Error starting ride:', error);
            console.error('❌ Error response:', error.response?.data);

            if (error.response?.status === 400) {
                alert('Invalid OTP or ride details. Please check and try again.');
            } else {
                alert('Failed to start ride. Please try again.');
            }
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>
                {props.ride?.isTestRide ? '🧪 Test Ride - Confirm to Start' : 'Confirm this ride to Start'}
            </h3>
            <div className={`flex items-center justify-between p-3 border-2 rounded-lg mt-4 ${props.ride?.isTestRide ? 'border-red-400 bg-red-50' : 'border-yellow-400'
                }`}>
                <div className='flex items-center gap-3 '>
                    <img
                        className='h-12 rounded-full object-cover w-12 border-2 border-blue-200'
                        src={generateUserAvatar(props.ride?.user)}
                        alt="User Avatar"
                        onError={(e) => {
                            e.target.src = generateUserAvatar({ fullname: { firstname: 'User' } });
                        }}
                    />
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user?.fullname?.firstname || 'Test User'}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>

                <div className='mt-6 w-full'>
                    <form onSubmit={submitHander}>
                        {props.ride?.isTestRide ? (
                            <div className='mt-3 p-4 bg-red-100 border border-red-300 rounded-lg'>
                                <p className='text-red-800 font-medium'>🧪 Test Ride Mode</p>
                                <p className='text-red-600 text-sm mt-1'>No OTP required for test rides</p>
                            </div>
                        ) : (
                            <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                type="text"
                                className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3'
                                placeholder='Enter OTP'
                                required={!props.ride?.isTestRide}
                            />
                        )}

                        <button
                            disabled={isLoading}
                            className={`w-full mt-5 text-lg flex justify-center items-center font-semibold p-3 rounded-lg transition-all duration-200 ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : props.ride?.isTestRide
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Starting Ride...
                                </>
                            ) : (
                                props.ride?.isTestRide ? '🧪 Start Test Ride' : 'Confirm'
                            )}
                        </button>
                        <button onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                            props.setRidePopupPanel(false)

                        }} className='w-full mt-2 bg-gray-600 text-lg text-white font-semibold p-3 rounded-lg'>Cancel</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp