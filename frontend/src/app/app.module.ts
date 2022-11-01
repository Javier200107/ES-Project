import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from '@angular/material/button';


import { MatCardModule } from "@angular/material/card";
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";
import { PostComponent } from './components/post/post.component';
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

