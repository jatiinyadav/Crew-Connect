import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { JoinRoom } from '../models/joinRoom';
import { BehaviorSubject, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public all_messages: string[] = []
  public all_online_users: string[] = []

  public all_messages$ = new BehaviorSubject<string[]>([]);
  public all_online_users$ = new BehaviorSubject<string[]>([]);

  public connection: HubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:7264/chat')
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build()

  constructor(private datePipe: DatePipe) {

    this.startConnection()
    this.connection.on("ReceiveMessage", (username: string, message: string, time: string) => {
      message = `${username}: ${message} on ${this.datePipe.transform(time, 'MMM dd, yyyy')}`;
      this.all_messages = [...this.all_messages, message];
      this.all_messages$.next(this.all_messages);
    })
    this.connection.on("ConnectedUsers", (users: any) => {
      console.log(`${users}`);
      this.all_online_users = users
      this.all_online_users$.next(this.all_online_users);
    })

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

  // Leave the Room
  public async leaveRoom() {
    console.log("Connection out");
    
    return this.connection.stop()
  }
}
