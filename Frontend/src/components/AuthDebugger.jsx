import React from 'react';
import axios from 'axios';

const AuthDebugger = () => {
    const testAuthentication = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found. Please login first.');
                return;
            }

            console.log('🔍 Testing captain authentication...');

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/captains/debug-auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 10000
            });

            console.log('✅ Authentication successful:', response.data);
            alert(`✅ Authentication successful!\nName: ${response.data.captain.firstname}\nEmail: ${response.data.captain.email}\nStatus: ${response.data.captain.status}`);

        } catch (error) {
            console.error('❌ Authentication test failed:', error);
            console.error('❌ Error response:', error.response?.data);

            if (error.response?.status === 401) {
                alert(`❌ Authentication failed: ${error.response.data.message}`);
            } else {
                alert('❌ Authentication test failed. Check console for details.');
            }
        }
    };

    const testLocationUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found. Please login first.');
                return;
            }

            console.log('🔍 Testing location update...');

            const mockLocation = {
                ltd: 19.0760,
                lng: 72.8777
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/captains/update-location`, {
                location: mockLocation
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            console.log('✅ Location update successful:', response.data);
            alert(`✅ Location updated successfully!\nStatus: ${response.data.status}\nLocation: ${response.data.location.ltd}, ${response.data.location.lng}`);

        } catch (error) {
            console.error('❌ Location update failed:', error);
            console.error('❌ Error response:', error.response?.data);

            if (error.response?.status === 401) {
                alert(`❌ Location update failed: ${error.response.data.message}`);
            } else {
                alert('❌ Location update failed. Check console for details.');
            }
        }
    };

    const showTokenInfo = () => {
        const token = localStorage.getItem('token');
        const captain = localStorage.getItem('captain');

        console.log('🔍 Token info:');
        console.log('Token exists:', !!token);
        console.log('Token length:', token?.length || 0);
        console.log('Captain data:', captain ? JSON.parse(captain) : 'None');

        // Decode JWT to show captain ID
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('🔍 Token captain ID:', payload._id);
                console.log('🔍 Token expires:', new Date(payload.exp * 1000));
                alert(`Token exists: ${!!token}\nToken captain ID: ${payload._id}\nExpires: ${new Date(payload.exp * 1000).toLocaleString()}\nCaptain data: ${captain ? 'Present' : 'None'}`);
            } catch (error) {
                alert(`Token exists: ${!!token}\nToken length: ${token?.length || 0}\nCaptain data: ${captain ? 'Present' : 'None'}\nError decoding token: ${error.message}`);
            }
        } else {
            alert(`Token exists: ${!!token}\nToken length: ${token?.length || 0}\nCaptain data: ${captain ? 'Present' : 'None'}`);
        }
    };

    const fixTokenMismatch = () => {
        if (confirm('This will clear your current token and redirect to login. Continue?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('captain');
            alert('Token cleared! Please login again to get a fresh token.');
            window.location.href = '/captain-login';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
            <h3 className="text-sm font-bold mb-2">Auth Debugger</h3>
            <div className="flex flex-col gap-2">
                <button
                    onClick={showTokenInfo}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                >
                    Show Token Info
                </button>
                <button
                    onClick={testAuthentication}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                >
                    Test Auth
                </button>
                <button
                    onClick={testLocationUpdate}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
                >
                    Test Location
                </button>
                <button
                    onClick={fixTokenMismatch}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                >
                    Fix Token Issue
                </button>
            </div>
        </div>
    );
};

export default AuthDebugger;
