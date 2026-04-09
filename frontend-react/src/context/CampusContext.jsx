import React, { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const CampusContext = createContext();

export const useCampus = () => useContext(CampusContext);

export const CampusProvider = ({ children }) => {
  const [selectedFloor, setSelectedFloor] = useState(0); // 0 = GF, 1 = 1st, etc.
  const [selectedRoom, setSelectedRoom] = useState(null); // id of the room
  const [occupancyData, setOccupancyData] = useState({}); // { room_id: count }
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Future: Socket.io connection for real-time updates
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    
    // Server sends full mapping: { roomId: count, ... }
    socket.on('occupancy_update', (data) => {
      setOccupancyData(data);
    });
    
    socket.on('intelligence_alerts', (alertData) => {
      setAlerts(alertData);
    });
    
    return () => socket.disconnect();
  }, []);

  // Bridge to Three.js
  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    
    // Push selection to 3D View if the API is ready
    if (window.campusAPI && window.campusAPI.selectRoom) {
      window.campusAPI.selectRoom(roomId);
    }
  };

  const handleFloorSelect = (floorId) => {
    setSelectedFloor(floorId);
    
    // You could also add a push to 3D view to isolate/highlight a floor
  };

  const value = {
    selectedFloor,
    handleFloorSelect,
    selectedRoom,
    handleRoomSelect,
    occupancyData,
    alerts,
    isConnected
  };

  return (
    <CampusContext.Provider value={value}>
      {children}
    </CampusContext.Provider>
  );
};
