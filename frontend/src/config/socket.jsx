import socket from 'socket.io-client';

// Fallback URL if environment variable is not set
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (socketInstance) {
        socketInstance.disconnect();
    }

    socketInstance = socket(API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        },
        transports: ['websocket', 'polling'],
        timeout: 10000
    });

    socketInstance.on('connect', () => {
        console.log('Socket connected');
    });

    socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    }
};

export const sendMessage = (eventName, data) => {
    if (socketInstance && socketInstance.connected) {
        socketInstance.emit(eventName, data);
    } else {
        console.warn('Socket not connected, message not sent:', eventName);
    }
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};