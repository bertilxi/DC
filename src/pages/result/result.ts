import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Strings } from '../../providers/strings';

@Component({
  selector: 'page-result',
  templateUrl: 'result.html'
})
export class ResultPage {

  private distribution: any;
  public strings: Strings = new Strings();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
    this.distribution = navParams.get("distribution");
  }

}
