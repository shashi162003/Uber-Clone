import React from 'react'

const LocationSearchPanel = (props) => {
    const { suggestions = [], setPanelOpen, setVehiclePanel, setPickup, setDestination, activeField } = props

    // Handle location selection
    const handleLocationSelect = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }

        // Don't close panel - let user continue entering other location
        // Panel will close when "Find Trip" is clicked
    }

    return (
        <div className="p-4">
            {/* Active field indicator */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 font-medium text-sm">
                    {activeField === 'pickup' ? '📍 Enter pickup location' : '🎯 Enter destination'}
                </p>
                <p className="text-blue-600 text-xs mt-1">
                    Select a suggestion below or continue typing
                </p>
            </div>

            {suggestions.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                    <p>Start typing to see location suggestions...</p>
                </div>
            ) : (
                <>
                    <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">
                            Suggestions ({suggestions.length})
                        </p>
                    </div>
                    {suggestions.map((suggestion, index) => (
                        <div
                            onClick={() => handleLocationSelect(suggestion)}
                            key={index}
                            className='flex gap-4 border-2 p-3 rounded-xl border-gray-100 hover:border-blue-300 hover:bg-blue-50 active:border-blue-500 items-center my-2 justify-start cursor-pointer transition-all duration-200'
                        >
                            <h2 className='bg-blue-100 h-8 flex items-center justify-center w-12 rounded-full text-blue-600'>
                                <i className="ri-map-pin-fill"></i>
                            </h2>
                            <div className='flex flex-col'>
                                <h4 className='font-medium text-base'>{suggestion}</h4>
                                <p className='text-sm text-gray-600'>Google Maps suggestion</p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default LocationSearchPanel