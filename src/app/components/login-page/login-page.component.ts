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
  chartService = inject(ChatService)

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
    const {username, roomname} = this.joinGroupForm.value
    this.chartService.logged_in_username = username;
    this.chartService.findGroupinDB(roomname).then((created: boolean) => {
      if (created) {
        this.chartService.joinRoom(username, roomname)
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
