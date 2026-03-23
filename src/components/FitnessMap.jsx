import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker icon paths (known Vite/Webpack issue)
delete L.Icon.Default.prototype._getIconUrl;

const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = createIcon('blue');
const groupIcon = createIcon('green');
const nearbyUserIcon = createIcon('gold');

// Component to dynamically fly to location
function LocationMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 13, { animate: true });
  }, [position, map]);
  return null;
}

export default function FitnessMap({ groups }) {
  const [position, setPosition] = useState([40.7128, -74.0060]); // Default to NY
  const [nearbyProfiles, setNearbyProfiles] = useState([]);
  const [nearbyGroups, setNearbyGroups] = useState([]);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          
          // Generate realistic mock clusters based strictly around the user's HTML5 coordinates
          const randomOffsets = Array.from({ length: 4 }).map(() => [
            lat + (Math.random() - 0.5) * 0.05,
            lng + (Math.random() - 0.5) * 0.05
          ]);
          setNearbyProfiles([
            { id: 1, name: "Ali R.", activity: "Marathon Runner", pos: randomOffsets[0] },
            { id: 2, name: "Samantha W.", activity: "Crossfit", pos: randomOffsets[1] }
          ]);
          setNearbyGroups([
            { id: 1, name: groups?.[0]?.name || "Downtown Morning Walkers", pos: randomOffsets[2], type: "Walk" },
            { id: 2, name: groups?.[1]?.name || "Sunset Yoga Flex", pos: randomOffsets[3], type: "Yoga" }
          ]);
        },
        (err) => {
          console.error(err);
          setLocationError('Please allow location tracking in your browser to see nearby maps seamlessly!');
        }
      );
    }
  }, [groups]);

  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      {locationError && (
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          {locationError}
        </div>
      )}
      <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} />
        
        {/* User Marker */}
        <Marker position={position} icon={userIcon}>
          <Popup><b>You are here!</b><br />Ready for a workout!</Popup>
        </Marker>

        {/* Nearby Group Markers */}
        {(nearbyGroups || []).map(grp => grp && grp.pos && (
          <Marker key={`grp-${grp.id}`} position={grp.pos} icon={groupIcon}>
            <Popup>
              <b>{grp.name}</b><br />
              <span style={{color: 'green'}}>• Fitness Group</span><br/>
              Activity: {grp.type}
            </Popup>
          </Marker>
        ))}

        {/* Nearby User Markers */}
        {(nearbyProfiles || []).map(usr => usr && usr.pos && (
          <Marker key={`usr-${usr.id}`} position={usr.pos} icon={nearbyUserIcon}>
            <Popup>
              <b>{usr.name}</b><br />
              <span style={{color: 'goldenrod'}}>• Local User</span><br/>
              Specialty: {usr.activity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
