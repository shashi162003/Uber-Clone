import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { generateUserAvatar } from '../utils/avatarGenerator'


const FinishRide = (props) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    async function endRide() {
        setIsLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/rides/end-ride`, {
                rideId: props.ride._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                navigate('/captain-home')
            }
        } catch (error) {
            console.error('Error ending ride:', error)
            alert('Failed to end ride. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>
            <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img
                        className='h-12 rounded-full object-cover w-12 border-2 border-blue-200'
                        src={generateUserAvatar(props.ride?.user)}
                        alt="User Avatar"
                        onError={(e) => {
                            e.target.src = generateUserAvatar({ fullname: { firstname: 'User' } });
                        }}
                    />
                    <h2 className='text-lg font-medium'>{props.ride?.user?.fullname?.firstname || 'User'}</h2>
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

                <div className='mt-10 w-full'>
                    <button
                        onClick={endRide}
                        disabled={isLoading}
                        className={`w-full mt-5 flex text-lg justify-center items-center font-semibold p-3 rounded-lg transition-all duration-200 ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Finishing Ride...
                            </>
                        ) : (
                            'Finish Ride'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FinishRide