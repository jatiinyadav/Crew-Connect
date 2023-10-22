import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {

  createGroupForm!: FormGroup;
  formBuilder = inject(FormBuilder)
  router = inject(Router);
  chartService = inject(ChatService)

  ngOnInit() {
    this.createGroupForm = this.formBuilder.group({
      adminName: ['@wuh-group.com', Validators.required],
      imageURL: ['https://secure.gravatar.com/avatar/717177c5bab590398c9bcd8a04acf48c?s=192&d=identicon', Validators.required],
      groupName: ['', Validators.required]
    })
  }

  @ViewChild('adminNameInput') adminNameInput!: ElementRef;

  ngAfterViewInit() {
    // this.adminNameInput.nativeElement.focus();
  }

  async createRoom() {
    let { adminName, groupName, imageURL } = this.createGroupForm.value;
    this.chartService.findGroupinDB(adminName, groupName, imageURL, true).then((created: boolean) => {
      if (!created) {
        this.chartService.joinRoom(adminName, groupName, imageURL)
          .then(() => {
            this.router.navigate(['/chat-room'])
          })
          .catch((err) => {
            console.log(err);
          })
      }
    })
  }

}
