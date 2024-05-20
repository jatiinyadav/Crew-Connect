import { Component, ElementRef, ViewChild, inject,OnInit, AfterViewInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group } from 'src/app/models/group';
import { UserMessage } from 'src/app/models/userMessage';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewInit {

  sendMessageForm !: FormGroup;
  formBuilderMessage = inject(FormBuilder)
  chatService = inject(ChatService);
  logged_user: string = this.chatService.logged_in_username.split('@')[0].split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
  all_messages: Group[] = [];
  all_users: string[] = []
  groupName = this.chatService.groupName;
  imageURL = this.chatService.imageURL;
  reactionsVisible: { [key: number]: boolean } = {};

  @ViewChild('scroll', { static: false }) scrollingDiv!: ElementRef;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    var element = document.getElementById("chatDiv");
    element!.scrollTop = element!.scrollHeight;
  }

  ngOnInit() {
    if(!this.chatService.isGroupJoined){
      const obj = JSON.parse(localStorage.getItem("logged_user")!)
      this.logged_user = obj.username;
      this.groupName = obj.groupName;
      this.imageURL = obj.imageURL;
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
        this.scrollToBottom();
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

  audioURL: string | null = null;

  async sendMessage() {
    const { message_user } = this.sendMessageForm.value;

    const userMessage : UserMessage = {
      message: message_user,
      groupName: this.groupName,
      imageURL: this.imageURL,
      audioURL: this.audioURL
    }

    await this.chatService.sendMessage(userMessage);
    this.sendMessageForm.reset()
    this.scrollToBottom();
  }

  toggleReactionMenu(messageId: number): void {
    this.reactionsVisible[messageId] = !this.reactionsVisible[messageId];
  }

  addReaction(messageId: number, reaction: string): void {
    const message = this.all_messages.find(m => m.id === messageId);
    if (message) {
      if (!message.reactions) {
        message.reactions = [];
      }
      message.reactions.push(reaction);
    }

    // this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }

  recordingActive: boolean = false;
  startRecording(): void {

    if (!this.recordingActive) {
      this.recordingActive = true;
      console.log('Recording started...');
      // Start recording logic here
    } else {
      this.recordingActive = false;
      console.log('Recording stopped.');
      // Stop recording logic here
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      console.log('Recording started...');

      mediaRecorder.addEventListener('dataavailable', (event: any) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        console.log('Recording stopped.');

        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        this.audioURL = URL.createObjectURL(blob); 
        // Do something with the recorded audio blob, like sending it to a server
      });

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // Stop recording after 5 seconds, adjust as needed
    })
    .catch(error => {
      console.error('Error accessing microphone:', error);
    });
    // Implement recording functionality here
  }
  
}
