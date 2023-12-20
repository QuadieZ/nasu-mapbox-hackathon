import { Box, Button, HStack, Image, ListItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, OrderedList, Text, useDisclosure } from '@chakra-ui/react';
import { interpolateHeatmapLayer } from 'interpolateheatmaplayer';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef, useState } from 'react';

const pictures = {
    "Nasu Kogen Strawberry": "https://www.visit-tochigi.com/wp-content/uploads/2021/12/FCAA73E8ECA81B84AE55103FA7B9B0BB.jpg",
    "Nasu Safari Park": "https://storage.googleapis.com/ikidane/upload/spot_727_21887_16f0f2d40f/spot_727_21887_16f0f2d40f.jpg",
    "Kita Onsen": "https://ak-d.tripcdn.com/images/0224212000bj6iy7jF7D2_R_960_660_R5_D.jpg",
    "Nasu Animal Kingdom": "https://animalcafes.com/pix/800-nasu-anikin.jpg"
}
const getClosestCoord = (coords, targetX, targetY) => {
    let minDist = Infinity;
    let index = null;
    let closestCoord = {
        lng: 0,
        lat: 0
    };

    for (let i = 0; i < coords.length; i++) {
        const x = coords[i].lat;
        const y = coords[i].lng;

        const distX = x - targetX;
        const distY = y - targetY;
        const dist = Math.sqrt(distX ** 2 + distY ** 2);

        if (dist < minDist) {
            index = i
            minDist = dist;
            closestCoord.lng = x
            closestCoord.lat = y;
        }
    }

    if (minDist === Infinity) return null
    return index;
}

export const MapBoxTemperature = () => {
    mapboxgl.accessToken = "pk.eyJ1Ijoic2hvbWEyMiIsImEiOiJjbHFhand3bmYxbm0wMmtwczBmbGN1NTliIn0.m3XGYWRW5Z3iERaUh9dXkA"
    const mapRef = useRef(null)
    const [map, setMap] = useState(null);
    const [weatherInfo, setWeatherInfo] = useState({
        feelsLike: null,
        condition: null,
        logo: null
    })
    const [currentDestInfo, setCurrentDestInfo] = useState()
    const [userPosition, setUserPosition] = useState({
        lat: null,
        lng: null
    })
    const [destinations, setDestinations] = useState([])
    const [duration, setDuration] = useState(null)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [points, setPoints] = useState([])
    const startingLatitude = 36.949241;
    const startingLongitude = 139.981765;
    const endingLatitude = 37.128827;
    const endingLongitude = 140.241436;
    const bounds = [
        [startingLongitude, startingLatitude],
        [endingLongitude, endingLatitude]
    ];
    const n = 10;					// n² is the number of points				// n² is the number of points

    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);

    function handleClickDestinationButton() {
        if (!destinations.find(d => d.title === currentDestInfo.title)) {
            destinations.push({
                title: currentDestInfo.title,
                lat,
                lng
            })
        }
        onClose()
    }

    async function handleGenerateRoute() {
        const startingPoint = `${userPosition.lng},${userPosition.lat}`
        const allDestinations = destinations.map(d => `${d.lng},${d.lat}`).join(";")
        //console.log(allDestinations)
        const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startingPoint};${allDestinations}?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=pk.eyJ1Ijoic2hvbWEyMiIsImEiOiJjbHFhand3bmYxbm0wMmtwczBmbGN1NTliIn0.m3XGYWRW5Z3iERaUh9dXkA`).then(
            res => res.json().then(data => data?.routes[0])
        )
        console.log(response)
        const route = response.geometry.coordinates;

        const dur = Math.floor(response.duration) / 60
        setDuration(Math.round(dur * 100) / 100)

        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };
        // if the route already exists on the map, we'll reset it using setData
        if (map.getSource('route')) {
            map.getSource('route').setData(geojson);
        }
        // otherwise, we'll make a new request
        else {
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }
    }

    useEffect(() => {
        (async () => {
            const points = [];
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const lat = startingLatitude + i * (endingLatitude - startingLatitude) / n
                    const lng = startingLongitude + j * (endingLongitude - startingLongitude) / n
                    points.push({
                        lat: Math.round(lat * 100) / 100,
                        lng: Math.round(lng * 100) / 100,
                        val: 0,
                        condition: "",
                        logo: ""
                    })
                }
            }
            // Create the URLs
            const baseUrl = "https://api.weatherapi.com/v1/current.json?";
            const apiKey = 'd54bf972a648436d81d91957231812';
            const urls = points.map(point => baseUrl + "&q=" + point.lat + "," + point.lng + "&key=" + apiKey);

            // Fetch the weather data
            const weathers = await Promise.all(urls.map(async url => {
                const response = await fetch(url);
                return response.text();
            }));
            // Set the temperature
            points.forEach((point, index) => {
                const result = JSON.parse(weathers[index]).current
                point.val = result.feelslike_c
                point.condition = result.condition.text
                point.logo = result.condition.icon
            })

            console.log(points)
            setPoints(points)

        })();
    }, [])

    useEffect(() => {
        if (mapRef.current && !map) {
            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/pichykh/clqalfjtc002u01pog7jwf2x4',
            });
            //map.setMaxBounds(bounds);

            const geolocateControl = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            });

            map.addControl(
                geolocateControl,
                'bottom-left'
            );

            geolocateControl.on('geolocate', (event) => {
                const latitude = event.coords.latitude;
                const longitude = event.coords.longitude;

                setUserPosition({
                    lat: latitude,
                    lng: longitude
                })
            });

            setMap(map)


            map.on('load', () => {
                const oldLayer = map.getStyle().layers.filter(l => l.id === 'symbols')[0]

                map.loadImage(
                    '/fox.png',
                    (error, image) => {
                        if (error) throw error;
                        console.log(image)

                        map.addImage('cat', image);
                        oldLayer.layout['icon-image'] = 'cat'
                        oldLayer.layout['icon-size'] = 0.1
                        oldLayer.id = 'new'

                        map.addLayer(oldLayer)
                    }
                );
            })
        }
    }, [mapRef, map])

    useEffect(() => {
        map?.on('click', (event) => {

            const features = map.queryRenderedFeatures(event.point, {
                layers: ['new'] // replace with your layer name
            });
            const feature = features[0];

            const targetLng = Math.round(event.lngLat.lng * 100) / 100
            const targetLat = Math.round(event.lngLat.lat * 100) / 100

            setLat(targetLat)
            setLng(targetLng)
            const result = getClosestCoord(points, targetLat, targetLng)
            console.log(feature)
            if (!feature) {
                let content = 'Not in Nasu'
                if (result) {
                    content = `
                    <p>Feels like ${points[result].val} ℃</p>
                    <p>Weather: ${points[result].condition}</p>
                    <img src="http:${points[result].logo}"/>
                    `
                }

                const popup = new mapboxgl.Popup({ offset: [0, -15], closeButton: false })
                    .setLngLat(event.lngLat)
                    .setHTML(content)
                    .addTo(map)
            } else {
                setWeatherInfo({
                    feelsLike: points[result]?.val,
                    condition: points[result]?.condition,
                    logo: points[result]?.logo
                })
                console.log(feature)
                setCurrentDestInfo(feature.properties)
                onOpen()
            }
        })
    }, [points, map])

    console.log(currentDestInfo)
    return (
        <Box>
            <Box pos="absolute" background="rgba(255, 255, 255, 0.80)" zIndex={10} p={2} m={2}>
                <Text>Destinations</Text>
                <OrderedList>
                    {destinations?.map(d => (
                        <ListItem key={d?.title}>{d?.title}</ListItem>
                    ))}
                </OrderedList>
                {destinations.length > 0 && <Button onClick={handleGenerateRoute}>Generate Route</Button>}
                {duration && <Text>Trip Duration: {duration} Mins with car</Text>}
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent w="60%" >
                    <ModalHeader>{currentDestInfo?.title}</ModalHeader>
                    <ModalBody alignItems="center" display="flex" flexDir="column">
                        <Image src={pictures[currentDestInfo?.title]} />
                        <Text textAlign="center">{currentDestInfo?.description}</Text>
                        <Text>Feels like {weatherInfo?.feelsLike}</Text>
                        <HStack spacing={-10}>
                            <Image src={`http:${weatherInfo?.logo}`} />
                            <Text>{weatherInfo?.condition}</Text>
                        </HStack>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleClickDestinationButton}>Add to Destination</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Box ref={mapRef} h="100vh" />

        </Box>
    )
}