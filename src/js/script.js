import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'

import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'

const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75, //Field of View --> Generally between 40 and 80
    window.innerWidth / window.innerHeight , // Aspect ratio
    0.1, //Near
    1000 //Far 
);
const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper =  new THREE.AxesHelper(5) //length of the axis
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update()


const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    //? Since this is affected by the lightso this will get affected by ambient and all lights that are thrown at it
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI; //This is to make the plane the same as the grid as we have made. But below this will look hollow
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);//size, smaller squares--> more no. --> smaller squares
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4)
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false
})//?This material doesn't need any light source
// const sphereMaterial = new THREE.MeshLambertMaterial({
//     color: 0x0000FF,
//     wireframe: false
// })//? This one does need a light source. Otherwise the spher will look dark. This is how it works in real life.
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true; // Enable shadow casting
// scene.add(directionalLight);
// directionalLight.shadow.camera.bottom = -20;
// //? This lights also helps with the shading of sphere

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper)


// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper) //?THis is because the shadows were not coming fully. This is because the camera was not set properly. This is the helper to see the camera of the light
// //? Now we have seen that the light rays of camera only tyouches halfway of spherew son it gives such halfway shadows. SO now we just tell the camera to go a lil bit back. We have done that above in DirectionalLight one. decrease the bottom, that's what I am talking about

const spotlight = new THREE.SpotLight(0xFFFFFF, 10000);
scene.add(spotlight)
spotlight.position.set(-100, 100, 0)
spotlight.castShadow = true;
spotlight.angle = 0.2

const sLightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(sLightHelper)

//! Two methods of showing fog
// scene.fog =new THREE.Fog(0xFFFFFF, 0, 200) //? The further you go from 200, the more fog will cover up your vision
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01) //? Color and inensity. The further you go more, fog will come up


const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars)
const cubeTextureLoaders = new THREE.CubeTextureLoader(); //? This for 3d looking background
scene.background = cubeTextureLoaders.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars
]);

const circle2Geometry = new THREE.SphereGeometry(6);
const circle2Material = new THREE.MeshBasicMaterial({
    //color: 0xFF4534,
    map:textureLoader.load(nebula)
})
const circle2 = new THREE.Mesh(circle2Geometry, circle2Material)
scene.add(circle2);
circle2.position.set(0,15,10) //? Tried it on sphere but some irregularities are there. Don't know why

const box2Geometry = new THREE.BoxGeometry(4,4,4);
const box2Material = new THREE.MeshBasicMaterial({
    //color: 0xFF4534,
    //map:textureLoader.load(nebula)
})
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
]//? This is how we can add different textures to different faces of the box

const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial)
scene.add(box2);
box2.position.set(-20,15,10)
box2.material.map = textureLoader.load(nebula) //? Another way of adding texture to the object
//* What if we want to have different texture for each face of the box. SO we have to add 6 textures. It is shown above

const gui = new dat.GUI()

const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed : 0.01,
    angle: 0.2,
    penumbra:0,
    intensity: 1
}
gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e)
})
gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e
})
// gui.add(options, 'speed').min(0).max(0.5).step(0.01).onChange(function(e){
//     speed = e;
// }) //? Or
gui.add(options,'speed', 0, 0.1)
gui.add(options,'angle', 0, 1)
gui.add(options,'penumbra', 0, 1)
gui.add(options,'intensity', 1, 10000)

let step =0;

const mousePosition= new THREE.Vector2()


function animate (time){
box.rotation.x = time/1000;
box.rotation.y = time/1000;

step += options.speed;
// sphere.position.x = 10*Math.cos(step); //?For horizontal movement
sphere.position.y = 10 * Math.abs(Math.sin(step))

spotlight.angle = options.angle;
spotlight.penumbra = options.penumbra;
spotlight.intensity = options.intensity;
sLightHelper.update()

renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
