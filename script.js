mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRraGFsaXMyMDAwIiwiYSI6ImNtNmllbGt4cjA3cGwycXEyaHA0bDcycWwifQ.hrpqSf6zeg2T5GCfRlygWg'; // Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/muhammadkhalis2000/cm7rzt31l001m01s01te6bc10', // style URL
    center: [155.41187531993666, 60.61674897619747], // starting position [lng, lat]
    zoom: 1,
});

map.on('load', () => {

    map.addSource('points', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mkbs-mkbs2000/Spaces-Under-Flyover/refs/heads/main/data/point-flyover.geojson',
        tolerance: 0
    });

    map.addLayer({
        'id': 'points',
        'type': 'circle',
        'source': 'points',
        'paint': {
            'circle-radius': 5,
            'circle-color': '#007cbf'
        }
    });

    map.addSource('polygons',{
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mkbs-mkbs2000/Spaces-Under-Flyover/refs/heads/main/data/polygon-flyover.geojson',
        tolerance: 0
    });

    map.addLayer({
        'id': 'polygons',
        'type': 'fill',
        'source': 'polygons',
        'paint': {
            'fill-color': '#007cbf',
            'fill-opacity': 0.5
        }
    })

});

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
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
});