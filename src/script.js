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
import simple2FragmentShader from './shaders/simple2/fragment.glsl'
import simple2VertexShader from './shaders/simple2/vertex.glsl'
import simple3FragmentShader from './shaders/simple3/fragment.glsl'
import simple3VertexShader from './shaders/simple3/vertex.glsl'
import simple4FragmentShader from './shaders/simple4/fragment.glsl'
import simple4VertexShader from './shaders/simple4/vertex.glsl'

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
    u_time: { value: 0.0 },
    u_rows: { value: 10.0 },
    u_spacing: { value: 0.8 }
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
controls.autoRotate = false

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

    const guiData = {
        // Default material
        material: 'simple4Material',
    }
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
        uniforms,
        // transparent: true,
        // side:THREE.DoubleSide
    })
    const simple2Material = new THREE.ShaderMaterial({
        vertexShader: simple2VertexShader,
        fragmentShader: simple2FragmentShader,
        uniforms
    })
    const simple3Material = new THREE.ShaderMaterial({
        vertexShader: simple3VertexShader,
        fragmentShader: simple3FragmentShader,
        uniforms
    })
    const simple4Material = new THREE.ShaderMaterial({
        vertexShader: simple4VertexShader,
        fragmentShader: simple4FragmentShader,
        uniforms
    })

    const box = new THREE.BoxGeometry(8, 8, 8)
    const cube = new THREE.Mesh(box, eval(guiData.material))
    scene.add(cube)

    // Apply THREE material on top of ShaderMaterial
    const overlayBox = new THREE.BoxGeometry(8.01, 8.01, 8.01)
    const overlayMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity:0.1,
        color: '#00ff00'
    })
    const overlayCube = new THREE.Mesh(overlayBox, overlayMaterial)
    scene.add(overlayCube)
    
    // Debug UI
    const gui = new dat.GUI()
    gui.add(guiData, 'material', {
        Matrix3D: 'matrix3DMaterial',
        Matrix2D: 'matrixMaterial',
        Simpe_Dots: 'simpleMaterial',
        Moving_Pattern: 'simple2Material',
        Color_Grid: 'simple3Material',
        Noise: 'simple4Material'
    }).onChange((e) => {
        cube.material = eval(e)
    }).name("ShaderMaterial")

    gui.add(uniforms.u_rows, 'value', 1, 100, 1).name('Rows')
    gui.add(uniforms.u_spacing, 'value', 0, 1, 0.01).name('Spacing') 

    gui.add(overlayMaterial, 'opacity', 0, 1, 0.01).name('Overlay')

    gui.add(controls, 'autoRotate').name('Auto Rotate')

    // Start the loop
    tick()

}
main().catch(error => {
    console.error(error)
})
