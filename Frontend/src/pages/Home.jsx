import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import logo from '../assets/logo.png'
import { generateUserAvatar } from '../utils/avatarGenerator'

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        if (socket && user) {
            socket.emit("join", { userType: "user", userId: user._id })

            // Set up event listeners
            const handleRideConfirmed = (ride) => {
                console.log('Ride confirmed:', ride);
                setVehicleFound(false)
                setWaitingForDriver(true)
                setRide(ride)
            }

            const handleRideStarted = (ride) => {
                console.log("Ride started:", ride)
                setWaitingForDriver(false)
                navigate('/riding', { state: { ride } })
            }

            const handleCaptainLocationUpdate = (data) => {
                console.log('Captain location update:', data);
                // Update captain location on map if needed
            }

            // Add event listeners
            socket.on('ride-confirmed', handleRideConfirmed)
            socket.on('ride-started', handleRideStarted)
            socket.on('captain-location-update', handleCaptainLocationUpdate)

            // Cleanup function
            return () => {
                socket.off('ride-confirmed', handleRideConfirmed)
                socket.off('ride-started', handleRideStarted)
                socket.off('captain-location-update', handleCaptainLocationUpdate)
            }
        }
    }, [socket, user, navigate])


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)

        // Only fetch suggestions if input is at least 3 characters
        if (e.target.value.length < 3) {
            setPickupSuggestions([])
            return
        }

        try {
            console.log('Fetching pickup suggestions for:', e.target.value)
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log('Pickup suggestions response:', response.data)
            setPickupSuggestions(response.data)
        } catch (error) {
            console.error('Error fetching pickup suggestions:', error)
            setPickupSuggestions([])
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)

        // Only fetch suggestions if input is at least 3 characters
        if (e.target.value.length < 3) {
            setDestinationSuggestions([])
            return
        }

        try {
            console.log('Fetching destination suggestions for:', e.target.value)
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log('Destination suggestions response:', response.data)
            setDestinationSuggestions(response.data)
        } catch (error) {
            console.error('Error fetching destination suggestions:', error)
            setDestinationSuggestions([])
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePanel])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)


    }

    async function createRide() {
        try {
            console.log('🚗 Creating ride with data:', { pickup, destination, vehicleType });

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            console.log('✅ Ride created successfully:', response.data);
            setRide(response.data);

        } catch (error) {
            console.error('❌ Error creating ride:', error);
            alert('Failed to create ride. Please try again.');
        }
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            {/* Header with logo and user avatar */}
            <div className='absolute left-5 top-5 z-10'>
                <img className='w-16' src={logo} alt="Uber Logo" />
            </div>
            <div className='absolute right-5 top-5 z-10'>
                <img
                    className='h-12 w-12 rounded-full object-cover border-2 border-white shadow-lg bg-white'
                    src={generateUserAvatar(user)}
                    alt="User Avatar"
                    onError={(e) => {
                        e.target.src = generateUserAvatar({ fullname: { firstname: 'User' } });
                    }}
                />
            </div>
            <div className='h-screen w-screen'>
                {/* image for temporary use  */}
                <LiveTracking />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                                // Clear destination suggestions when focusing on pickup
                                setDestinationSuggestions([])
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className={`bg-[#eee] px-12 py-2 text-lg rounded-lg w-full transition-all duration-200 ${activeField === 'pickup' && panelOpen ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                                }`}
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                                // Clear pickup suggestions when focusing on destination
                                setPickupSuggestions([])
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className={`bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3 transition-all duration-200 ${activeField === 'destination' && panelOpen ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                                }`}
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 h-[70vh] max-h-[500px]'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    selectedVehicle={vehicleType}
                    fare={fare}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 h-[75vh] max-h-[600px]'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}

                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 h-[75vh] max-h-[600px]'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12 h-[80vh] max-h-[700px]'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home