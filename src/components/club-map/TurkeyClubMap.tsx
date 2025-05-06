"use client";

import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import ClubInfoCard from './ClubInfoCard';
import clubsData, { ClubData } from '../../data/clubsData';

// Türkiye haritasının merkezi (yaklaşık olarak)
const turkeyCenter = {
  lat: 39.0,
  lng: 35.0
};

// Google Maps API için seçenekler
const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: true,
  mapTypeControl: false,
  styles: [
    {
      featureType: 'administrative.country',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#3B82F6' },
        { weight: 2 }
      ]
    }
  ]
};

// InfoWindow stil ayarları - bu objeyi bileşen içine taşıyorum
// İlk yüklemede Google Maps henüz yüklenmemiş olduğu için bu kısım hata veriyor

const TurkeyClubMap: React.FC = () => {
  // Google Maps API'yi yükleme
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [selectedClub, setSelectedClub] = useState<ClubData | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Harita referansı
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Harita yüklendiğinde çağrılacak fonksiyon
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMap(map);
  }, []);
  
  // Harita unload olduğunda çağrılacak fonksiyon
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);
  
  // İşarete tıklandığında çağrılacak fonksiyon
  const handleMarkerClick = (club: ClubData) => {
    setSelectedClub(club);
  };
  
  // InfoWindow kapatıldığında çağrılacak fonksiyon
  const handleInfoWindowClose = () => {
    setSelectedClub(null);
  };
  
  // Google Maps API yüklenirken hata oluşursa
  if (loadError) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Harita yüklenirken hata oluştu</h3>
        <p className="text-blue-500 dark:text-blue-300">Google Haritalar API'si yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }
  
  // Google Maps API henüz yüklenmediyse
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="mt-2 h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg">
      <GoogleMap
        id="turkey-club-map"
        mapContainerStyle={mapContainerStyle}
        center={turkeyCenter}
        zoom={6}
        options={mapOptions}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
      >
        {/* Kulüplerin konumlarını işaretle */}
        {clubsData.map((club) => (
          <Marker
            key={club.id}
            position={club.location}
            onClick={() => handleMarkerClick(club)}
            icon={{
              url: '/marker-icon.svg',
              scaledSize: isLoaded ? new window.google.maps.Size(36, 36) : undefined,
              origin: isLoaded ? new window.google.maps.Point(0, 0) : undefined,
              anchor: isLoaded ? new window.google.maps.Point(18, 36) : undefined
            }}
            animation={isLoaded && window.google.maps ? window.google.maps.Animation.DROP : undefined}
          />
        ))}
        
        {/* Seçilen kulüp bilgilerini gösteren InfoWindow */}
        {selectedClub && isLoaded && (
          <InfoWindow
            position={selectedClub.location}
            onCloseClick={handleInfoWindowClose}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
              maxWidth: 320
            }}
          >
            <ClubInfoCard club={selectedClub} onClose={handleInfoWindowClose} />
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Harita altındaki açıklama */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg z-10 max-w-xs w-auto border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-1">
            <svg className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Türkiye'deki HSD Kulüpleri</h4>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Haritada işaretli noktalar HSD kulüplerinin 
            bulunduğu şehirleri gösterir. Detaylı bilgi 
            için işaretlere tıklayabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TurkeyClubMap; 