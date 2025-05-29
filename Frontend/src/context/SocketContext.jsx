
import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(`${import.meta.env.VITE_BASE_URL}`, {
            transports: ['polling', 'websocket'], // Try polling first, then websocket
            timeout: 20000,
            forceNew: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            maxReconnectionAttempts: 5,
            withCredentials: true,
            autoConnect: true
        });

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('✅ Connected to Socket.IO server:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from Socket.IO server:', reason);
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('🔴 Socket.IO connection error:', error);
            setIsConnected(false);
        });

        newSocket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected to Socket.IO server, attempt:', attemptNumber);
            setIsConnected(true);
        });

        newSocket.on('reconnect_error', (error) => {
            console.error('🔴 Socket.IO reconnection error:', error);
        });

        newSocket.on('reconnect_failed', () => {
            console.error('🔴 Socket.IO reconnection failed - max attempts reached');
            setIsConnected(false);
        });

        // Transport upgrade events
        newSocket.io.on('upgrade', () => {
            console.log('🟢 Transport upgraded to:', newSocket.io.engine.transport.name);
        });

        newSocket.io.on('upgradeError', (error) => {
            console.error('🔴 Transport upgrade error:', error);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            console.log('🧹 Cleaning up Socket.IO connection');
            newSocket.close();
        };
    }, []);

    // Helper functions for common socket operations
    const joinRoom = (data) => {
        if (socket && isConnected) {
            socket.emit('join', data);
            console.log(`📍 Joined room: ${data.userType}`, data);
        }
    };

    const sendRideRequest = (rideData) => {
        if (socket && isConnected) {
            socket.emit('ride-request', rideData);
            console.log('🚗 Ride request sent:', rideData);
        }
    };

    const updateCaptainLocation = (locationData) => {
        if (socket && isConnected) {
            socket.emit('update-location-captain', locationData);
            console.log('📍 Captain location updated:', locationData);
        }
    };

    const acceptRide = (rideData) => {
        if (socket && isConnected) {
            socket.emit('ride-accepted', rideData);
            console.log('✅ Ride accepted:', rideData);
        }
    };

    const completeRide = (rideData) => {
        if (socket && isConnected) {
            socket.emit('ride-completed', rideData);
            console.log('🏁 Ride completed:', rideData);
        }
    };

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            joinRoom,
            sendRideRequest,
            updateCaptainLocation,
            acceptRide,
            completeRide
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;