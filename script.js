var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0, 0, 200);

var scene = new THREE.Scene();

var backgroundT = new THREE.CubeTextureLoader();
scene.background = backgroundT.load([
  "stars.jpg",
  "stars.jpg",
  "stars.jpg",
  "stars.jpg",
  "stars.jpg",
  "stars.jpg"
]);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 500;

var textureLoader = new THREE.TextureLoader();

function createPlanet(texturePath, radius, distanceFromSun, orbitalPeriod, rotationSpeed) {
  var planetTexture = textureLoader.load(texturePath);
  var planetGeometry = new THREE.SphereGeometry(radius, 50, 50);
  var planetMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: planetTexture,
  });
  var planet = new THREE.Mesh(planetGeometry, planetMaterial);
  scene.add(planet);

  if (orbitalPeriod > 0) {
    planet.orbitRadius = distanceFromSun;
    planet.orbitalPeriod = orbitalPeriod;
    planet.angle = Math.random() * Math.PI * 2;
  }

  planet.rotationSpeed = rotationSpeed;

  // Create red orbit path
  var orbitGeometry = new THREE.BufferGeometry();
  var orbitVertices = [];

  for (var i = 0; i <= 360; i++) {
    var radians = i * (Math.PI / 180);
    var x = distanceFromSun * Math.cos(radians);
    var z = distanceFromSun * Math.sin(radians);
    orbitVertices.push(x, 0, z);
  }

  orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));
  var orbitMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  var orbitPath = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(orbitPath);

  return planet;
}

var sun = createPlanet("sun1.jpg", 50, 0, 0, 0);
var mercury = createPlanet("mercury.jpg", 5, 70, 88, 0.03);
var venus = createPlanet("venus.jpg", 10, 120, 225, 0.02);
var earth = createPlanet("earth1.jpg", 10, 180, 365, 0.01);
var mars = createPlanet("mars1.jpg", 8, 240, 687, 0.01);
var jupiter = createPlanet("jupiter1.jpg", 25, 360, 4333, 0.01);
var saturn = createPlanet("saturn1.jpg", 20, 480, 10759, 0.01);
var neptune = createPlanet("neptune.jpg", 15, 600, 60190, 0.01);

var moon = createPlanet("moon1.jpg", 2, 30, 27.3, 0.02);
earth.add(moon);


function updatePlanets() {
  var time = Date.now();

  updatePlanetPosition(earth, time);

  if (mercury.orbitRadius) {
    updatePlanetPosition(mercury, time);
  }

  if (venus.orbitRadius) {
    updatePlanetPosition(venus, time);
  }

  if (mars.orbitRadius) {
    updatePlanetPosition(mars, time);
  }

  if (jupiter.orbitRadius) {
    updatePlanetPosition(jupiter, time);
  }

  if (saturn.orbitRadius) {
    updatePlanetPosition(saturn, time);
  }

  if (neptune.orbitRadius) {
    updatePlanetPosition(neptune, time);
  }

  mercury.rotation.y += mercury.rotationSpeed;
  venus.rotation.y += venus.rotationSpeed;
  earth.rotation.y += earth.rotationSpeed;
  mars.rotation.y += mars.rotationSpeed;
  jupiter.rotation.y += jupiter.rotationSpeed;
  saturn.rotation.y += saturn.rotationSpeed;
  neptune.rotation.y += neptune.rotationSpeed;

  updatePlanetPosition(moon, time, moon.orbitRadius, moon.orbitalPeriod);
  moon.rotation.y += moon.rotationSpeed;

  renderer.render(scene, camera);
  requestAnimationFrame(updatePlanets);
}

function updatePlanetPosition(planet, time) {
  var daysPerMillisecond = planet.orbitalPeriod / (24 * 60 * 60 * 1000);
  planet.angle = (time * 2 * Math.PI) / (planet.orbitalPeriod * 1000);
  var x = planet.orbitRadius * Math.cos(planet.angle);
  var z = planet.orbitRadius * Math.sin(planet.angle);
  planet.position.set(x, 0, z);

}

updatePlanets();