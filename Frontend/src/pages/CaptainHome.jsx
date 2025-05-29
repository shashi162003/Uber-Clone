import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import logo from '../assets/logo.png'
import { generateCaptainAvatar } from '../utils/avatarGenerator'
import homepageCover from '../assets/homepage-cover.jpg'

const CaptainHome = () => {

    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ride, setRide] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        console.log('🔍 CaptainHome useEffect - Socket:', !!socket, 'Captain:', !!captain);
        console.log('🔍 Socket connected:', socket?.connected);

        if (socket && captain) {
            console.log('🔌 Captain connecting to socket with ID:', captain._id);
            console.log('🔌 Socket ID:', socket.id);

            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            })
            console.log('🚪 Captain joined socket room');

            // Test socket connection
            socket.emit('test-captain-connection', { captainId: captain._id });

            // Listen for connection confirmation
            socket.on('connection-confirmed', (data) => {
                console.log('✅ Socket connection confirmed:', data);
            });

            const updateLocation = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const location = {
                                ltd: position.coords.latitude,
                                lng: position.coords.longitude
                            };

                            console.log('📍 Updating captain location:', location);

                            // Emit to socket for real-time updates
                            socket.emit('update-location-captain', {
                                userId: captain._id,
                                location: location
                            });

                            // Also update in database via API
                            updateLocationInDatabase(location);
                        },
                        error => {
                            console.error('❌ Error getting location:', error);
                            alert('Please enable location access to receive ride requests');
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 60000
                        }
                    );
                }
            }

            const updateLocationInDatabase = async (location) => {
                try {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/update-location`, {
                        location: location
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    console.log('✅ Location updated in database');
                } catch (error) {
                    console.error('❌ Error updating location in database:', error);
                }
            };

            const locationInterval = setInterval(updateLocation, 10000)
            updateLocation() // Get location immediately

            // Set up event listeners
            const handleNewRide = (data) => {
                console.log('🚨 NEW RIDE EVENT RECEIVED!', data);
                console.log('🚨 Setting ride data and showing popup');
                setRide(data)
                setRidePopupPanel(true)
                console.log('🚨 Popup state set to true');

                // Play notification sound (optional)
                try {
                    const audio = new Audio('/notification.mp3') // You can add a notification sound file
                    audio.play().catch(e => console.log('Could not play notification sound'))
                } catch (e) {
                    console.log('Notification sound not available')
                }

                // Vibrate if supported (mobile)
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200])
                }
            }

            const handleNewRideRequest = (data) => {
                console.log('🚨 NEW RIDE REQUEST EVENT RECEIVED!', data);
                console.log('🚨 Setting ride data and showing popup');
                setRide(data)
                setRidePopupPanel(true)
                console.log('🚨 Popup state set to true');

                // Play notification sound (optional)
                try {
                    const audio = new Audio('/notification.mp3')
                    audio.play().catch(e => console.log('Could not play notification sound'))
                } catch (e) {
                    console.log('Notification sound not available')
                }

                // Vibrate if supported (mobile)
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200])
                }
            }

            // Add event listeners
            console.log('🎧 Registering socket event listeners for captain');
            socket.on('new-ride', handleNewRide)
            socket.on('new-ride-request', handleNewRideRequest)

            // Test event listeners
            socket.on('join-confirmed', (data) => {
                console.log('✅ Join confirmed:', data);
            });

            socket.on('test-captain-connection', (data) => {
                console.log('🧪 Test connection received:', data);
            });

            console.log('🎧 Event listeners registered: new-ride, new-ride-request, join-confirmed, test-captain-connection');

            // Cleanup function
            return () => {
                clearInterval(locationInterval)
                socket.off('new-ride', handleNewRide)
                socket.off('new-ride-request', handleNewRideRequest)
            }
        }
    }, [socket, captain])

    async function confirmRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride._id,
                captainId: captain._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
        } catch (error) {
            console.error('Error confirming ride:', error)
            alert('Failed to confirm ride. Please try again.')
        }
    }

    async function declineRide() {
        try {
            // You can implement a decline API endpoint here if needed
            // For now, just close the popup and notify via socket
            if (socket && ride) {
                socket.emit('ride-declined', {
                    rideId: ride._id,
                    captainId: captain._id
                })
            }

            setRidePopupPanel(false)
            setRide(null)

            // Optional: Show a brief notification
            console.log('Ride declined successfully')
        } catch (error) {
            console.error('Error declining ride:', error)
        }
    }


    useGSAP(function () {
        console.log('🎬 GSAP animation triggered - ridePopupPanel:', ridePopupPanel);
        if (ridePopupPanel) {
            console.log('🎬 Showing popup - animating to translateY(0)');
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            console.log('🎬 Hiding popup - animating to translateY(100%)');
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src={logo} alt="Uber Logo" />
                <div className='flex items-center gap-3'>
                    <img
                        className='h-10 w-10 rounded-full object-cover border-2 border-white shadow-lg'
                        src={generateCaptainAvatar(captain)}
                        alt="Captain Avatar"
                        onError={(e) => {
                            e.target.src = generateCaptainAvatar({ fullname: { firstname: 'Captain' } });
                        }}
                    />
                    <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </div>
            </div>
            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src={homepageCover} alt="Map Background" />

            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 h-[80vh] max-h-[700px]'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                    declineRide={declineRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome