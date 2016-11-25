/// <reference path="../../../typings/globals/jquery/index.d.ts" />
import { Component } from '@angular/core';

declare var jQuery:any;

@Component({
  selector: 'hello-ionic-page',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {

  myDate: String = new Date().toISOString();

  constructor() { }

}
