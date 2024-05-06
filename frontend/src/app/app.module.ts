import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { GlobeComponent } from './components/globe/globe.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { NgToastModule } from 'ng-angular-popup';
import { DatePipe } from '@angular/common';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { HeaderComponent } from './components/_baseComponents/header/header.component';
import { FooterComponent } from './components/_baseComponents/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    GlobeComponent,
    LoginPageComponent,
    ChatRoomComponent,
    CreateRoomComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
