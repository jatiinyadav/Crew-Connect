import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
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
  popupMessage = inject(NgToastService);
  chatService = inject(ChatService)

  @ViewChild('fullName') fullName!: ElementRef;

  // ngAfterViewInit() {
  //   this.fullName.nativeElement.focus();
  // }
  ngOnInit() {
    this.joinGroupForm = this.formBuilder.group({
      username: ['@wuh-group.com', Validators.required],
      roomname: ['', Validators.required],
      roomcode: ['', Validators.nullValidator]
    })
  }

  joinRoom(){
    const {username, roomname, imageURL} = this.joinGroupForm.value
    this.chatService.logged_in_username = username;
    this.chatService.findGroupinDB(username, roomname, imageURL, false).then((created: boolean) => {
      if (created) {
        this.chatService.joinRoom(username, roomname, imageURL)
          .then(() => {
            this.router.navigate(['/chat-room'])
          })
          .catch((err) => {
            console.log(err);
          })
      } else {
        this.popupMessage.error({ detail: `${roomname} doesn't exist`, summary: `Please enter valid name/code.`, duration: 5000, position: 'topRight' })
      }
    })
  }
}
