
mapboxgl.accessToken = 'pk.eyJ1IjoicmsyNXVtYXIiLCJhIjoiY2tyeGEzbzgxMG9qdzMxbnE5cHQ0MXY5MiJ9.SbAfLASCvTd5LoeP4U28Jg';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center:campground.geometry.coordinates , // starting position [lng, lat]
zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker({color:'black'})
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h5>${campground.title}</h5><p>${campground.location}<p>`
    )
)
.addTo(map)