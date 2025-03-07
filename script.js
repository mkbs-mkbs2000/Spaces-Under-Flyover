mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRraGFsaXMyMDAwIiwiYSI6ImNtNmllbGt4cjA3cGwycXEyaHA0bDcycWwifQ.hrpqSf6zeg2T5GCfRlygWg';

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/muhammadkhalis2000/cm7urw8lo01qo01qoap6z9a0m', // new map style
    center: [155.41187531993666, 60.61674897619747], // starting position is set on the eastern Siberia end so that all five points are visible, albeit at the periphery
    zoom: 1, // the zoom level is set to 1 so that all five points are visible, albeit at the periphery
});

// Initialising popup button
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

// Initialising all elements within the <div id="TextToShow"> to be hidden
function dontShow() {
    document.getElementById('NewOrleans').style.display = 'none';
    document.getElementById('Toronto').style.display = 'none';
    document.getElementById('Mumbai').style.display = 'none';
    document.getElementById('Zaanstad').style.display = 'none';
    document.getElementById('Bandung').style.display = 'none';
};

// Function to display text based on the point clicked
function textToShow(e) {
    document.getElementById('intro').style.display = 'none'; // First, the intro text is hidden
    document.getElementById('TextToShow').style.display = 'block'; // Then, the entire <div id="TextToShow"> is activated

    dontShow(); // This is to hide all the elements initially, using the function defined above

    // Thus the block of else if code is to customise the displayed text based on the point clicked
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
    
    // Adding the layer of points where areas under flyovers have been revitalised, which is to be shown at the start when the map first loads
    map.addSource('points', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mkbs-mkbs2000/Spaces-Under-Flyover/refs/heads/main/data/point-flyover.geojson'
    });

    // Classifying the colour of points based on the year that the space was opened for public use
    map.addLayer({
        'id': 'points',
        'type': 'circle',
        'source': 'points',
        'paint': {
            'circle-radius': 7.5,
            'circle-color': [
                'case',
                ['==', ['get', 'OpeningYr'], 2005], '#690469',
                ['==', ['get', 'OpeningYr'], 2014], '#167616',
                ['==', ['get', 'OpeningYr'], 2018], '#ffff00',
                ['==', ['get', 'OpeningYr'], 2022], '#ff0000',
                '#000000'
            ]
        }
    });

    // Adding the layer of polygons that shows the specific areas under flyover that has been revitalised, which is shown when map has zoomed in
    map.addSource('polygons',{
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mkbs-mkbs2000/Spaces-Under-Flyover/refs/heads/main/data/polygon-flyover.geojson'
    });

    // Setting a standard fill colour for the specific areas under flyovers that have been revitalised
    map.addLayer({
        'id': 'polygons',
        'type': 'fill',
        'source': 'polygons',
        'paint': {
            'fill-color': '#ff000d',
            'fill-opacity': 0.65
        }
    });

    // Initialising the polygon layer to be hidden when the map first loads
    map.setLayoutProperty('points', 'visibility', 'visible');
    map.setLayoutProperty('polygons', 'visibility', 'none');

    // Adding the navigation control to the map at the top-right corner
    // I removed compass from the navigation control
    map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-right');

    // When map loads, popup message to inform readers how to use the website, toggling between points and returning to default extent
    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    welcomeModal.show();
});

// Function at the default extent view when the mouse hovers over a point
map.on('mouseenter', 'points', (e) => {

    // The mouse cursor changes to a pointer when hovering over a point
    map.getCanvas().style.cursor = 'pointer';

    // Extracting description to be shown in the popup and the coordinates where the popup will be displayed
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.Name + '<br>' + e.features[0].properties.Location;

    // Pushing the popup on to the map with the description at the specific coordinates, as have been respectively initialised above
    popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
});

// When the mouse leaves, the pointer reverts back to normal mouse cursor and the popup disappears
map.on('mouseleave', 'points', () => {
    map.getCanvas().style.cursor = '';

    popup.remove();
});

map.on('click', 'points', (e) => {

    // Extracting the coordinates of the point clicked so that it can be roughly used as the centre point of the zoomed-in view
    const coordinates = e.features[0].geometry.coordinates.slice();
    
    // When a point is clicked, the map flies into to the specific area under the flyover that has been revitalised
    map.flyTo({
        center: coordinates,
        zoom: 13,
        essential: true
    });

    // The points layer will then be hidden, while the polygons layer will be shown
    map.setLayoutProperty('points', 'visibility', 'none');
    map.setLayoutProperty('polygons', 'visibility', 'visible');

    // Calling the function to customise the displayed text in the left panel based on the point clicked
    textToShow(e);

    // The Opening Year Legend is hidden, while the Revitalised Area Legend is activated
    document.getElementById('areaLegend').style.display = 'block';
    document.getElementById('yearLegend').style.display = 'none';
});

// When the mouse hovers over the home icon, the popup becomes visible and fully opaque
document.getElementById('home').addEventListener('mouseover', () => {
    document.getElementById('returnPop').style.visibility = 'visible';
    document.getElementById('returnPop').style.opacity = '1';
});

// When the mouse leaves the home icon, the popup returns to become invisible and fully transparent
document.getElementById('home').addEventListener('mouseout', () => {
    document.getElementById('returnPop').style.visibility = 'hidden';
    document.getElementById('returnPop').style.opacity = '0';
});

document.getElementById('home').addEventListener('click', () => {
    
    // When the home icon is clicked, the map flies back to the default extent view
    map.flyTo({
        center: [155.41187531993666, 60.61674897619747],
        zoom: 1,
        essential: true
    });

    // The points layer will return to be shown, while the polygons layer will be hidden, similar to when the map is first loaded
    map.setLayoutProperty('points', 'visibility', 'visible');
    map.setLayoutProperty('polygons', 'visibility', 'none');

    // The text in the left panel will revert to the intro text, similar to when the webpage is first loaded
    document.getElementById('intro').style.display = 'block';
    document.getElementById('TextToShow').style.display = 'none';

    // The legend reverts back to Opening Year Legend, similar to when the map is first loaded
    document.getElementById('yearLegend').style.display = 'block';
    document.getElementById('areaLegend').style.display = 'none';
});