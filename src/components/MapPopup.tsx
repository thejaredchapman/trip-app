import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../hooks/useThemeColors';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const MapPopup: React.FC<Props> = ({ isOpen, onClose, address }) => {
  const c = useThemeColors();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current || !window.google) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0] && mapRef.current) {
        const location = results[0].geometry.location;
        const map = new google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
          styles: c.isDark
            ? [
                { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
                { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
                { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
              ]
            : [],
          disableDefaultUI: true,
          zoomControl: true,
        });
        mapInstanceRef.current = map;

        new google.maps.Marker({
          map,
          position: location,
          title: address,
          animation: google.maps.Animation.DROP,
        });
      }
    });

    return () => {
      mapInstanceRef.current = null;
    };
  }, [isOpen, address, c.isDark]);

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
      '_blank'
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: c.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: c.modalBg,
              borderRadius: 20,
              padding: 'clamp(16px, 4vw, 24px)',
              width: '92%',
              maxWidth: 560,
              border: `1px solid ${c.border}`,
              boxShadow: c.modalShadow,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: c.text, margin: 0, fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>📍</span> {address}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: c.bgHover,
                  border: `1px solid ${c.border}`,
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: c.textSecondary,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                ✕
              </motion.button>
            </div>

            {/* Map container */}
            <div
              ref={mapRef}
              style={{
                width: '100%',
                height: 340,
                borderRadius: 14,
                overflow: 'hidden',
                border: `1px solid ${c.border}`,
                background: c.bgInput,
              }}
            />

            {/* Get Directions button */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(66,133,244,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetDirections}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #4285F4, #34A853)',
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              🧭 Get Directions
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapPopup;
