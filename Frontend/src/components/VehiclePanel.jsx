import React from 'react'
import car from '../assets/car.png'
import bike from '../assets/bike.png'
import auto from '../assets/auto.png'

const VehiclePanel = ({ setVehiclePanel, selectVehicle, fare, setConfirmRidePanel, selectedVehicle }) => {
    return (
        <div className='h-full flex flex-col'>
            <h5 onClick={() => setVehiclePanel(false)} className='p-1 text-center absolute top-0 w-[93%] '><i className="ri-arrow-down-wide-fill text-3xl text-gray-200"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>
            <div className='flex-1 overflow-y-auto'>
                <div
                    onClick={() => {
                        selectVehicle('car')
                        setConfirmRidePanel(true)
                        setVehiclePanel(false)
                    }}
                    className={`flex w-full items-center justify-between p-3 bg-white border-2 rounded-xl mb-2 cursor-pointer transition-all duration-200 ${selectedVehicle === 'car'
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <img className='h-12' src={car} alt="" />
                    <div className='w-1/2 ml-2'>
                        <h4 className='font-medium text-base'>UberGo <span><i className="ri-user-fill"></i>4</span></h4>
                        <h5 className='font-medium text-sm'>{Math.floor(Math.random() * 3) + 2} mins away</h5>
                        <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                    </div>
                    <h2 className='text-lg font-semibold'>₹{fare?.car || '193.20'}</h2>
                </div>
                <div
                    onClick={() => {
                        selectVehicle('bike')
                        setConfirmRidePanel(true)
                        setVehiclePanel(false)
                    }}
                    className={`flex w-full items-center justify-between p-3 bg-white border-2 rounded-xl mb-2 cursor-pointer transition-all duration-200 ${selectedVehicle === 'bike'
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <img className='h-12' src={bike} alt="" />
                    <div className='w-1/2 ml-2'>
                        <h4 className='font-medium text-base'>Moto <span><i className="ri-user-fill"></i>1</span></h4>
                        <h5 className='font-medium text-sm'>{Math.floor(Math.random() * 4) + 2} mins away</h5>
                        <p className='font-normal text-xs text-gray-600'>Affordable motorcycle rides</p>
                    </div>
                    <h2 className='text-lg font-semibold'>₹{fare?.motorcycle || '65.35'}</h2>
                </div>
                <div
                    onClick={() => {
                        selectVehicle('auto')
                        setConfirmRidePanel(true)
                        setVehiclePanel(false)
                    }}
                    className={`flex w-full items-center justify-between p-3 bg-white border-2 rounded-xl mb-2 cursor-pointer transition-all duration-200 ${selectedVehicle === 'auto'
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <img className='h-12' src={auto} alt="" />
                    <div className='w-1/2 ml-2'>
                        <h4 className='font-medium text-base'>UberAuto <span><i className="ri-user-fill"></i>3</span></h4>
                        <h5 className='font-medium text-sm'>{Math.floor(Math.random() * 3) + 1} mins away</h5>
                        <p className='font-normal text-xs text-gray-600'>Affordable Auto rides</p>
                    </div>
                    <h2 className='text-lg font-semibold'>₹{fare?.auto || '118.86'}</h2>
                </div>
            </div>
        </div>
    )
}

export default VehiclePanel