import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  constructor() { }

  ngOnInit() { }

  login_page() {
    setTimeout(() => {
      window.location.reload();
    }, 100)
  }
}
