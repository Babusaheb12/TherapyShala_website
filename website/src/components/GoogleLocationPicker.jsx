import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  MapPin,
  Search,
  Crosshair,
  Compass,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Loader2,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDTYoTj_UeBdzy9d3_-kNngDpwqQIzKDJk';

/**
 * Google Maps Location & Address Picker for Therapist Onboarding
 * @param {Object} value - { city, area, postalCode, formattedAddress, serviceRadiusKm, latitude, longitude }
 * @param {Function} onChange - updates fields
 */
export default function GoogleLocationPicker({ value = {}, onChange }) {
  const mapContainerRef = useRef(null);
  const autocompleteInputRef = useRef(null);

  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Default coordinates (e.g. Connaught Place, New Delhi or provided value)
  const currentLat = Number(value.latitude) || 28.6139;
  const currentLng = Number(value.longitude) || 77.209;
  const radiusKm = Number(value.serviceRadiusKm) || 10;

  // Helper to safely extract address components
  const parseAddressComponents = (components = [], fallbackAddress = '') => {
    let city = '';
    let area = '';
    let postalCode = '';
    let state = '';

    components.forEach((c) => {
      const types = c.types || [];
      if (types.includes('locality')) {
        city = c.long_name;
      } else if (!city && types.includes('administrative_area_level_2')) {
        city = c.long_name;
      }

      if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
        area = c.long_name;
      } else if (!area && types.includes('neighborhood')) {
        area = c.long_name;
      }

      if (types.includes('postal_code')) {
        postalCode = c.long_name;
      }

      if (types.includes('administrative_area_level_1')) {
        state = c.long_name;
      }
    });

    if (!area && !city && fallbackAddress) {
      const parts = fallbackAddress.split(',').map((s) => s.trim());
      if (parts.length > 1) {
        area = parts[0];
        city = parts[1];
      }
    }

    return { city, area, postalCode, state };
  };

  // Reverse geocode lat/lng to address details
  const reverseGeocode = useCallback(
    (lat, lng) => {
      if (!window.google?.maps?.Geocoder) return;
      setGeocoding(true);

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setGeocoding(false);
        if (status === 'OK' && results && results[0]) {
          const place = results[0];
          const parsed = parseAddressComponents(place.address_components, place.formatted_address);

          onChange({
            ...value,
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
            formattedAddress: place.formatted_address,
            city: parsed.city || value.city || 'New Delhi',
            area: parsed.area || value.area || 'Connaught Place',
            postalCode: parsed.postalCode || value.postalCode || '110001',
          });
        }
      });
    },
    [onChange, value]
  );

  // Load Google Maps JavaScript SDK
  useEffect(() => {
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapLoaded(true));
      existingScript.addEventListener('error', () => setMapError('Google Maps failed to load'));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-sdk';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      setMapError('Unable to load Google Maps SDK. Please check internet connection or API key.');
    };

    document.head.appendChild(script);
  }, []);

  // Initialize Map, Marker, Circle & Autocomplete
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !window.google?.maps) return;

    const initialPos = { lat: currentLat, lng: currentLng };

    // 1. Initialize Map
    if (!mapInstanceRef.current) {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: initialPos,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });
      mapInstanceRef.current = map;

      // 2. Initialize Draggable Marker
      const marker = new window.google.maps.Marker({
        position: initialPos,
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: 'Therapist Base Location',
      });
      markerRef.current = marker;

      // 3. Initialize Coverage Radius Circle
      const circle = new window.google.maps.Circle({
        map,
        center: initialPos,
        radius: radiusKm * 1000,
        fillColor: '#F35271',
        fillOpacity: 0.15,
        strokeColor: '#F35271',
        strokeWeight: 1.5,
      });
      circleRef.current = circle;

      // Listener: Marker Drag End
      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        if (pos) {
          const lat = pos.lat();
          const lng = pos.lng();
          circle.setCenter({ lat, lng });
          reverseGeocode(lat, lng);
        }
      });

      // Listener: Map Click to place marker
      map.addListener('click', (e) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          circle.setCenter({ lat, lng });
          reverseGeocode(lat, lng);
        }
      });
    }

    // 4. Initialize Autocomplete on input
    if (autocompleteInputRef.current && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        {
          fields: ['formatted_address', 'geometry', 'address_components', 'name'],
          componentRestrictions: { country: 'in' }, // Default to India but extensible
        }
      );
      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          mapInstanceRef.current?.setCenter({ lat, lng });
          mapInstanceRef.current?.setZoom(14);
          markerRef.current?.setPosition({ lat, lng });
          circleRef.current?.setCenter({ lat, lng });

          const parsed = parseAddressComponents(
            place.address_components,
            place.formatted_address || place.name
          );

          onChange({
            ...value,
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
            formattedAddress: place.formatted_address || place.name || '',
            city: parsed.city || value.city || 'New Delhi',
            area: parsed.area || value.area || 'Connaught Place',
            postalCode: parsed.postalCode || value.postalCode || '110001',
          });
        }
      });
    }
  }, [mapLoaded, currentLat, currentLng, radiusKm, reverseGeocode, onChange, value]);

  // Update circle radius when radiusKm changes
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [radiusKm]);

  // Detect current user position
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(15);
          markerRef.current?.setPosition({ lat, lng });
          circleRef.current?.setCenter({ lat, lng });
        }
        reverseGeocode(lat, lng);
      },
      (err) => {
        setDetectingLocation(false);
        alert('Could not retrieve current location: ' + err.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and Live Map Search Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block font-semibold text-[#0D0D12] text-xs">
            Search Location & Landmark (Google Places)
          </label>
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={detectingLocation}
            className="text-[11px] text-[#F35271] hover:text-[#d43f5d] font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {detectingLocation ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span>Detect Current Location</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={autocompleteInputRef}
            type="text"
            defaultValue={value.formattedAddress || ''}
            placeholder="Search spa address, landmark, colony, or area (e.g. Connaught Place, New Delhi)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none text-xs bg-white shadow-2xs font-medium"
          />
          {geocoding && (
            <Loader2 className="w-4 h-4 text-[#F35271] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>

      {/* Embedded Google Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xs bg-gray-100">
        <div ref={mapContainerRef} className="w-full h-56 sm:h-64" />

        {/* Map Overlay Badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-gray-200/80 text-[10px] font-semibold text-gray-700 shadow-xs flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#F35271]" />
          <span>Click map or drag pin to adjust coordinates</span>
        </div>

        {/* Coordinates readout chip */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#0D0D12]/80 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-xs">
          📍 {currentLat.toFixed(4)}, {currentLng.toFixed(4)} • {radiusKm} km radius
        </div>

        {mapError && (
          <div className="absolute inset-0 bg-red-50/90 backdrop-blur-xs flex items-center justify-center p-4 text-center">
            <div className="text-red-700 text-xs space-y-1">
              <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
              <p className="font-bold">{mapError}</p>
              <p className="text-[11px] text-red-600">You can still enter city, area, and postal code below manually.</p>
            </div>
          </div>
        )}
      </div>

      {/* Structured Location Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-[#0D0D12] mb-1">City *</label>
          <input
            type="text"
            required
            value={value.city || ''}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            placeholder="e.g. New Delhi"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-white font-medium"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#0D0D12] mb-1">Area / Locality *</label>
          <input
            type="text"
            required
            value={value.area || ''}
            onChange={(e) => onChange({ ...value, area: e.target.value })}
            placeholder="e.g. Connaught Place"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-white font-medium"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#0D0D12] mb-1">Postal Code (PIN) *</label>
          <input
            type="text"
            required
            value={value.postalCode || ''}
            onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
            placeholder="e.g. 110001"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-white font-mono font-medium"
          />
        </div>
      </div>

      {/* Formatted Full Address & Service Radius */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold text-[#0D0D12] mb-1">Formatted Full Address</label>
          <input
            type="text"
            value={value.formattedAddress || ''}
            onChange={(e) => onChange({ ...value, formattedAddress: e.target.value })}
            placeholder="e.g. Connaught Place, New Delhi, 110001"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-white font-medium"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-semibold text-[#0D0D12]">Service Radius</label>
            <span className="text-[10px] font-bold text-[#F35271]">{radiusKm} KM</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={radiusKm}
              onChange={(e) => onChange({ ...value, serviceRadiusKm: Number(e.target.value) })}
              className="w-full accent-[#F35271] cursor-pointer"
            />
            <input
              type="number"
              min="1"
              max="50"
              value={radiusKm}
              onChange={(e) => onChange({ ...value, serviceRadiusKm: Number(e.target.value) })}
              className="w-14 px-2 py-1.5 rounded-lg border border-gray-200 text-center font-bold font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
