import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() show_button = false;
  router = inject(Router)
  chatService = inject(ChatService)

  leaveChat() {
    this.chatService.leaveRoom()
    this.router.navigate(['/login'])
  }
}
