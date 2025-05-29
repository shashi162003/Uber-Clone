import React, { useState } from 'react'
import { generateUserAvatar } from '../utils/avatarGenerator'

const RidePopUp = (props) => {
    const [isAccepting, setIsAccepting] = useState(false)
    const handleDeclineRide = () => {
        // Call decline function if provided
        if (props.declineRide) {
            props.declineRide()
        }
        // Close the popup
        props.setRidePopupPanel(false)
    }

    return (
        <div className='h-full flex flex-col'>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <div className='flex-1 flex flex-col'>
                <h3 className='text-2xl font-semibold mb-5'>🚗 New Ride Request!</h3>

                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg mt-4 shadow-lg'>
                    <div className='flex items-center gap-3'>
                        <img
                            className='h-12 rounded-full object-cover w-12 border-2 border-white'
                            src={generateUserAvatar(props.ride?.user)}
                            alt="User Avatar"
                            onError={(e) => {
                                e.target.src = generateUserAvatar({ fullname: { firstname: 'User' } });
                            }}
                        />
                        <div>
                            <h2 className='text-lg font-medium text-white'>
                                {props.ride?.user?.fullname?.firstname + " " + props.ride?.user?.fullname?.lastname || 'User'}
                            </h2>
                            <p className='text-sm text-yellow-100'>⭐ 4.8 rating</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <h5 className='text-lg font-semibold text-white'>2.2 KM</h5>
                        <p className='text-sm text-yellow-100'>~5 mins away</p>
                    </div>
                </div>
                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>
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
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 w-full flex flex-col gap-3'>
                        <button
                            onClick={async () => {
                                if (props.ride?.isTestRide) {
                                    console.log('🧪 Test ride accepted - not calling real API');
                                    alert('✅ Test ride accepted! This is just a test.');
                                    return;
                                }
                                setIsAccepting(true)
                                try {
                                    props.setConfirmRidePopupPanel(true)
                                    await props.confirmRide()
                                } catch (error) {
                                    console.error('Error accepting ride:', error)
                                    setIsAccepting(false)
                                }
                            }}
                            disabled={isAccepting}
                            className={`w-full font-semibold p-3 px-10 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${isAccepting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                        >
                            {isAccepting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Accepting...
                                </>
                            ) : (
                                <>
                                    <i className="ri-check-line text-lg"></i>
                                    {props.ride?.isTestRide ? '🧪 Test Accept' : 'Accept Ride'}
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleDeclineRide}
                            className='w-full bg-red-500 hover:bg-red-600 text-white font-semibold p-3 px-10 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                        >
                            <i className="ri-close-line text-lg"></i>
                            Decline Ride
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp