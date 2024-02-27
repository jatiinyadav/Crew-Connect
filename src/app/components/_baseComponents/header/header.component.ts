import { Component, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

const images = [
  'https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1517160990988-82edf8b37188?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1614450770660-6ee6ef27e9e4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1529061333663-08226b29f6ba?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() show_button = false;
  router = inject(Router)
  chatService = inject(ChatService)
  imageUrls = images;
  showDropdown = false;
  hoveredImageUrl = '';
  previousImage = ""
  selectedImageIndex = -1; // Index of the selected image, initially set to -1 (no image selected)

  selectImage(index: number): void {
    this.selectedImageIndex = index; // Store the index of the clicked image
  }

  toggleDropdown(): void {
    this.previousImage = this.chatService.hoveredImageUrl
    this.showDropdown = !this.showDropdown;
  }

  discardImage(): void {
    this.chatService.hoveredImageUrl = this.previousImage
    this.showDropdown = !this.showDropdown;
  }

  setHoveredImageUrl(url: string): void {
    if (this.selectedImageIndex === -1) {
      this.chatService.hoveredImageUrl = url;
    }
  }

  leaveChat(back_to_home: boolean) {
    const result = window.confirm('Are you sure you want leave the chat?');
    if (result) {
      setTimeout(() => {
        window.location.reload();
      }, 100)
      this.chatService.leaveRoom()
      localStorage.clear()
      back_to_home ? this.router.navigate(['/']) : this.router.navigate(['/login'])
    }
  }

  @ViewChild('clickEvent') clickEvent!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isClickInsideDiv = this.clickEvent?.nativeElement?.contains(targetElement);

    if (!isClickInsideDiv) {
      this.showDropdown = false;
    }
  }
}
