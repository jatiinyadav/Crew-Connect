import { Component } from '@angular/core';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  constructor() { }

  ngOnInit() {
    // Create a scene
    const scene = new THREE.Scene()

    // Point Material
    const material = new THREE.PointsMaterial({
      size: 0.03,
      transparent: true,
      opacity: 0.5,
    })

    // Create points geometry
    const pointsGeometry = new THREE.BufferGeometry();

    // Generate random points inside the sphere
    const positions = [];

    for (let i = 0; i < 500; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(2 * Math.random() - 1);
      const radius = 3; // Points are on the outer surface
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);
      positions.push(x, y, z);
    }

    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // Create points mesh
    const points = new THREE.Points(pointsGeometry, material);
    scene.add(points);

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight)
    camera.position.z = 3
    scene.add(camera)

    // Renderer
    const canvas = document.querySelector(".webgl")!
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(2)
    renderer.render(scene, camera)

    // Orbital Control
    const control = new OrbitControls(camera, canvas as HTMLElement)
    control.enableDamping = true;
    control.enablePan = false;
    control.autoRotate = true;
    control.enableZoom = false;
    control.autoRotateSpeed = 1;

    control.minPolarAngle = Math.PI / 2;
    control.maxPolarAngle = Math.PI / 2;

    const loop = () => {
      control.update();

      window.requestAnimationFrame(loop);
      renderer.render(scene, camera)
    }

    loop()
  }

  login_page() {}
}
