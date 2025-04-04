declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions);
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
    }
    
    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
    }
    
    enum Animation {
      DROP,
      BOUNCE
    }
    
    interface MapOptions {
      zoom?: number;
      center?: LatLng;
      styles?: any[];
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      mapTypeControl?: boolean;
    }
  }
} 