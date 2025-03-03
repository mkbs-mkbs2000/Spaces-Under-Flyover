mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRraGFsaXMyMDAwIiwiYSI6ImNtNmllbGt4cjA3cGwycXEyaHA0bDcycWwifQ.hrpqSf6zeg2T5GCfRlygWg'; // Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/muhammadkhalis2000/cm6yk8amv00kb01s16rkt56d2', // style URL
    center: [155.41187531993666, 60.61674897619747], // starting position [lng, lat]
    zoom: 1,
});

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

function dontShow() {
    document.getElementById('NewOrleans').style.display = 'none';
    document.getElementById('Toronto').style.display = 'none';
    document.getElementById('Mumbai').style.display = 'none';
    document.getElementById('Zaanstad').style.display = 'none';
    document.getElementById('Bandung').style.display = 'none';
};

function textToShow(e) {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('TextToShow').style.display = 'block';

    dontShow();

    if (e.features[0].properties.Name === 'Claiborne Corridor') {
        document.getElementById('NewOrleans').style.display = 'block';
    } else if (e.features[0].properties.Name === 'The Bentway') {
        document.getElementById('Toronto').style.display = 'block';
    } else if (e.features[0].properties.Name === 'One Green Mile') {
        document.getElementById('Mumbai').style.display = 'block';
    } else if (e.features[0].properties.Name === 'A8ernA') {
        document.getElementById('Zaanstad').style.display = 'block';
    } else {
        document.getElementById('Bandung').style.display = 'block';
    }
};

map.on('load', () => {
    map.addSource('points', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mkbs-mkbs2000/Spaces-Under-Flyover/refs/heads/main/data/point-flyover.geojson'
    });

    map.addLayer({
        'id': 'points',
        'type': 'circle',
        'source': 'points',
        'paint': {
            'circle-radius': 5,
            'circle-color': [
                'case',
                ['==', ['get', 'OpeningYr'], 2005], '#800080',
                ['==', ['get', 'OpeningYr'], 2014], '#00FF00',
                ['==', ['get', 'OpeningYr'], 2018], '#FFD700',
                ['==', ['get', 'OpeningYr'], 2022], '#FF6347',
                '#000000'
            ]
        }
    });

    map.addSource('polygons',{
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mkbs-mkbs2000/Spaces-Under-Flyover/refs/heads/main/data/polygon-flyover.geojson'
    });

    map.addLayer({
        'id': 'polygons',
        'type': 'fill',
        'source': 'polygons',
        'paint': {
            'fill-color': '#ff000d',
            'fill-opacity': 0.65
        }
    });

    map.setLayoutProperty('polygons', 'visibility', 'none');

    document.getElementById('areaLegend').style.display = 'block';
    document.getElementById('yearLegend').style.display = 'none';
});

map.on('mouseenter', 'points', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.Name + '<br>' + e.features[0].properties.Location;

    popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
});

map.on('click', 'points', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();

    map.flyTo({
        center: coordinates,
        zoom: 13,
        essential: true
    });

    map.setLayoutProperty('points', 'visibility', 'none');
    map.setLayoutProperty('polygons', 'visibility', 'visible');

    textToShow(e);

    document.getElementById('yearLegend').style.display = 'block';
    document.getElementById('areaLegend').style.display = 'none';
});

map.on('mouseleave', 'points', () => {
    map.getCanvas().style.cursor = '';

    popup.remove();
});

document.getElementById('return').addEventListener('click', () => {
    map.flyTo({
        center: [155.41187531993666, 60.61674897619747],
        zoom: 1,
        essential: true
    });

    map.setLayoutProperty('points', 'visibility', 'visible');
    map.setLayoutProperty('polygons', 'visibility', 'none');

    document.getElementById('intro').style.display = 'block';
    document.getElementById('TextToShow').style.display = 'none';

    document.getElementById('areaLegend').style.display = 'block';
    document.getElementById('yearLegend').style.display = 'none';
});