import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const hdTextureURL = new URL('../img/MR_INT-004_BigWindowTree_Thea.hdr', import.meta.url)

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0,0,7);
orbit.update();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = function(url, item, total){
//     console.log(`Started Loading : ${url}`)
// }

const progressBar = document.getElementById('progress-bar')

loadingManager.onProgress = function(url, loaded, total){
    progressBar.value = (loaded/total)*100;
}

const progressContainer = document.querySelector('.progress-bar-container');
loadingManager.onLoad = function(){
    progressContainer.style.display = `none`
}

const loader = new RGBELoader(loadingManager);
loader.load(hdTextureURL, function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture;
    //? To add realistic shading around the sphere
    scene.environment = texture;

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 50, 50),
        new THREE.MeshStandardMaterial({
            roughness: 0,
            metalness: 0.5,
            color: 0xFFEA00
        })
    )
    scene.add(sphere)
    sphere.position.x = 3

    const sphere3 = new THREE.Mesh(
        new THREE.SphereGeometry(1, 50, 50),
        new THREE.MeshStandardMaterial({
            roughness: 0,
            metalness: 0,
            //color: 0xFFEA00
        })
    )
    scene.add(sphere3)
    sphere3.position.x = 0

    const sphere2 = new THREE.Mesh(
        new THREE.SphereGeometry(1, 50, 50),
        new THREE.MeshPhysicalMaterial({
            roughness: 0,
            metalness: 0,
            //color: 0xFFEA00
            transmission: 1
        })
    )
    scene.add(sphere2)
    sphere2.position.x = -3
    
})

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});