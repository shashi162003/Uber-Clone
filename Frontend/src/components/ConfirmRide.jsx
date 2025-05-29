import React, { useState } from 'react'

const ConfirmRide = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className='h-full flex flex-col'>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

            <div className='flex-1 flex flex-col justify-between'>
                <div className='flex flex-col items-center'>
                    <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />

                    <div className='w-full mt-5'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="ri-map-pin-user-fill text-lg"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Pickup Location</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Destination</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line text-lg"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        setIsLoading(true)
                        try {
                            props.setVehicleFound(true)
                            props.setConfirmRidePanel(false)
                            await props.createRide()
                        } catch (error) {
                            console.error('Error creating ride:', error)
                            setIsLoading(false)
                        }
                    }}
                    disabled={isLoading}
                    className={`w-full mt-5 font-semibold p-3 rounded-lg transition-all duration-200 flex justify-center items-center ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Creating Ride...
                        </>
                    ) : (
                        'Confirm'
                    )}
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide