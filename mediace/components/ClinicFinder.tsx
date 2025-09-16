import React, { useState, useEffect, useRef } from 'react';
import type { ClinicResult } from '../types';

// Declare Leaflet in the window scope for CDN usage
declare const L: any;

// Haversine distance calculation
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

const ClinicFinder: React.FC = () => {
    const [locationQuery, setLocationQuery] = useState('');
    const [radius, setRadius] = useState(5);
    const [results, setResults] = useState<ClinicResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchedLocation, setSearchedLocation] = useState<{lat: number, lon: number} | null>(null);
    const [noResults, setNoResults] = useState(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markersLayer = useRef<any>(null);

    // Initialize map
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Default to India
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
            markersLayer.current = L.layerGroup().addTo(mapInstance.current);
        }
    }, []);

    // Update map when results change
    useEffect(() => {
        if (mapInstance.current && markersLayer.current) {
            markersLayer.current.clearLayers();
            if (searchedLocation) {
                const userIcon = L.divIcon({
                    html: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>',
                    className: '',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32]
                });
                L.marker([searchedLocation.lat, searchedLocation.lon], { icon: userIcon })
                    .addTo(markersLayer.current)
                    .bindPopup("Your Location");
            }
            results.forEach(clinic => {
                L.marker([clinic.lat, clinic.lon])
                    .addTo(markersLayer.current)
                    .bindPopup(`<b>${clinic.name}</b>`);
            });

            if (results.length > 0 && searchedLocation) {
                const bounds = L.latLngBounds(results.map(r => [r.lat, r.lon]));
                bounds.extend([searchedLocation.lat, searchedLocation.lon]);
                mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
            } else if (searchedLocation) {
                 mapInstance.current.setView([searchedLocation.lat, searchedLocation.lon], 13);
            }
        }
    }, [results, searchedLocation]);
    
    useEffect(() => {
        if(searchedLocation) {
            handleSearch();
        }
    }, [radius]);

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!locationQuery && !searchedLocation) return;
        
        setIsLoading(true);
        setError(null);
        setNoResults(false);
        setResults([]);

        try {
            let lat, lon;
            if(!searchedLocation || locationQuery){
                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
                const geoData = await geoResponse.json();
                if (geoData.length === 0) {
                    throw new Error("Location not found. Please try a different city, area, or pincode.");
                }
                lat = parseFloat(geoData[0].lat);
                lon = parseFloat(geoData[0].lon);
                setSearchedLocation({ lat, lon });
            } else {
                lat = searchedLocation.lat;
                lon = searchedLocation.lon;
            }

            const overpassQuery = `
                [out:json][timeout:25];
                (
                  node["amenity"~"clinic|hospital"](around:${radius * 1000},${lat},${lon});
                  way["amenity"~"clinic|hospital"](around:${radius * 1000},${lat},${lon});
                  relation["amenity"~"clinic|hospital"](around:${radius * 1000},${lat},${lon});
                );
                out center;`;
            
            const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: overpassQuery,
            });
            const overpassData = await overpassResponse.json();
            
            if (overpassData.elements.length === 0) {
                setNoResults(true);
            } else {
                 const clinicResults: ClinicResult[] = overpassData.elements
                    .filter((el: any) => el.tags?.name)
                    .map((el: any) => {
                        const clinicLat = el.lat || el.center.lat;
                        const clinicLon = el.lon || el.center.lon;
                        return {
                            id: el.id,
                            name: el.tags.name,
                            lat: clinicLat,
                            lon: clinicLon,
                            distance: getDistance(lat, lon, clinicLat, clinicLon),
                        };
                    })
                    .sort((a: ClinicResult, b: ClinicResult) => a.distance - b.distance);
                
                setResults(clinicResults);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Find Nearby Clinics & Hospitals</h3>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    value={locationQuery}
                    onChange={e => setLocationQuery(e.target.value)}
                    placeholder="Enter City, Area, or Pincode"
                    className="flex-grow block w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <select 
                    value={radius} 
                    onChange={e => setRadius(Number(e.target.value))}
                    className="block w-full sm:w-auto rounded-md bg-white border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                    <option value={5}>5 km</option>
                    <option value={8}>8 km</option>
                </select>
                <button type="submit" disabled={isLoading} className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                {/* Results List */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-700">Results</h4>
                    </div>
                    <div className="overflow-y-auto max-h-[350px]">
                       {isLoading && <p className="p-4 text-center text-gray-500">Loading...</p>}
                       {noResults && <p className="p-4 text-center text-gray-500">No hospitals or clinics found in this area.</p>}
                       {results.length > 0 && (
                            <ul>
                                {results.map(clinic => (
                                    <li key={clinic.id} className="p-3 border-b border-gray-100 hover:bg-slate-50">
                                        <p className="font-semibold text-gray-800">{clinic.name}</p>
                                        <p className="text-sm text-gray-600">{clinic.distance.toFixed(2)} km away</p>
                                    </li>
                                ))}
                            </ul>
                       )}
                    </div>
                </div>
                {/* Map */}
                <div ref={mapRef} className="h-[400px] w-full rounded-lg border border-gray-200 z-0"></div>
            </div>
        </div>
    );
};

export default ClinicFinder;
