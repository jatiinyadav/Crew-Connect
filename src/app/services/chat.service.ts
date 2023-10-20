import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { JoinRoom } from '../models/joinRoom';
import { BehaviorSubject, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  popupMessage = inject(NgToastService);
  public logged_in_username: string = ""

  public all_messages: any[] = []
  public all_online_users: string[] = []

  public all_messages$ = new BehaviorSubject<string[]>([]);
  public all_online_users$ = new BehaviorSubject<string[]>([]);

  public connection: HubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:7264/chat')
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build()

  constructor() {

    this.startConnection()

    this.connection.on("AllMessages", (username: string, message: string, time: string) => {
      let newMessage = {userName: `${this.formatUserName(username)}`, message: message, sendOn: Date.now()}
      this.all_messages.push(newMessage);
      this.all_messages$.next(this.all_messages);
    })

    this.connection.on("JoinedGroup", (bot_name: string, username: string, time: string) => {
      this.messages();
      this.popupMessage.success({ detail: `${this.formatUserName(username)} has joined the group`, summary: `${username}`, duration: 5000, position: 'topRight' });
    })

    this.connection.on("LeaveGroup", (bot_name: string, username: string, time: string) => {
      this.popupMessage.error({ detail: `${this.formatUserName(username)} has left the group`, summary: `${username}`, duration: 5000, position: 'topRight' });
    })

    this.connection.on("ConnectedUsers", (users: any) => {
      let online_users : any[] = []
      users.forEach((user: any) =>{
        user = this.formatUserName(user);
        online_users.push(user)
      })
      this.all_online_users = online_users
      this.all_online_users$.next(online_users);
    })
  }

  formatUserName(email: string): string{
    return email.split('@')[0].split('.').map((name: any) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ')
  }

  // Connection With Signal R
  public async startConnection() {
    try {
      await this.connection.start()
    } catch (error) {
      console.log(error);
    }
  }

  // Join Room 
  public async joinRoom(User: string, Room: string) {
    return this.connection.invoke("JoinGroup", { User, Room })
  }

  // Send Messages 
  public async sendMessage(message: string) {
    return this.connection.invoke("SendMessage", message)
  }

  // Receive Messages
  public async messages() {
    this.connection.invoke("SendAllMessages").then((result: any) => {
      let all_messages : any[] = []
      result.forEach((user: any) =>{
        user.userName = this.formatUserName(user.userName);
        all_messages.push(user)
      })
      this.all_messages = all_messages;
      this.all_messages$.next(this.all_messages);

      console.log("Received messages:",  );
    }).catch(error => {
      console.error("Error while invoking hub method:", error);
    });
  }

  // Leave the Room
  public async leaveRoom() {
    console.log("Connection out");
    return this.connection.stop()
  }
}
