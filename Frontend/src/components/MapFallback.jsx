import React from 'react'

const MapFallback = ({ error = null, loading = false }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Google Maps...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center p-6">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Unavailable</h3>
                    <p className="text-gray-600 mb-4">
                        Unable to load Google Maps. Please check your internet connection.
                    </p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center p-6">
                <div className="text-gray-400 text-4xl mb-4">🗺️</div>
                <p className="text-gray-600">Map component not available</p>
            </div>
        </div>
    )
}

export default MapFallback
