import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  joinGroupForm !: FormGroup;
  formBuilder = inject(FormBuilder)
  router = inject (Router)

  ngOnInit() {
    this.joinGroupForm = this.formBuilder.group({
      username: ['', Validators.required],
      roomname: ['', Validators.required]
    })
  }

  joinRoom(){
    this.router.navigate(['/chat-room'])
  }
}
