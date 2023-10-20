import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  joinGroupForm !: FormGroup;
  formBuilder = inject(FormBuilder)
  router = inject (Router)
  chartService = inject(ChatService)

  ngOnInit() {
    this.joinGroupForm = this.formBuilder.group({
      username: ['@wuh-group.com', Validators.required],
      roomname: ['', Validators.required]
    })
  }

  joinRoom(){
    const {username, roomname} = this.joinGroupForm.value
    this.chartService.logged_in_username = username;
    this.chartService.joinRoom(username, roomname)
    .then(() =>{
      this.router.navigate(['/chat-room'])
    })
    .catch((err) =>{
      console.log(err);
    })
  }
}
