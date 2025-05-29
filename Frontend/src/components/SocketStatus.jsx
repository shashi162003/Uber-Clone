import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'

const SocketStatus = () => {
    const { isConnected } = useContext(SocketContext)

    return (
        <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-xs font-medium ${
            isConnected 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
            </div>
        </div>
    )
}

export default SocketStatus
