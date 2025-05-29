import React, { useState, useEffect, useContext } from 'react'
import { useJsApiLoader, GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import MapFallback from './MapFallback'
import { SocketContext } from '../context/SocketContext'

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: -3.745,
    lng: -38.523
};

// Static libraries array to prevent reloading
const libraries = ['places'];

const LiveTracking = ({ ride, showCaptain = false, showRoute = false }) => {
    const [currentPosition, setCurrentPosition] = useState(center);
    const [captainPosition, setCaptainPosition] = useState(null);
    const [directions, setDirections] = useState(null);
    const { socket } = useContext(SocketContext);

    // Load Google Maps API using the modern hook
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries // Use static libraries array
    });

    useEffect(() => {
        // Get initial position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            },
            (error) => {
                console.error('Error getting location:', error);
            }
        );

        // Watch position changes
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('📍 Position updated:', latitude, longitude);
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            },
            (error) => {
                console.error('Error watching location:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Listen for captain location updates if showing captain
    useEffect(() => {
        if (socket && showCaptain) {
            const handleCaptainLocationUpdate = (data) => {
                console.log('📍 Captain location update:', data);
                if (data.location) {
                    setCaptainPosition({
                        lat: data.location.ltd,
                        lng: data.location.lng
                    });
                }
            };

            socket.on('captain-location-update', handleCaptainLocationUpdate);

            return () => {
                socket.off('captain-location-update', handleCaptainLocationUpdate);
            };
        }
    }, [socket, showCaptain]);

    // Calculate route if needed
    useEffect(() => {
        if (showRoute && ride && isLoaded && window.google) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: ride.pickup,
                    destination: ride.destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error('Directions request failed:', status);
                    }
                }
            );
        }
    }, [showRoute, ride, isLoaded]);

    if (loadError) {
        return <MapFallback error={loadError} />;
    }

    if (!isLoaded) {
        return <MapFallback loading={true} />;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
            options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            }}
        >
            {/* User location marker */}
            <MarkerF
                position={currentPosition}
                icon={{
                    path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                    scale: 8,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                }}
                title="Your Location"
            />

            {/* Captain location marker */}
            {showCaptain && captainPosition && (
                <MarkerF
                    position={captainPosition}
                    icon={{
                        path: window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW || 0,
                        scale: 6,
                        fillColor: '#10B981',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        rotation: 0,
                    }}
                    title="Captain Location"
                />
            )}

            {/* Route directions */}
            {showRoute && directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        suppressMarkers: false,
                        polylineOptions: {
                            strokeColor: '#4285F4',
                            strokeWeight: 4,
                            strokeOpacity: 0.8,
                        },
                    }}
                />
            )}
        </GoogleMap>
    )
}

export default LiveTracking