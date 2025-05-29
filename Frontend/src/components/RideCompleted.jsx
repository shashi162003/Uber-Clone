import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateCaptainAvatar } from '../utils/avatarGenerator'

const RideCompleted = ({ ride, onClose }) => {
    const navigate = useNavigate()
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)

    const handlePayment = async () => {
        setIsProcessingPayment(true)
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))
            // In a real app, this would integrate with payment gateway
            alert('Payment processed successfully! Thank you for riding with us.')
            onClose()
            navigate('/home')
        } catch (error) {
            console.error('Payment error:', error)
            alert('Payment failed. Please try again.')
        } finally {
            setIsProcessingPayment(false)
        }
    }

    const handlePayLater = () => {
        alert('Payment will be processed later. Thank you for riding with us.')
        onClose()
        navigate('/home')
    }

    return (
        <div className='h-full flex flex-col bg-white'>
            {/* Header */}
            <div className='p-6 bg-green-50 text-center border-b'>
                <div className='mb-4'>
                    <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <i className="ri-check-line text-3xl text-white"></i>
                    </div>
                    <h2 className='text-2xl font-bold text-green-800'>Ride Completed!</h2>
                    <p className='text-green-600 mt-1'>Thank you for riding with us</p>
                </div>
            </div>

            {/* Ride Summary */}
            <div className='flex-1 p-6'>
                {/* Captain Info */}
                <div className='flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-3'>
                        <img
                            className='h-16 w-16 rounded-full object-cover border-2 border-green-200'
                            src={generateCaptainAvatar(ride?.captain)}
                            alt="Captain Avatar"
                            onError={(e) => {
                                e.target.src = generateCaptainAvatar({ fullname: { firstname: 'Captain' } });
                            }}
                        />
                        <div>
                            <h3 className='text-lg font-medium capitalize'>
                                {ride?.captain?.fullname?.firstname || 'Driver'}
                            </h3>
                            <p className='text-sm text-gray-600'>
                                {ride?.captain?.vehicle?.plate || 'ABC-123'} • {ride?.captain?.vehicle?.vehicleType || 'Car'}
                            </p>
                            <div className='flex items-center mt-1'>
                                <div className='flex text-yellow-400'>
                                    {'★'.repeat(5)}
                                </div>
                                <span className='text-sm text-gray-600 ml-1'>5.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trip Details */}
                <div className='space-y-4 mb-6'>
                    <div className='flex items-center gap-4 p-3 border-b'>
                        <i className="ri-map-pin-user-fill text-lg text-blue-600"></i>
                        <div className='flex-1'>
                            <h4 className='font-medium'>Pickup</h4>
                            <p className='text-sm text-gray-600'>{ride?.pickup || 'Pickup location'}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-3 border-b'>
                        <i className="ri-map-pin-2-fill text-lg text-red-600"></i>
                        <div className='flex-1'>
                            <h4 className='font-medium'>Destination</h4>
                            <p className='text-sm text-gray-600'>{ride?.destination || 'Destination'}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-3 border-b'>
                        <i className="ri-time-line text-lg text-gray-600"></i>
                        <div className='flex-1'>
                            <h4 className='font-medium'>Trip Duration</h4>
                            <p className='text-sm text-gray-600'>
                                {ride?.duration ? `${Math.round(ride.duration / 60)} minutes` : '15 minutes'}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-3'>
                        <i className="ri-map-line text-lg text-gray-600"></i>
                        <div className='flex-1'>
                            <h4 className='font-medium'>Distance</h4>
                            <p className='text-sm text-gray-600'>
                                {ride?.distance ? `${(ride.distance / 1000).toFixed(1)} km` : '5.2 km'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fare Breakdown */}
                <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                    <h3 className='text-lg font-semibold mb-3'>Fare Details</h3>
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <span>Base Fare</span>
                            <span>₹{Math.round((ride?.fare || 0) * 0.7)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Distance Charge</span>
                            <span>₹{Math.round((ride?.fare || 0) * 0.2)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Time Charge</span>
                            <span>₹{Math.round((ride?.fare || 0) * 0.1)}</span>
                        </div>
                        <div className='border-t pt-2 mt-2'>
                            <div className='flex justify-between font-semibold text-lg'>
                                <span>Total Amount</span>
                                <span className='text-green-600'>₹{ride?.fare || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Buttons */}
            <div className='p-6 border-t bg-white'>
                <div className='space-y-3'>
                    <button
                        onClick={handlePayment}
                        disabled={isProcessingPayment}
                        className={`w-full font-semibold py-4 rounded-lg text-lg transition-all duration-200 flex justify-center items-center ${isProcessingPayment
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {isProcessingPayment ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing Payment...
                            </>
                        ) : (
                            <>💳 Pay ₹{ride?.fare || 0} Now</>
                        )}
                    </button>

                    <button
                        onClick={handlePayLater}
                        disabled={isProcessingPayment}
                        className={`w-full font-semibold py-3 rounded-lg transition-colors ${isProcessingPayment
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        Pay Later
                    </button>
                </div>

                <div className='mt-4 text-center'>
                    <p className='text-xs text-gray-500'>
                        Payment is secure and encrypted. You can also pay cash to the driver.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RideCompleted
