import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  MapPin,
  Search,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Loader2,
  Ban,
  Plus,
  X,
  ShieldAlert,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDTYoTj_UeBdzy9d3_-kNngDpwqQIzKDJk';

// Comprehensive mapping of Indian cities to their primary central postal codes (PIN)
const INDIAN_CITY_PIN_MAP = {
  jaipur: '302001',
  delhi: '110001',
  'new delhi': '110001',
  mumbai: '400001',
  bengaluru: '560001',
  bangalore: '560001',
  hyderabad: '500001',
  chennai: '600001',
  kolkata: '700001',
  pune: '411001',
  ahmedabad: '380001',
  surat: '395001',
  lucknow: '226001',
  kanpur: '208001',
  nagpur: '440001',
  indore: '452001',
  thane: '400601',
  bhopal: '462001',
  visakhapatnam: '530001',
  patna: '800001',
  vadodara: '390001',
  ghaziabad: '201001',
  ludhiana: '141001',
  agra: '282001',
  nashik: '422001',
  faridabad: '121001',
  meerut: '250001',
  rajkot: '360001',
  varanasi: '221001',
  srinagar: '190001',
  aurangabad: '431001',
  dhanbad: '826001',
  amritsar: '143001',
  'navi mumbai': '400703',
  allahabad: '211001',
  prayagraj: '211001',
  ranchi: '834001',
  howrah: '711101',
  coimbatore: '641001',
  jabalpur: '482001',
  gwalior: '474001',
  vijayawada: '520001',
  jodhpur: '342001',
  madurai: '625001',
  raipur: '492001',
  kota: '324001',
  chandigarh: '160017',
  guwahati: '781001',
  solapur: '413001',
  hubli: '580020',
  mysore: '570001',
  bareilly: '243001',
  aligarh: '202001',
  tiruppur: '641601',
  gurgaon: '122001',
  gurugram: '122001',
  noida: '201301',
  'greater noida': '201310',
  moradabad: '244001',
  jalandhar: '144001',
  bhubaneswar: '751001',
  salem: '636001',
  warangal: '506001',
  thiruvananthapuram: '695001',
  bhiwandi: '421302',
  saharanpur: '247001',
  gorakhpur: '273001',
  bikaner: '334001',
  amravati: '444601',
  jamshedpur: '831001',
  bhilai: '490006',
  cuttack: '753001',
  kochi: '682001',
  dehradun: '248001',
  udaipur: '313001',
  ajmer: '305001',
  jammu: '180001',
  mangalore: '575001',
  shimla: '171001',
};

/**
 * Google Maps Location & Coverage Picker for Therapist Onboarding
 * Supports:
 * 1. Base location selection with pink coverage radius circle (KM)
 * 2. Excluded work areas (No-Go zones) selected via Google Places autocomplete
 *    with red exclusion circles drawn on the Google Map
 */
export default function GoogleLocationPicker({ value = {}, onChange }) {
  const mapContainerRef = useRef(null);
  const baseAutocompleteInputRef = useRef(null);
  const exclusionAutocompleteInputRef = useRef(null);

  const mapInstanceRef = useRef(null);
  const baseMarkerRef = useRef(null);
  const baseCircleRef = useRef(null);
  const baseAutocompleteRef = useRef(null);
  const exclusionAutocompleteRef = useRef(null);

  // References to exclusion circle instances and markers on the map
  const exclusionCirclesMapRef = useRef([]);

  // Stale-closure-free references for async listeners
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [exclusionSearchText, setExclusionSearchText] = useState('');
  const [selectedExclusionPlace, setSelectedExclusionPlace] = useState(null);

  // Base location values (empty by default if not yet chosen by user - defaults map camera to Jaipur, Rajasthan)
  const hasBaseCoordinates = Boolean(value.latitude && value.longitude);
  const currentLat = Number(value.latitude) || 26.9124; // default map camera center: Jaipur, Rajasthan
  const currentLng = Number(value.longitude) || 75.7873;
  const radiusKm = Number(value.serviceRadiusKm) || 10;

  // List of excluded areas from parent formData
  const excludedLocations = Array.isArray(value.excludedLocations) ? value.excludedLocations : [];

  // Helper to reliably extract City, Area, Postal Code (PIN), and State
  const parseAddressComponents = (components = [], fallbackAddress = '', allResults = []) => {
    let city = '';
    let area = '';
    let postalCode = '';
    let state = '';

    // Collect all address components across results for deep extraction
    const componentLists = [];
    if (Array.isArray(components) && components.length > 0) {
      componentLists.push(components);
    }
    if (Array.isArray(allResults)) {
      allResults.forEach((res) => {
        if (Array.isArray(res?.address_components) && res.address_components.length > 0) {
          componentLists.push(res.address_components);
        }
      });
    }

    // 1. Primary pass for City, Area, Postal Code, State
    for (const list of componentLists) {
      for (const c of list) {
        const types = c.types || [];

        // Locality / City
        if (!city) {
          if (types.includes('locality')) {
            city = c.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            city = c.long_name;
          }
        }

        // Sublocality / Area / Neighborhood
        if (!area) {
          if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
            area = c.long_name;
          } else if (types.includes('neighborhood')) {
            area = c.long_name;
          } else if (types.includes('sublocality_level_2') || types.includes('sublocality_level_3')) {
            area = c.long_name;
          }
        }

        // Postal Code (PIN)
        if (!postalCode && types.includes('postal_code')) {
          postalCode = c.long_name;
        }

        // State
        if (!state && types.includes('administrative_area_level_1')) {
          state = c.long_name;
        }
      }
    }

    // 2. Secondary pass for Area if sublocality wasn't found (e.g. route, premise, landmark)
    if (!area) {
      for (const list of componentLists) {
        for (const c of list) {
          const types = c.types || [];
          if (
            types.includes('route') ||
            types.includes('premise') ||
            types.includes('subpremise') ||
            types.includes('point_of_interest')
          ) {
            area = c.long_name;
            break;
          }
        }
        if (area) break;
      }
    }

    // 3. Fallback for Postal Code from 6-digit Indian PIN regex in formatted addresses
    if (!postalCode) {
      const pinRegex = /\b[1-9][0-9]{5}\b/;
      const match = (fallbackAddress || '').match(pinRegex);
      if (match) {
        postalCode = match[0];
      } else if (Array.isArray(allResults)) {
        for (const res of allResults) {
          const resMatch = (res?.formatted_address || '').match(pinRegex);
          if (resMatch) {
            postalCode = resMatch[0];
            break;
          }
        }
      }
    }

    // 4. Fallback for Postal Code from Indian city map
    if (!postalCode && city) {
      const cityKey = city.toLowerCase().trim();
      if (INDIAN_CITY_PIN_MAP[cityKey]) {
        postalCode = INDIAN_CITY_PIN_MAP[cityKey];
      }
    }

    // 5. Fallback for Area & City from formattedAddress tokens
    if (fallbackAddress) {
      const parts = fallbackAddress
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (!city && parts.length > 1) {
        city = parts[1];
      } else if (!city && parts.length > 0) {
        city = parts[0];
      }

      if (!area) {
        if (parts.length > 1 && parts[0].toLowerCase() !== (city || '').toLowerCase()) {
          area = parts[0];
        } else if (city) {
          area = `${city} Central`;
        } else if (parts.length > 0) {
          area = parts[0];
        }
      }
    }

    // If area is still missing, fallback to city + " Central"
    if (!area && city) {
      area = `${city} Central`;
    }

    return { city, area, postalCode, state };
  };

  // Reverse geocode lat/lng to address details (with multi-result extraction)
  const reverseGeocode = useCallback((lat, lng) => {
    if (!window.google?.maps?.Geocoder) return;
    setGeocoding(true);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setGeocoding(false);
      if (status === 'OK' && results && results.length > 0) {
        const place = results[0];
        const parsed = parseAddressComponents(
          place.address_components,
          place.formatted_address,
          results
        );

        if (baseAutocompleteInputRef.current) {
          baseAutocompleteInputRef.current.value = place.formatted_address;
        }

        const currentVal = valueRef.current || {};
        onChangeRef.current({
          ...currentVal,
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          formattedAddress: place.formatted_address || currentVal.formattedAddress || '',
          city: parsed.city || currentVal.city || '',
          area: parsed.area || currentVal.area || '',
          postalCode: parsed.postalCode || currentVal.postalCode || '',
        });
      }
    });
  }, []);

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
        zoom: hasBaseCoordinates ? 14 : 12,
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

      // 2. Base Location Marker
      const marker = new window.google.maps.Marker({
        position: initialPos,
        map: hasBaseCoordinates ? map : null, // only show if user has picked a location
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: 'Therapist Base Location',
      });
      baseMarkerRef.current = marker;

      // 3. Base Service Radius Coverage Circle (Pink)
      const circle = new window.google.maps.Circle({
        map: hasBaseCoordinates ? map : null,
        center: initialPos,
        radius: radiusKm * 1000,
        fillColor: '#F35271',
        fillOpacity: 0.15,
        strokeColor: '#F35271',
        strokeWeight: 2,
      });
      baseCircleRef.current = circle;

      // Listener: Marker Drag End
      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        if (pos) {
          const lat = pos.lat();
          const lng = pos.lng();
          circle.setCenter({ lat, lng });
          circle.setMap(map);
          marker.setMap(map);
          reverseGeocode(lat, lng);
        }
      });

      // Listener: Map Click to place marker
      map.addListener('click', (e) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          marker.setMap(map);
          circle.setCenter({ lat, lng });
          circle.setMap(map);
          reverseGeocode(lat, lng);
        }
      });
    }

    // 4. Base Location Autocomplete
    if (baseAutocompleteInputRef.current && !baseAutocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        baseAutocompleteInputRef.current,
        {
          fields: ['formatted_address', 'geometry', 'address_components', 'name', 'place_id'],
          componentRestrictions: { country: 'in' },
        }
      );
      baseAutocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          mapInstanceRef.current?.setCenter({ lat, lng });
          mapInstanceRef.current?.setZoom(14);

          if (baseMarkerRef.current) {
            baseMarkerRef.current.setPosition({ lat, lng });
            baseMarkerRef.current.setMap(mapInstanceRef.current);
          }

          if (baseCircleRef.current) {
            baseCircleRef.current.setCenter({ lat, lng });
            baseCircleRef.current.setMap(mapInstanceRef.current);
          }

          // Initial extraction from place object
          const parsed = parseAddressComponents(
            place.address_components,
            place.formatted_address || place.name
          );

          // Area fallback if still identical to city or empty
          let initialArea = parsed.area;
          if (!initialArea || initialArea.toLowerCase() === (parsed.city || '').toLowerCase()) {
            if (place.name && place.name.toLowerCase() !== (parsed.city || '').toLowerCase()) {
              initialArea = place.name;
            } else if (parsed.city) {
              initialArea = `${parsed.city} Central`;
            }
          }

          const currentVal = valueRef.current || {};
          const immediateUpdate = {
            ...currentVal,
            placeId: place.place_id || currentVal.placeId || '',
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
            formattedAddress: place.formatted_address || place.name || currentVal.formattedAddress || '',
            city: parsed.city || currentVal.city || '',
            area: initialArea || currentVal.area || '',
            postalCode: parsed.postalCode || currentVal.postalCode || '',
          };

          // Update form immediately so fields are never left blank
          onChangeRef.current(immediateUpdate);

          // Deep reverse geocode coordinates to obtain granular neighborhood sublocality and exact PIN code
          if (window.google?.maps?.Geocoder) {
            setGeocoding(true);
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              setGeocoding(false);
              if (status === 'OK' && results && results.length > 0) {
                const deepParsed = parseAddressComponents(
                  results[0].address_components,
                  results[0].formatted_address,
                  results
                );

                let refinedArea = deepParsed.area || initialArea || parsed.area;
                if (!refinedArea || refinedArea.toLowerCase() === (deepParsed.city || parsed.city || '').toLowerCase()) {
                  if (place.name && place.name.toLowerCase() !== (deepParsed.city || parsed.city || '').toLowerCase()) {
                    refinedArea = place.name;
                  } else if (deepParsed.city || parsed.city) {
                    refinedArea = `${deepParsed.city || parsed.city} Central`;
                  }
                }

                onChangeRef.current({
                  ...valueRef.current,
                  ...immediateUpdate,
                  formattedAddress: place.formatted_address || results[0].formatted_address || immediateUpdate.formattedAddress,
                  city: deepParsed.city || parsed.city || immediateUpdate.city,
                  area: refinedArea || immediateUpdate.area,
                  postalCode: deepParsed.postalCode || parsed.postalCode || immediateUpdate.postalCode,
                });
              }
            });
          }
        }
      });
    }

    // 5. Excluded Areas Autocomplete (Google Places search for No-Go Zones)
    if (exclusionAutocompleteInputRef.current && !exclusionAutocompleteRef.current) {
      const exAutocomplete = new window.google.maps.places.Autocomplete(
        exclusionAutocompleteInputRef.current,
        {
          fields: ['formatted_address', 'geometry', 'name', 'place_id'],
          componentRestrictions: { country: 'in' },
        }
      );
      exclusionAutocompleteRef.current = exAutocomplete;

      exAutocomplete.addListener('place_changed', () => {
        const place = exAutocomplete.getPlace();
        if (place.name || place.formatted_address) {
          const areaName = place.name || place.formatted_address;
          setExclusionSearchText(areaName);

          if (place.geometry && place.geometry.location) {
            setSelectedExclusionPlace({
              placeId: place.place_id || `EXCLUDED_PLACE_${Date.now()}`,
              name: areaName,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              radiusKm: 2,
            });
          } else {
            setSelectedExclusionPlace({
              placeId: place.place_id || `EXCLUDED_PLACE_${Date.now()}`,
              name: areaName,
              lat: null,
              lng: null,
              radiusKm: 2,
            });
          }
        }
      });
    }
  }, [mapLoaded, currentLat, currentLng, radiusKm, hasBaseCoordinates, reverseGeocode]);

  // Update circle radius when radiusKm changes
  useEffect(() => {
    if (baseCircleRef.current) {
      baseCircleRef.current.setRadius(radiusKm * 1000);
    }
  }, [radiusKm]);

  // Sync Red Exclusion Circles on the Map whenever excludedLocations changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.google?.maps) return;

    // Clear previous red circles
    exclusionCirclesMapRef.current.forEach((item) => {
      if (item.circle) item.circle.setMap(null);
      if (item.marker) item.marker.setMap(null);
    });
    exclusionCirclesMapRef.current = [];

    const geocoder = new window.google.maps.Geocoder();

    excludedLocations.forEach((item) => {
      const areaName = typeof item === 'string' ? item : item.name;
      const cachedLat =
        typeof item === 'object' ? Number(item.lat ?? item.latitude) : null;
      const cachedLng =
        typeof item === 'object' ? Number(item.lng ?? item.longitude) : null;

      const drawRedExclusion = (lat, lng, name) => {
        const position = { lat, lng };

        // Draw a prominent Red No-Go Circle
        const redCircle = new window.google.maps.Circle({
          map: mapInstanceRef.current,
          center: position,
          radius: 2500, // 2.5 KM exclusion zone radius
          fillColor: '#EF4444', // Red
          fillOpacity: 0.28,
          strokeColor: '#DC2626',
          strokeWeight: 2,
          clickable: true,
        });

        // Add small warning marker in center of excluded area
        const warningMarker = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          position,
          title: `Excluded: ${name}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: '#DC2626',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
          },
        });

        exclusionCirclesMapRef.current.push({
          name,
          circle: redCircle,
          marker: warningMarker,
        });
      };

      if (Number.isFinite(cachedLat) && Number.isFinite(cachedLng)) {
        drawRedExclusion(cachedLat, cachedLng, areaName);
      } else if (areaName) {
        geocoder.geocode({ address: areaName, componentRestrictions: { country: 'in' } }, (results, status) => {
          if (status === 'OK' && results && results[0]?.geometry?.location) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            drawRedExclusion(lat, lng, areaName);
          }
        });
      }
    });
  }, [excludedLocations, mapLoaded]);

  // Handle adding an excluded location via Google Search or write-in
  const handleAddExcludedLocation = (e) => {
    e?.preventDefault();
    const areaName = selectedExclusionPlace?.name || exclusionSearchText.trim();
    if (!areaName) return;

    // Check if already in list
    const isDuplicate = excludedLocations.some((item) => {
      const existingName = typeof item === 'string' ? item : item.name;
      return existingName.toLowerCase() === areaName.toLowerCase();
    });

    if (!isDuplicate) {
      const newExclusionItem = selectedExclusionPlace?.lat
        ? {
            placeId: selectedExclusionPlace.placeId || `EXCLUDED_PLACE_${Date.now()}`,
            name: areaName,
            lat: selectedExclusionPlace.lat,
            lng: selectedExclusionPlace.lng,
            latitude: selectedExclusionPlace.lat,
            longitude: selectedExclusionPlace.lng,
            radiusKm: selectedExclusionPlace.radiusKm || 2,
          }
        : {
            placeId: `EXCLUDED_PLACE_${Date.now()}`,
            name: areaName,
            latitude: 26.95,
            longitude: 75.8,
            radiusKm: 2,
          };

      const updated = [...excludedLocations, newExclusionItem];
      onChange({
        ...value,
        excludedLocations: updated,
        excludedWorkAreas: updated,
      });
    }

    setExclusionSearchText('');
    setSelectedExclusionPlace(null);
    if (exclusionAutocompleteInputRef.current) {
      exclusionAutocompleteInputRef.current.value = '';
    }
  };

  // Handle removing an excluded location
  const handleRemoveExcludedLocation = (itemToRemove) => {
    const targetName = typeof itemToRemove === 'string' ? itemToRemove : itemToRemove.name;
    const filtered = excludedLocations.filter((item) => {
      const existingName = typeof item === 'string' ? item : item.name;
      return existingName !== targetName;
    });

    onChange({
      ...value,
      excludedLocations: filtered,
      excludedWorkAreas: filtered,
    });
  };

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
          if (baseMarkerRef.current) {
            baseMarkerRef.current.setPosition({ lat, lng });
            baseMarkerRef.current.setMap(mapInstanceRef.current);
          }
          if (baseCircleRef.current) {
            baseCircleRef.current.setCenter({ lat, lng });
            baseCircleRef.current.setMap(mapInstanceRef.current);
          }
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
    <div className="space-y-6">
      {/* 1. Base Location Search & Maps Section */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-semibold text-[#0D0D12] text-xs">
              Search Base Location & Landmark (Google Places) <span className="text-rose-500 font-bold">* (Compulsory)</span>
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
              ref={baseAutocompleteInputRef}
              type="text"
              required
              defaultValue={value.formattedAddress || ''}
              placeholder="Search therapist home address, landmark, colony, or area (e.g. C-Scheme, Malviya Nagar, Tonk Road, Jaipur)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none text-xs bg-white shadow-2xs font-medium"
            />
            {geocoding && (
              <Loader2 className="w-4 h-4 text-[#F35271] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Search or pin the therapist's primary base location. By default, this field starts empty and is compulsory.
          </p>
        </div>

        {/* Embedded Google Map Container */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xs bg-gray-100">
          <div ref={mapContainerRef} className="w-full h-64 sm:h-72" />

          {/* Map Overlay Badge & Legend */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-gray-200/80 text-[10px] font-semibold text-gray-700 shadow-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F35271]" />
              <span>Click map or drag pin to choose base location</span>
            </div>

            {/* Map Legend: Service Radius (Pink) vs Excluded Areas (Red) */}
            <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-gray-200/80 text-[10px] shadow-xs flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F35271]/40 border border-[#F35271]" />
                <span className="font-semibold text-gray-700">Active Service Radius ({radiusKm} KM)</span>
              </div>
              {excludedLocations.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/50 border border-red-600 animate-pulse" />
                  <span className="font-semibold text-red-700">🔴 Excluded No-Go Zones ({excludedLocations.length})</span>
                </div>
              )}
            </div>
          </div>

          {/* Coordinates readout chip */}
          <div className="absolute bottom-2.5 right-2.5 bg-[#0D0D12]/80 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-xs">
            {hasBaseCoordinates ? (
              <span>📍 {currentLat.toFixed(4)}, {currentLng.toFixed(4)} • {radiusKm} KM radius</span>
            ) : (
              <span>📍 Please search or click map to set location</span>
            )}
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
            <label className="block font-semibold text-[#0D0D12] mb-1">City <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              value={value.city || ''}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              placeholder="e.g. Jaipur"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-white font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0D0D12] mb-1">Area / Neighborhood <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              value={value.area || ''}
              onChange={(e) => onChange({ ...value, area: e.target.value })}
              placeholder="e.g. C Scheme or Malviya Nagar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-white font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0D0D12] mb-1">Postal Code (PIN) <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              value={value.postalCode || ''}
              onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
              placeholder="e.g. 302001"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-white font-mono font-medium"
            />
          </div>
        </div>

        {/* Formatted Full Address & Service Radius (KM Slider) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#0D0D12] mb-1">Formatted Address</label>
            <input
              type="text"
              value={value.formattedAddress || ''}
              onChange={(e) => onChange({ ...value, formattedAddress: e.target.value })}
              placeholder="e.g. C Scheme, Jaipur, Rajasthan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-white font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-[#0D0D12]">Service Radius (KM)</label>
              <span className="text-[10px] font-bold text-[#F35271]">
                {[5, 10, 20].includes(radiusKm) ? radiusKm : 10} KM
              </span>
            </div>
            {/* Radius values accepted by the therapist API */}
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((val) => {
                const isSelected = ([5, 10, 20].includes(radiusKm) ? radiusKm : 10) === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onChange({ ...value, serviceRadiusKm: val })}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#F35271] text-white border-[#F35271] shadow-xs ring-2 ring-[#F35271]/20'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>{val} KM</span>
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-gray-500 mt-1.5 block">Therapist travels up to {[5, 10, 20].includes(radiusKm) ? radiusKm : 10} KM (Allowed: 5, 10, or 20 km)</span>
          </div>
        </div>
      </div>

      {/* 2. Excluded Work Areas (No-Go Zones) with Google Places Search & Red Circles */}
      <div className="p-4 sm:p-5 rounded-2xl bg-red-50/40 border border-red-200/80 space-y-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-bold text-red-950 text-xs flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-red-600" />
              <span>Excluded Work Areas / Locations (No-Go Zones)</span>
            </label>
            <p className="text-[11px] text-red-800 leading-relaxed mt-0.5">
              Search any location via Google Places to mark as a restricted No-Go Zone. Each selected excluded area will display as a <strong>🔴 Red Circle</strong> on the Google Map above.
            </p>
          </div>
        </div>

        {/* Google Places Autocomplete Input for Excluded Locations */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={exclusionAutocompleteInputRef}
              type="text"
              value={exclusionSearchText}
              onChange={(e) => {
                setExclusionSearchText(e.target.value);
                setSelectedExclusionPlace(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddExcludedLocation();
                }
              }}
              placeholder="Search location via Google Places to exclude (e.g. Najafgarh, Industrial Area, Outer Ring Road)..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-red-300 bg-white focus:border-red-500 outline-none font-medium text-xs shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={handleAddExcludedLocation}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Red Zone Exclusion</span>
          </button>
        </div>

        {/* Excluded Locations Tags List */}
        <div className="flex flex-wrap gap-2 pt-1">
          {excludedLocations.length > 0 ? (
            excludedLocations.map((item, idx) => {
              const name = typeof item === 'string' ? item : item.name;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-300 text-red-950 font-semibold text-xs shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span>{name} (🔴 Excluded Zone)</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExcludedLocation(item)}
                    className="w-4 h-4 rounded-full hover:bg-red-100 flex items-center justify-center text-red-700 hover:text-red-900 transition cursor-pointer"
                    title="Remove exclusion"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })
          ) : (
            <p className="text-[11px] text-red-700 italic">
              No excluded locations selected. The therapist is available across her entire {radiusKm} KM service radius. Add locations above to draw red exclusion circles on the map.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
