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
      adminName: ['', Validators.required],
      groupName: ['', Validators.required]
    })
  }

  @ViewChild('adminNameInput') adminNameInput!: ElementRef;

  ngAfterViewInit() {
    this.adminNameInput.nativeElement.focus();
  }

  async createRoom() {
    const { adminName, groupName } = this.createGroupForm.value;
    this.chartService.findGroupinDB(groupName).then((created: boolean) => {
      if (!created) {
        this.chartService.joinRoom(adminName, groupName)
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
