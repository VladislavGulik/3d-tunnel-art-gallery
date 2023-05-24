import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ParallaxTunnelComponent } from './parallax-tunnel/parallax-tunnel.component';

@NgModule({
  declarations: [
    AppComponent,
    ParallaxTunnelComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
