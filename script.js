// © Year display in footer
const yEl = document.getElementById('y');
if (yEl) yEl.textContent = new Date().getFullYear();

// 🌍 Map centered on Ankara (OpenLayers)
const ankaraLonLat = [32.854, 39.9208];
const ankara3857 = ol.proj.fromLonLat(ankaraLonLat);

// Base layers
const osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM(),
  title: "Street Map",
  type: "base"
});

const satelliteLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
  }),
  title: "Satellite",
  type: "base",
  visible: false
});

// Map creation
const map = new ol.Map({
  target: "map",
  layers: [osmLayer, satelliteLayer],
  view: new ol.View({
    center: ankara3857,
    zoom: 12
  })
});

// 📍 Marker at Kızılay
const marker = new ol.Feature({ geometry: new ol.geom.Point(ankara3857) });
const markerLayer = new ol.layer.Vector({
  source: new ol.source.Vector({ features: [marker] }),
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({ color: "#ff4fa3" }),
      stroke: new ol.style.Stroke({ color: "#fff", width: 2 })
    })
  })
});
map.addLayer(markerLayer);

// 💬 Popup
const popupEl = document.createElement("div");
popupEl.className = "popup";
popupEl.innerHTML = "<strong>Ankara - Kızılay</strong><br>Center Point";
document.body.appendChild(popupEl);

const popup = new ol.Overlay({
  element: popupEl,
  positioning: "bottom-center",
  stopEvent: false,
  offset: [0, -12]
});
map.addOverlay(popup);

map.on("click", function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
  if (feature) {
    popup.setPosition(evt.coordinate);
    popupEl.style.display = "block";
  } else {
    popupEl.style.display = "none";
  }
});

// 🗺️ Layer switcher button
const layerSwitcher = document.createElement("button");
layerSwitcher.textContent = "🗺️ Toggle Map Layer";
layerSwitcher.className = "layer-btn";
document.body.appendChild(layerSwitcher);

layerSwitcher.addEventListener("click", () => {
  const osmVisible = osmLayer.getVisible();
  osmLayer.setVisible(!osmVisible);
  satelliteLayer.setVisible(osmVisible);
});

// 📡 Geolocation button
const geoButton = document.createElement("button");
geoButton.textContent = "📍 Show My Location";
geoButton.className = "geo-btn";
document.body.appendChild(geoButton);

geoButton.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const userLonLat = [pos.coords.longitude, pos.coords.latitude];
      const user3857 = ol.proj.fromLonLat(userLonLat);
      map.getView().animate({ center: user3857, zoom: 14, duration: 1000 });

      const userFeature = new ol.Feature({ geometry: new ol.geom.Point(user3857) });
      const userLayer = new ol.layer.Vector({
        source: new ol.source.Vector({ features: [userFeature] }),
        style: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({ color: "#00BFFF" }),
            stroke: new ol.style.Stroke({ color: "#fff", width: 2 })
          })
        })
      });
      map.addLayer(userLayer);
    });
  } else {
    alert("Your browser does not support geolocation.");
  }
});

// Fade-in on scroll
const faders = document.querySelectorAll('.fade-section');

const appearOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});
