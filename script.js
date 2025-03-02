mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRraGFsaXMyMDAwIiwiYSI6ImNtNmllbGt4cjA3cGwycXEyaHA0bDcycWwifQ.hrpqSf6zeg2T5GCfRlygWg'; // Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/muhammadkhalis2000/cm6yk8amv00kb01s16rkt56d2', // style URL
    center: [155.41187531993666, 60.61674897619747], // starting position [lng, lat]
    zoom: 1,
});

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
            'circle-color': '#007cbf'
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
            'fill-color': '#007cbf',
            'fill-opacity': 1
        }
    })

});

map.on('mouseenter', 'points', (e) => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('click', 'points', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['points'] });

    if (features.length > 0) {
        const coordinates = features[0].geometry.coordinates;
        console.log('Clicked coordinates:', coordinates);
        map.setCenter(e.features[0].properties.coord);
        map.setZoom(15);
    }
});

map.on('mouseleave', 'points', () => {
    map.getCanvas().style.cursor = '';
});