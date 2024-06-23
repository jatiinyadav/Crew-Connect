import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { Group } from '../models/group';
import { UserMessage } from '../models/userMessage';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  popupMessage = inject(NgToastService);
  public logged_in_username = "";
  public groupName = "";
  public imageURL = "";
  public isGroupJoined = false;
  public hoveredImageUrl = "https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  public userImage = "";
  public all_messages: Group[] = []
  public all_online_users: string[] = []

  public all_messages$ = new BehaviorSubject<Group[]>([]);
  public all_online_users$ = new BehaviorSubject<string[]>([]);

  public connection: HubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:7264/chat')
    .build()

  constructor() {
    this.connections_and_methods()
  }

  async connections_and_methods() {
    await this.startConnection()
    this.methods_signalr()
  }

  methods_signalr() {
    this.connection.on("AllMessages", (username: string, message: string, imageURL: string) => {
      console.log("Called");
      let newMessage: Group = {
        userName: `${this.formatUserName(username)}`,
        message: message,
        sendOn: Date.now(),
        imageUrl: imageURL,
        reactions: [],
        id: 0,
        audioURL: null
      }
      console.log(newMessage);

      this.all_messages.push(newMessage);
      this.all_messages$.next(this.all_messages);
    })

    this.connection.on("JoinedGroup", (groupName: string, username: string, imageURL: string, reactions: any, id: number) => {
      this.logged_in_username = `${this.formatUserName(username)}`;
      localStorage.setItem("logged_user", JSON.stringify({ email: username, username: this.logged_in_username, groupName: groupName, image: imageURL }))
      this.groupName = groupName;
      this.imageURL = imageURL;

      const userMessage: UserMessage = {
        message: '',
        groupName: groupName,
        imageURL: ''
      }

      this.messages(userMessage);
      this.popupMessage.success({ detail: `${username}`, summary: `${this.formatUserName(username)} has joined the group.`, duration: 5000, position: 'topRight' });
    })

    this.connection.on("LeaveGroup", (groupName: string, username: string) => {
      this.popupMessage.error({ summary: `${this.formatUserName(username)} has left the chat.`, detail: `${username}`, duration: 5000, position: 'topRight' });
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

    this.connection.on("NewGroupCreated", (newGroup: Group) => {
      console.log(newGroup.message);
    })
  }

  formatUserName(email: string): string {
    return email && email.split('@')[0].split('.').map((name: string) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ')
  }

  // Connection With Signal R
  public async startConnection() {
    try {
      await this.connection.start();
      console.log("Connnection Build");
    } catch (error) {
      console.log(error);
    }
  }

  // Join Room 
  public async joinRoom(User: string, Room: string, userMessage: UserMessage) {
    this.isGroupJoined = true;
    return this.connection.invoke("JoinGroup", { User, Room }, userMessage)
  }

  // Send Messages 
  public async sendMessage(userMessage: UserMessage) {
    return this.connection.invoke("SendMessage", userMessage)
  }

  // Check If Group exits or not in DB
  public async findGroupinDB(adminName: string, userMessage: UserMessage, createGroup: boolean): Promise<boolean> {
    adminName = this.formatUserName(adminName);
    console.log(userMessage);

    return this.connection.invoke("GetCollectionsNames", adminName, userMessage, createGroup).then((found: boolean) => {
      found && this.popupMessage.error({ detail: `${userMessage.groupName} already exists.`, summary: `Please use another name.`, duration: 5000, position: 'topRight' })
      !found && this.popupMessage.success({ detail: `${userMessage.groupName} created successfully`, summary: `xeT5 code copied to clipboard`, duration: 5000, position: 'topRight' })
      return found;
    })
  }

  // Receive Messages
  public async messages(userMessage: UserMessage) {
    this.connection.invoke("SendAllMessages", userMessage).then((result: Group[]) => {
      let all_messages: Group[] = []
      result.forEach((user: Group) => {
        user.userName = this.formatUserName(user.userName);
        all_messages.push(user)
      })
      this.all_messages = all_messages;
      console.log(this.all_messages);

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
