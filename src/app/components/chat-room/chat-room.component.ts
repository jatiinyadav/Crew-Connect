import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  chatService = inject(ChatService);
  logged_user: string = this.chatService.logged_in_username.split('@')[0].split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
  all_messages: Group[] = [];
  all_users: string[] = []
  groupName = this.chatService.groupName;
  imageURL = this.chatService.imageURL;

  @ViewChild('scroll') public scroll!: ElementRef;

  ngAfterViewChecked() {
    console.log("Called");
    
    this.scroll.nativeElement.scrollTop = this.scroll?.nativeElement.scrollHeight;
  }

  ngOnInit() {
    if(!this.chatService.isGroupJoined){
      const obj = JSON.parse(localStorage.getItem("logged_user")!)
      this.logged_user = obj.username
      setTimeout(() => {
        this.chatService.joinRoom(obj.email, obj.groupName, obj.imageURL);
      }, 100)
    }
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

  formatName(name: string): string {
    return this.chatService.formatUserName(name)
  }

  async sendMessage() {
    const { message_user } = this.sendMessageForm.value;
    await this.chatService.sendMessage(message_user, this.groupName, this.imageURL);
    this.sendMessageForm.reset()
    // this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
}
