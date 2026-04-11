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
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${baseUrl}/api/ping`)
      .then(res => { if (isMounted) setIsConnected(res.ok); })
      .catch(() => { if (isMounted) setIsConnected(false); });

    // Simulate streaming data (Occupancy & Alerts)
    const simInterval = setInterval(() => {
      if (!isMounted) return;

      // Ensure we stay "connected" visually if timer is running
      setIsConnected(true);

      // 1. Generate live mock occupancy data — large campus with varied room types
      const allRooms = [
        // Ground floor
        'g01', 'g02', 'g03', 'g04', 'g05', 'g06', 'g25', 'g26',
        // 1st floor
        '101', '103', '105', '108', '110', '112', '114', '116',
        // 2nd floor
        '201', '202', '203', '205', '207', '210',
        // Common areas
        'library', 'canteen', 'auditorium', 'lab1', 'lab2', 'lab3',
        'seminar_hall', 'sports_hall', 'parking', 'admin_block',
      ];

      const mockOccupancy = {};
      allRooms.forEach(room => {
        // Weighted distribution: common areas get more crowd
        const isHotspot = ['canteen', 'library', 'auditorium', 'seminar_hall'].includes(room);
        const isLab = room.startsWith('lab');
        const max = isHotspot ? 120 : isLab ? 60 : 80;
        const min = isHotspot ? 40 : 2;
        mockOccupancy[room] = Math.floor(Math.random() * (max - min)) + min;
      });
      setOccupancyData(mockOccupancy);

      // 2. Generate rich, varied alerts more frequently
      const alertPool = [
        { severity: 'critical', type: 'OVERCROWDING',    location: 'Canteen (GF)',       message: 'Occupancy exceeds fire-safety limit. Immediate dispersal required.' },
        { severity: 'critical', type: 'OVERCROWDING',    location: 'Auditorium (1F)',     message: 'Capacity at 140% — entry restricted until dispersal.' },
        { severity: 'warning',  type: 'CROWD DENSITY',   location: 'Library (2F)',        message: 'Density exceeding comfortable baseline thresholds.' },
        { severity: 'warning',  type: 'CROWD DENSITY',   location: 'Seminar Hall (1F)',   message: 'Unusual congregation detected — monitor for escalation.' },
        { severity: 'warning',  type: 'CROWD DENSITY',   location: 'Corridor G25-G26',   message: 'High pedestrian flow causing bottleneck.' },
        { severity: 'warning',  type: 'SECURITY ALERT',  location: 'Parking Area',        message: 'Unidentified gathering detected near rear entrance.' },
        { severity: 'info',     type: 'SYSTEM NOTICE',   location: 'Admin Block',         message: 'Scheduled maintenance on Sensor Node 4 at 11:00.' },
        { severity: 'info',     type: 'FLOW ALERT',      location: 'Main Entrance (GF)',  message: 'Peak arrival wave detected — expected to normalise in 15 min.' },
      ];

      const mockAlerts = [];
      // ~60% chance of at least one alert per tick
      if (Math.random() > 0.4) {
        // Pick 1–3 random alerts
        const count = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...alertPool].sort(() => Math.random() - 0.5);
        shuffled.slice(0, count).forEach((a, i) => {
          mockAlerts.push({ ...a, id: Date.now() + i });
        });
      }
      setAlerts(mockAlerts);
    }, 3000); // refresh every 3 s for a livelier feel
    
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
