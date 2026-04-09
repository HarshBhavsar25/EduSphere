import React, { useEffect, useRef, useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { getLocationsByFloor, CANVAS } from '../../config/locations';
import './FloorPlan.css';

const FloorPlan = ({ currentFloor }) => {
  const { selectedRoom, handleRoomSelect, occupancyData } = useCampus();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const rooms = getLocationsByFloor(currentFloor);

  // Resize logic: Keep canvas aspect ratio but scale it to fit container
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const scaleX = (containerWidth - 40) / CANVAS.width; // 40px padding
      const scaleY = (containerHeight - 40) / CANVAS.height;
      
      // Use the smaller scale so it fully fits
      setScale(Math.min(scaleX, scaleY));
    };

    window.addEventListener('resize', handleResize);
    // Give it a tiny delay to allow CSS layout to finish
    setTimeout(handleResize, 50); 

    return () => window.removeEventListener('resize', handleResize);
  }, [currentFloor]);

  const getRoomStyle = (room) => {
    const count = occupancyData[room.id] || 0;
    // Treat 0-capacity transient spaces (corridor, stairs, parking) as having at least a baseline capacity of 20 for heatmap calculation
    const effectiveCapacity = room.capacity > 0 ? room.capacity : 20;
    const ratio = count / effectiveCapacity;
    
    let colorClass = 'empty';
    if (ratio > 0.8) colorClass = 'high';
    else if (ratio > 0.4) colorClass = 'medium';
    else if (count > 0) colorClass = 'low';

    const isSelected = selectedRoom === room.id;

    return `room-box ${colorClass} ${isSelected ? 'selected' : ''}`;
  };

  return (
    <div className="floor-plan-wrapper" ref={containerRef}>
      <div 
        className="canvas-container"
        style={{
          width: CANVAS.width,
          height: CANVAS.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Draw Rooms */}
        {rooms.map((room) => (
          <div
            key={room.id}
            className={getRoomStyle(room)}
            style={{
              left: room.position2D.x,
              top: room.position2D.y,
              width: room.position2D.width,
              height: room.position2D.height,
            }}
            onClick={() => handleRoomSelect(room.id)}
            title={`${room.name} (Capacity: ${room.capacity})`}
          >
            <span className="room-label">{room.name}</span>
            {occupancyData[room.id] !== undefined && (
              <span className="room-count">{occupancyData[room.id]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPlan;
