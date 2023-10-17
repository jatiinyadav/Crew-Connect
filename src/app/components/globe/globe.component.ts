import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})
export class GlobeComponent {
  ngOnInit(){
    
    // Debug
    const gui = new dat.GUI()
    
    // Canvas
    const canvas = document.querySelector('canvas.globeThree')!
    
    // Scene
    const scene = new THREE.Scene()
    
    // Objects
    const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

    // Materials
    
    const material = new THREE.PointsMaterial({
      size: 0.002,
    })
    
    // Mesh
    const sphere = new THREE.Points(geometry,material)
    scene.add(sphere)
    
    // Lights
    
    // const pointLight = new THREE.PointLight(0xffffff, 0.1)
    // pointLight.position.x = 2
    // pointLight.position.y = 3
    // pointLight.position.z = 4
    // scene.add(pointLight)
    
    /**
     * Sizes
     */
    const sizes = {
        width: 900,
        height: 900
    }
    
    window.addEventListener('resize', () =>
    {
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
    
    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 2
    scene.add(camera)
    
    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true
    
    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    

    /**
     * Animate
     */
    
    const clock = new THREE.Clock()
    
    const tick = () =>
    {
    
        const elapsedTime = clock.getElapsedTime()
    
        // Update objects
        sphere.rotation.y = 0.2 * elapsedTime
        // Update Orbital Controls
        // controls.update()
    
        // Render
        renderer.render(scene, camera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    
    tick()
  }


}
