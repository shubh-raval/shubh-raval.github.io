// stl-viewer.js - Save this as a separate file
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Global object to store viewer references
window.stlViewers = {};

// Create and return a viewer object for the given container
export function createViewer(containerId, modelPath = 'default_model.stl') {
  // Get the container element
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container element with id "${containerId}" not found`);
    return null;
  }
  
  // Set up scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // Set up renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Set up camera
  const camera = new THREE.PerspectiveCamera(
    45, 
    container.clientWidth / container.clientHeight, 
    0.1, 
    1000
  );
  camera.position.set(0, 0, 50);
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0x888888);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  
  // Add orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.autoRotate = true;  // Enable auto-rotation by default
  controls.autoRotateSpeed = 2.0;
  // Track model mesh
  let mesh = null;
  
  // Load STL file
  const loader = new STLLoader();
  loader.load(
    modelPath,
    (geometry) => {
      const material = new THREE.MeshPhongMaterial({
        color: 0x1e88e5,
        specular: 0x111111,
        shininess: 30
      });
      
      mesh = new THREE.Mesh(geometry, material);
      
      // Center the model
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      mesh.position.sub(center);
      
      // Adjust camera to fit model
      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      
      camera.position.set(0, 0, maxDim * 2);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
      
      scene.add(mesh);
      console.log("Model loaded successfully:", modelPath);
    },
    undefined,
    (error) => {
      console.error('Error loading STL:', error);
    }
  );
  
  // Handle window resize
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Define control functions
  function rotate() {
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
  }
  
  function zoom() {
    controls.enableRotate = false;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = false;
  }
  
  function pan() {
    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = true;
    controls.autoRotate = false;
  }
  
  function reset() {
    if (mesh) {
      const geometry = mesh.geometry;
      geometry.computeBoundingBox();
      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      
      camera.position.set(0, 0, maxDim * 2);
      camera.lookAt(0, 0, 0);
    }
    
    controls.target.set(0, 0, 0);
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 2.0;
    controls.update();
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    // Only render if container is visible
    if (container.offsetHeight > 0 && container.offsetWidth > 0) {
      controls.update();
      renderer.render(scene, camera);
    }
  }
  
  animate();
  
  
  // Modify the setupControls function in your stl-viewer.js
  const setupControls = () => {
    // Find control buttons related to this specific viewer
    const buttons = document.querySelectorAll(`.cad-control-btn[data-target="${containerId}"], .cad-control-btn:not([data-target])`);
    
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        
        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Execute the appropriate action
        if (action === 'rotate') rotate();
        else if (action === 'zoom') zoom();
        else if (action === 'pan') pan();
        else if (action === 'reset') reset();
      });
    });
  };
  
  setupControls();
  
  // Create viewer instance with resize method and existing API
  const viewerInstance = {
    scene: scene,
    renderer: renderer,
    camera: camera,
    controls: controls,
    mesh: mesh,
    container: container,
    resize: () => {
      if (container.offsetHeight > 0) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.render(scene, camera);
      }
    },
    loadModel: (newModelPath) => {
      if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh = null;
      }
      
      loader.load(
        newModelPath,
        (geometry) => {
          const material = new THREE.MeshPhongMaterial({
            color: 0x1e88e5,
            specular: 0x111111,
            shininess: 30
          });
          
          mesh = new THREE.Mesh(geometry, material);
          
          // Center the model
          geometry.computeBoundingBox();
          const center = new THREE.Vector3();
          geometry.boundingBox.getCenter(center);
          mesh.position.sub(center);
          
          // Adjust camera to fit model
          const size = new THREE.Vector3();
          geometry.boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          
          camera.position.set(0, 0, maxDim * 2);
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
          controls.update();
          
          scene.add(mesh);
          console.log("Model loaded successfully:", newModelPath);
        }
      );
    },
    dispose: () => {
      window.removeEventListener('resize', handleResize);
      if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      renderer.dispose();
      controls.dispose();
    }
  };
  
  // Store the viewer reference globally
  window.stlViewers[containerId] = viewerInstance;
  
  return viewerInstance;
}
// Add this function to your stl-viewer.js
export function reinitializeViewer(containerId) {
  const viewer = window.stlViewers[containerId];
  if (viewer) {
    // Force a complete re-render
    viewer.resize();
    if (viewer.scene && viewer.camera) {
      viewer.controls.update();
      viewer.renderer.render(viewer.scene, viewer.camera);
    }
  }
}
// Add this function to your stl-viewer.js file
export function setAutoRotation(containerId, enable, speed = 2.0) {
  const viewer = window.stlViewers[containerId];
  
  if (!viewer) {
    console.error(`Viewer with id "${containerId}" not found`);
    return false;
  }
  
  // Set auto-rotation state
  viewer.controls.autoRotate = enable;
  
  // Set rotation speed if provided
  if (speed !== undefined) {
    viewer.controls.autoRotateSpeed = speed;
  }
  
  // Return current auto-rotation state
  return viewer.controls.autoRotate;
}

// Function to update viewer when tab visibility changes
export function updateViewerVisibility(containerId) {
  const viewer = window.stlViewers[containerId];
  if (viewer) {
    // Force resize if container is now visible
    if (viewer.container.offsetHeight > 0) {
      viewer.resize();
    }
  }
}