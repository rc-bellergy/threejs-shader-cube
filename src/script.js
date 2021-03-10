import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import matrixFragmentShader from './shaders/matrix/fragment.glsl'
import matrixVertexShader from './shaders/matrix/vertex.glsl'
import matrix3DFragmentShader from './shaders/matrix3d/fragment.glsl'
import matrix3DVertexShader from './shaders/matrix3d/vertex.glsl'
import simpleFragmentShader from './shaders/simple/fragment.glsl'
import simpleVertexShader from './shaders/simple/vertex.glsl'

import Stats from 'three/examples/jsm/libs/stats.module.js'

// Promise Loader
function promiseLoader (loader, url) {
    return new Promise((resolve, reject) => {
        loader.load(url, data => resolve(data), null, reject)
    })
}
// Handling resize
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Stats UI
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

/**
 * Base
 */

// Matrix Shader
const uniforms = {
    u_mouse: { value: { x: window.innerWidth / 2, y: window.innerHeight / 2 } },
    u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
    u_time: { value: 0.0 }
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Add Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.position.set(2.5,2.9,0.7)
scene.add(directionalLight)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 100)
camera.position.set(9, 13, -9)
scene.add(camera)

/**
 *  Orbit Control
 */
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
controls.autoRotate = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    stats.begin()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // update matrix time uniform
    uniforms.u_time.value = clock.getElapsedTime();

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    stats.end()
}

/**
 * Main Start
 */
async function main () {

    const matrix3DMaterial = new THREE.ShaderMaterial({
        vertexShader: matrix3DVertexShader,
        fragmentShader: matrix3DFragmentShader,
        uniforms
    })
    const matrixMaterial = new THREE.ShaderMaterial({
        vertexShader: matrixVertexShader,
        fragmentShader: matrixFragmentShader,
        uniforms
    })
    const simpleMaterial = new THREE.ShaderMaterial({
        vertexShader: simpleVertexShader,
        fragmentShader: simpleFragmentShader,
        uniforms
    })

    const box = new THREE.BoxGeometry(8, 8, 8)
    const cube = new THREE.Mesh(box, matrix3DMaterial)
    scene.add(cube)

    // Can I apply THREE material on top of ShaderMaterial?
    const overlayBox = new THREE.BoxGeometry(8.01, 8.01, 8.01)
    const overlayMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity:0.0,
        color: '#00ff00',
        skinning: false
    })
    const overlayCube = new THREE.Mesh(overlayBox, overlayMaterial)
    scene.add(overlayCube)
    
    // Start the loop
    tick()

    // Debug UI
    const gui = new dat.GUI()
    gui.add(overlayMaterial, 'opacity', 0, 1, 0.01).name('overlay')

    const proxy = {
        material: 'matrix3DMaterial'
    }
    gui.add(proxy, 'material', { 
        Matrix3D: 'matrix3DMaterial',
        Matrix2D: 'matrixMaterial', 
        Simple: 'simpleMaterial' 
    }).onChange((e) => {
        cube.material = eval(e)
    }).name("ShaderMaterial")


}
main().catch(error => {
    console.error(error)
})
