import { coordinates } from './data/coordinates';
import ListItem from './ListItem';

import React, { useRef, useEffect, useState } from 'react';

import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';

import '@tomtom-international/web-sdk-maps/dist/maps.css';
import './index.css';

const App = () => {
  const API_KEY = process.env.REACT_APP_TOMTOM_API_KEY;
  const WAREHOUSE = [39.72506498241886, 47.22738590634815];

  const mapElement = useRef();
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    const map = tt.map({
      key: API_KEY,
      container: mapElement.current,
      center: WAREHOUSE,
      zoom: 13.5,
    });
    setMap(map);

    const addMarker = (coords) => {
      const element = document.createElement('div');
      element.className = 'marker-warehouse';
      const marker = new tt.Marker({ element: element })
        .setLngLat(coords)
        .addTo(map);
      setMarkers((markers) => [...markers, marker]);
    };

    addMarker(WAREHOUSE);

    return () => map.remove();
  }, []);

 

  const route = () => {
    const key = API_KEY;
    const locations = [WAREHOUSE, markers[2].getLngLat()];

    calculateRoute('green', {
      key,
      locations,
    });
  };

  const calculateRoute = async (color, routeOptions) => {
    try {
      const response = await services.calculateRoute(routeOptions);
      const geojson = response.toGeoJson();
      setCalculation(geojson);

      map.addLayer({
        id: color,
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson,
        },
        paint: {
          'line-color': color,
          'line-width': 5,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addDeliveryPointMarker = (el) => {
    if (markers.length > 2) {
    }
    if (markers[2]) {
      if (map.getLayer('green')) {
        removeRoute('green');
      }

      markers[2].setLngLat([el.lng, el.lat]);

      route();
    } else {
      const addMarker = () => {
        const element = document.createElement('div');
        element.className = 'marker-delivery';

        const marker = new tt.Marker({ element: element })
          .setLngLat([el.lng, el.lat])
          .addTo(map);
        markers[2] = marker;
      };

      addMarker();

      route();
    }
  };

  const removeRoute = (id) => {
    map.removeLayer(id);
    map.removeSource(id);
  };

  useEffect(() => {
    if (calculation) {
      const distance =
        calculation.features[0].properties.summary.lengthInMeters / 1000;

      if (distance < 4) {
        map.zoomTo(13.5);
      }

      if (distance > 6) {
        map.zoomTo(12);
      }
      if (distance > 9) {
        map.zoomTo(11.5);
      }
    }
  }, [map, calculation]);
  console.log(markers);
  return (
    <div className="h-screen w-screen font-RobotoSlug">
      <div className="flex justify-center items-center font-bold text-3xl mt-10 mb-5  ">
        Выберите пункт выдачи
      </div>
      <div className="flex justify-center items-center font-bold text-2xl mt-5 mb-5">
        {calculation
          ? `Расстояние: ${Number(
              calculation.features[0].properties.summary.lengthInMeters / 1000
            ).toFixed(2)} км          Срок доставки: ~ ${Number(
              calculation.features[0].properties.summary.travelTimeInSeconds /
                60
            ).toFixed(1)} мин`
          : 'для рассчета расстояния и времени в пути'}
      </div>
      <main className="h-full flex justify-center items-start ">
        <div className="flex flex-col justify-center items-start  mr-5 ml-5 w-2/12">
          <ul>
            {coordinates.map((el) => {
              return (
                <li
                  key={Math.random() * 10}
                  className="mt-2 mb-2"
                  onClick={addDeliveryPointMarker.bind(null, el)}
                >
                  <ListItem
                    lng={el.lng}
                    lat={el.lat}
                    name={el.name}
                    key={el.id}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-10/12 h-3/4">
          <div ref={mapElement} className="w-full h-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
};

export default App;
