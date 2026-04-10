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
  
  // Mock Real-time Backend (since Socket.io isn't implemented on Python backend yet)
  useEffect(() => {
    let isMounted = true;
    
    // Check baseline connection via REST Ping
    fetch('http://localhost:5001/api/ping')
      .then(res => { if (isMounted) setIsConnected(res.ok); })
      .catch(() => { if (isMounted) setIsConnected(false); });

    // Simulate streaming data (Occupancy & Alerts)
    const simInterval = setInterval(() => {
      if (!isMounted) return;
      
      // Ensure we stay "connected" visually if timer is running
      setIsConnected(true);

      // 1. Generate live mock occupancy data
      const mockOccupancy = {};
      const activeRooms = ['114', 'g02', 'g03', 'g04', '101', '105', '103', '108', 'library', 'canteen', 'g25', 'g26', '201', '202'];
      activeRooms.forEach(room => {
        mockOccupancy[room] = Math.floor(Math.random() * 45) + 5;
      });
      setOccupancyData(mockOccupancy);

      // 2. Occasionally generate mock alerts
      const mockAlerts = [];
      if (Math.random() > 0.8) {
        mockAlerts.push({
          id: Date.now(),
          severity: 'warning',
          type: 'CROWD DENSITY',
          location: 'Library (2F)',
          message: 'Density exceeding baseline comfortable thresholds.'
        });
      }
      setAlerts(mockAlerts);
    }, 4000); // 4 seconds data refresh
    
    return () => {
      isMounted = false;
      clearInterval(simInterval);
    };
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
