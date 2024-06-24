import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { AnaglyphEffect } from 'three/addons/effects/AnaglyphEffect.js';

let container, camera, scene, renderer, effect;
const spheres = [];
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let navbarHeight;

document.addEventListener('mousemove', onDocumentMouseMove);

function init() {
    navbarHeight = document.querySelector('.topnav').offsetHeight;

    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = `${navbarHeight}px`;
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight - navbarHeight), 0.01, 100);
    camera.position.z = 3;
    camera.focalLength = 3;

    const path = './Background';
    const format = '.jpg';
    const urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    const textureCube = new THREE.CubeTextureLoader().load(urls);

    scene = new THREE.Scene();
    scene.background = textureCube;

    const geometry = new THREE.SphereGeometry(0.1, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube });

    for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        scene.add(mesh);
        spheres.push(mesh);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const width = window.innerWidth || 2;
    const height = window.innerHeight - navbarHeight || 2;
    effect = new AnaglyphEffect(renderer);
    effect.setSize(width, height);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    navbarHeight = document.querySelector('.topnav').offsetHeight;
    windowHalfX = window.innerWidth / 2;
    windowHalfY = (window.innerHeight - navbarHeight) / 2;
    camera.aspect = window.innerWidth / (window.innerHeight - navbarHeight);
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight - navbarHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY - navbarHeight) / 100;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const timer = 0.0001 * Date.now();
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    for (let i = 0, il = spheres.length; i < il; i++) {
        const sphere = spheres[i];
        sphere.position.x = 5 * Math.cos(timer + i);
        sphere.position.y = 5 * Math.sin(timer + i * 1.1);
    }

    effect.render(scene, camera);
}

// Initialize and start the animation
init();
animate();
