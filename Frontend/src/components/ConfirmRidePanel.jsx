import React from 'react'
import car from '../assets/car.png'
import bike from '../assets/bike.png'
import auto from '../assets/auto.png'

const ConfirmRidePanel = ({ selectedVehicle, setConfirmRidePanel, setVehiclePanel, selectedLocation, pickup, destination, setLookingForDriver }) => {

    const getVehicleDetails = () => {
        switch (selectedVehicle) {
            case 'car':
                return {
                    image: car,
                    name: 'UberGo',
                    capacity: 4,
                    time: '2 mins away',
                    price: '₹193.20',
                    description: 'Affordable, compact rides'
                }
            case 'bike':
                return {
                    image: bike,
                    name: 'Moto',
                    capacity: 1,
                    time: '3 mins away',
                    price: '₹65.35',
                    description: 'Affordable motorcycle rides'
                }
            case 'auto':
                return {
                    image: auto,
                    name: 'UberAuto',
                    capacity: 3,
                    time: '2 mins away',
                    price: '₹118.86',
                    description: 'Affordable Auto rides'
                }
            default:
                return null
        }
    }

    const vehicleDetails = getVehicleDetails()

    if (!vehicleDetails) return null

    return (
        <div>
            <h5
                onClick={() => {
                    setConfirmRidePanel(false)
                    setVehiclePanel(true)
                }}
                className='p-1 text-center absolute top-0 w-[93%] cursor-pointer'
            >
                <i className="ri-arrow-down-wide-fill text-3xl text-gray-200"></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

            <div className='flex w-full items-center justify-between p-3 bg-white border-2 border-black rounded-xl mb-4'>
                <img className='h-12' src={vehicleDetails.image} alt="" />
                <div className='w-1/2 ml-2'>
                    <h4 className='font-medium text-base'>
                        {vehicleDetails.name} <span><i className="ri-user-fill"></i>{vehicleDetails.capacity}</span>
                    </h4>
                    <h5 className='font-medium text-sm'>{vehicleDetails.time}</h5>
                    <p className='font-normal text-xs text-gray-600'>{vehicleDetails.description}</p>
                </div>
                <h2 className='text-lg font-semibold'>{vehicleDetails.price}</h2>
            </div>

            <div className='w-full mt-5'>
                <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                    <i className="ri-map-pin-user-fill text-lg"></i>
                    <div>
                        <h3 className='text-lg font-medium'>{pickup || 'Current Location'}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Pickup Location</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                    <i className="ri-map-pin-2-fill text-lg"></i>
                    <div>
                        <h3 className='text-lg font-medium'>{selectedLocation?.address || destination || 'Select Destination'}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{selectedLocation?.fullAddress || 'Destination Location'}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className="ri-currency-line text-lg"></i>
                    <div>
                        <h3 className='text-lg font-medium'>{vehicleDetails.price}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                    </div>
                </div>
            </div>

            <button
                className='w-full mt-5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-3 transition-colors duration-200'
                onClick={() => {
                    // Hide confirm panel and show looking for driver
                    setConfirmRidePanel(false)
                    setLookingForDriver(true)
                }}
            >
                Confirm Ride
            </button>
        </div>
    )
}

export default ConfirmRidePanel
