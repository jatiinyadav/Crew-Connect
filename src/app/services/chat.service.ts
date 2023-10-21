import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  popupMessage = inject(NgToastService);
  public logged_in_username: string = ""

  public all_messages: Group[] = []
  public all_online_users: string[] = []

  public all_messages$ = new BehaviorSubject<Group[]>([]);
  public all_online_users$ = new BehaviorSubject<string[]>([]);

  public connection: HubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:7264/chat')
    .withAutomaticReconnect()
    .build()

  constructor() {

    this.startConnection()

    this.connection.on("AllMessages", (username: string, message: string) => {
      let newMessage: Group = {
        userName: `${this.formatUserName(username)}`,
        message: message,
        sendOn: Date.now(),
        imageUrl: ''
      }
      this.all_messages.push(newMessage);
      this.all_messages$.next(this.all_messages);
    })

    this.connection.on("JoinedGroup", (bot_name: string, username: string) => {
      this.logged_in_username = `${this.formatUserName(username)}`;
      this.messages();
      this.popupMessage.success({ detail: `${this.formatUserName(username)} has joined the group`, summary: `${username}`, duration: 5000, position: 'topRight' });
    })

    this.connection.on("LeaveGroup", (bot_name: string, username: string) => {
      this.popupMessage.error({ detail: `${this.formatUserName(username)} has left the group`, summary: `${username}`, duration: 5000, position: 'topRight' });
    })

    this.connection.on("ConnectedUsers", (users: string[]) => {
      let online_users: string[] = []
      users.forEach((user: string) => {
        user = this.formatUserName(user);
        online_users.push(user)
      })
      this.all_online_users = online_users
      this.all_online_users$.next(online_users);
    })

    this.connection.on("Username", (username: string) => {
      this.logged_in_username = `${this.formatUserName(username)}`;
    })
  }

  formatUserName(email: string): string {
    return email && email.split('@')[0].split('.').map((name: string) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ')
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

  // Check If Group exits or not in DB
  public async findGroupinDB(groupName: string): Promise<boolean> {
    return this.connection.invoke("GetCollectionsNames", groupName).then((found: boolean) => {
      found && this.popupMessage.error({ detail: `${groupName} cannot be created.`, summary: `Please use another name.`, duration: 5000, position: 'topRight' })
      !found && this.popupMessage.success({ detail: `${groupName} created successfully`, summary: `xeT5 code copied to clipboard`, duration: 5000, position: 'topRight' })
      return found;
    })
  }

  // Receive Messages
  public async messages() {
    this.connection.invoke("SendAllMessages").then((result: Group[]) => {
      let all_messages: Group[] = []
      result.forEach((user: Group) => {
        user.userName = this.formatUserName(user.userName);
        all_messages.push(user)
      })
      this.all_messages = all_messages;
      this.all_messages$.next(this.all_messages);
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
