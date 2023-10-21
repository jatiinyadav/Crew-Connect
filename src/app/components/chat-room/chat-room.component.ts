import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from 'src/app/models/group';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent {

  sendMessageForm !: FormGroup;
  formBuilderMessage = inject(FormBuilder)
  router = inject(Router)
  chatService = inject(ChatService);
  logged_user: string = this.chatService.logged_in_username.split('@')[0].split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
  all_messages: Group[] = [];
  all_users: string[] = []

  ngOnInit() {
    this.sendMessageForm = this.formBuilderMessage.group({
      message_user: ['', Validators.required],
    })
    this.chatService.all_messages$.subscribe({
      next: (allMessages) => {
        this.all_messages = allMessages;
      }
    })

    this.chatService.all_online_users$.subscribe({
      next: (allUsers) => {
        this.all_users = allUsers;
      }
    })
  }

  sendMessage() {
    var contentDiv = document.getElementById("chatDiv");
    contentDiv!.scrollTop = contentDiv!.scrollHeight;
    const { message_user } = this.sendMessageForm.value;
    this.chatService.sendMessage(message_user);
  }

  leaveChat() {
    this.chatService.leaveRoom()
    this.router.navigate(['/login'])
  }
}
