import { Box, Text } from '@chakra-ui/react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef, useState } from 'react';

export const MapBox = () => {
    mapboxgl.accessToken = "pk.eyJ1Ijoic2hvbWEyMiIsImEiOiJjbHFhand3bmYxbm0wMmtwczBmbGN1NTliIn0.m3XGYWRW5Z3iERaUh9dXkA"
    const mapRef = useRef(null)
    const [map, setMap] = useState(null);

    // n² is the number of points

    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        if (mapRef.current && !map) {
            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/pichykh/clqalfjtc002u01pog7jwf2x4',
            });

            map.on('click', (event) => {
                const features = map.queryRenderedFeatures(event.point, {
                    layers: ['symbols'] // replace with your layer name
                });
                const feature = features[0];
                if (!features.length) {
                    return;
                }

                const popup = new mapboxgl.Popup({ offset: [0, -15], closeButton: false })
                    .setLngLat(feature.geometry.coordinates)
                    .setHTML(
                        `<h3 style="color:red">${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
                    .addTo(map);
                console.log(feature)
            })
            setMap(map)
        }
    }, [mapRef, map])

    console.log(mapboxgl)
    return (
        <Box>
            <Box ref={mapRef} h="100vh" />
            <Text>Hey!</Text>
        </Box>
    )
}