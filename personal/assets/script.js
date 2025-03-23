import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

// Get the model path from the HTML element
const viewerElement = document.getElementById('viewer');
const modelPath = viewerElement.dataset.model || 'default_model.stl'; // Fallback if not set

// Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Set up the camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
viewerElement.appendChild(renderer.domElement);

// Enhanced lighting setup
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(1, 1, 1).normalize();
scene.add(mainLight);

const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
secondaryLight.position.set(-1, -1, -1).normalize();
scene.add(secondaryLight);

const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
topLight.position.set(0, 1, 0).normalize();
scene.add(topLight);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Load the STL file
const loader = new STLLoader();
loader.load(modelPath, function(geometry) {
    const material = new THREE.MeshPhongMaterial({
        color: 0x1e88e5,
        specular: 0x111111,
        shininess: 30,
        flatShading: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Center model
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const center = new THREE.Vector3();
    box.getCenter(center);
    mesh.position.sub(center);

    // Adjust camera to fit model
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    camera.position.set(0, 0, maxDim * 2);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();

    scene.add(mesh);
    console.log("Model loaded successfully:", modelPath);
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
