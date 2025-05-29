require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.IO with environment-specific CORS
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL || "https://your-app.vercel.app",
        "https://*.vercel.app",
        "https://*.onrender.com"
    ]
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:4000"
    ];

const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'], // Allow both transports
    allowEIO3: true, // Allow Engine.IO v3 clients
    pingTimeout: 60000,
    pingInterval: 25000
});

// Make Socket.IO instance available to the app
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining
    socket.on('join', async (data) => {
        const { userType, userId } = data;
        console.log(`${userType} joined:`, socket.id, 'userId:', userId);
        socket.join(userType); // Join room based on user type (user/captain)
        socket.userId = userId; // Store userId for later use
        socket.userType = userType; // Store userType for later use

        // If captain, update their socketId in database
        if (userType === 'captain') {
            try {
                const captainModel = require('./models/captain.model');
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log('📡 Captain socketId updated in database:', socket.id);
            } catch (error) {
                console.error('❌ Error updating captain socketId:', error);
            }
        }

        // Send confirmation back to the client
        socket.emit('join-confirmed', { userType, userId, socketId: socket.id });

        // If captain, send a test event to verify connection
        if (userType === 'captain') {
            console.log('🧪 Sending test event to captain:', socket.id);
            socket.emit('test-captain-connection', { message: 'Captain connection successful!' });
        }
    });

    // Handle location updates from captains
    socket.on('update-location-captain', (data) => {
        console.log('Captain location update:', data);
        // Broadcast to users looking for rides
        socket.to('user').emit('captain-location-update', data);
    });

    // Handle ride requests
    socket.on('ride-request', (data) => {
        console.log('Ride request:', data);
        // Broadcast to available captains
        socket.to('captain').emit('new-ride-request', data);
    });

    // Handle ride acceptance
    socket.on('ride-accepted', (data) => {
        console.log('Ride accepted:', data);
        // Notify the specific user
        io.to(data.userId).emit('ride-accepted', data);
    });

    // Handle ride completion
    socket.on('ride-completed', (data) => {
        console.log('Ride completed:', data);
        // Notify both user and captain
        io.to(data.userId).emit('ride-completed', data);
        io.to(data.captainId).emit('ride-completed', data);
    });

    // Handle ride decline
    socket.on('ride-declined', (data) => {
        console.log('Ride declined by captain:', data);
        // You can implement logic here to notify the user or find another captain
        // For now, just log it
    });



    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Socket.IO server is ready`);
});