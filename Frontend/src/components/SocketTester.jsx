import { useContext, useState, useEffect } from 'react'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'

const SocketTester = () => {
    const { socket, isConnected, joinRoom, sendRideRequest, updateCaptainLocation, acceptRide, completeRide } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)
    const [logs, setLogs] = useState([])
    const [testData, setTestData] = useState({
        pickup: '123 Main St',
        destination: '456 Oak Ave',
        vehicleType: 'car'
    })

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [...prev, { message, type, timestamp }])
    }

    useEffect(() => {
        if (socket) {
            // Listen to all socket events for testing
            const events = [
                'connect',
                'disconnect',
                'connect_error',
                'ride-confirmed',
                'ride-started',
                'ride-ended',
                'ride-completed',
                'captain-location-update',
                'new-ride-request',
                'new-ride',
                'ride-accepted'
            ]

            const handlers = {}

            events.forEach(event => {
                handlers[event] = (data) => {
                    addLog(`📡 Received: ${event}`, 'success')
                    console.log(`Socket event: ${event}`, data)
                }
                socket.on(event, handlers[event])
            })

            return () => {
                events.forEach(event => {
                    socket.off(event, handlers[event])
                })
            }
        }
    }, [socket])

    const testJoinRoom = () => {
        if (user) {
            joinRoom({ userType: 'user', userId: user._id })
            addLog('🚪 Joined user room', 'info')
        } else {
            addLog('❌ No user data available', 'error')
        }
    }

    const testJoinCaptainRoom = () => {
        joinRoom({ userType: 'captain', userId: 'test-captain-id' })
        addLog('🚪 Joined captain room', 'info')
    }

    const testSendRideRequest = () => {
        sendRideRequest({
            pickup: testData.pickup,
            destination: testData.destination,
            vehicleType: testData.vehicleType,
            userId: user?._id || 'test-user-id'
        })
        addLog('🚗 Sent ride request', 'info')
    }

    const testUpdateLocation = () => {
        updateCaptainLocation({
            userId: 'test-captain-id',
            location: {
                ltd: 40.7128,
                lng: -74.0060
            }
        })
        addLog('📍 Updated captain location', 'info')
    }

    const testAcceptRide = () => {
        acceptRide({
            rideId: 'test-ride-id',
            captainId: 'test-captain-id',
            userId: user?._id || 'test-user-id'
        })
        addLog('✅ Accepted ride', 'info')
    }

    const testCompleteRide = () => {
        completeRide({
            rideId: 'test-ride-id',
            captainId: 'test-captain-id',
            userId: user?._id || 'test-user-id'
        })
        addLog('🏁 Completed ride', 'info')
    }

    const clearLogs = () => {
        setLogs([])
    }

    return (
        <div className="fixed bottom-4 left-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-hidden">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">Socket.IO Tester</h3>
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={testJoinRoom} className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                        Join User
                    </button>
                    <button onClick={testJoinCaptainRoom} className="px-2 py-1 bg-purple-500 text-white text-xs rounded">
                        Join Captain
                    </button>
                    <button onClick={testSendRideRequest} className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                        Send Ride
                    </button>
                    <button onClick={testUpdateLocation} className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                        Update Location
                    </button>
                    <button onClick={testAcceptRide} className="px-2 py-1 bg-orange-500 text-white text-xs rounded">
                        Accept Ride
                    </button>
                    <button onClick={testCompleteRide} className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                        Complete Ride
                    </button>
                </div>
                <button onClick={clearLogs} className="w-full px-2 py-1 bg-gray-500 text-white text-xs rounded">
                    Clear Logs
                </button>
            </div>

            <div className="border-t pt-2">
                <h4 className="font-semibold text-sm mb-2">Event Logs:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                    {logs.map((log, index) => (
                        <div key={index} className={`text-xs p-1 rounded ${
                            log.type === 'success' ? 'bg-green-100 text-green-800' :
                            log.type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            <span className="font-mono text-xs text-gray-500">{log.timestamp}</span> {log.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SocketTester
