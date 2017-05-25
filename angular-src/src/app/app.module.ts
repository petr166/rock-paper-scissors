import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GameRootComponent } from './components/game-root/game-root.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { OngoingGamesComponent } from './components/ongoing-games/ongoing-games.component';
import { HomeComponent } from './components/home/home.component';

import { ValidateService } from './services/validate.service';
import { GameService } from './services/game.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { PreventLoginGuard } from './guards/preventLogin.guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  { path: 'login', component: LoginComponent, canActivate:[PreventLoginGuard]},
  { path: 'register', component: RegisterComponent, canActivate:[PreventLoginGuard]},
  { path: 'game', component: GameRootComponent, canActivate:[AuthGuard]},
  { path: ':other', redirectTo: ''}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    GameRootComponent,
    PlayerListComponent,
    OngoingGamesComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FlashMessagesModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    ValidateService,
    GameService,
    AuthService,
    AuthGuard,
    PreventLoginGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
