import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AlertController, LoadingController, NavController} from 'ionic-angular';
import {Carrera, Comision, Materia, Nivel} from '../../providers/model';
import {Strings} from '../../providers/strings';
import {ResultPage} from '../result/result';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private mDate: Date = new Date();
  private myDate: String = this.mDate.toISOString();
  public strings: Strings = new Strings();

  private carreras: Array<Carrera> = [];
  private niveles: Array<Nivel> = [];
  private materias: Array<Materia> = [];
  private filteredMaterias: Array<Materia> = [];
  private comisiones: Array<Comision> = [];
  private selectCarrera: Carrera = new Carrera(0, '');
  private selectNivel: Nivel = new Nivel(0, '');
  private selectComision: Comision;
  private selectMateria: Materia;
  private distribution: any;

  private CARRERA_KEY: string = 'carrera';
  private NIVEL_KEY: string = 'nivel';

  private subjectsURL: string = 'http://www.frsf.utn.edu.ar/getMaterias.php';
  private distributionURL: string = 'http://www.frsf.utn.edu.ar/getDistribucion.php';

  constructor(private storage: Storage,
              private alertCtrl: AlertController,
              private navController: NavController,
              private loadingController: LoadingController) {

    this.initData();
    this.loadSubjects();

    storage.ready().then(() => {
      this.storage.get(this.CARRERA_KEY).then(data => {
        if (data) {
          this.selectCarrera = JSON.parse(data);
        }
      });
      this.storage.get(this.NIVEL_KEY).then(data => {
        if (data) {
          this.selectNivel = JSON.parse(data);
        }
      });
    });

  }

  private initData(): void {

    // CARRERAS
    this.carreras.push(new Carrera(1, this.strings.CAREER_ISI));
    this.carreras.push(new Carrera(2, this.strings.CAREER_IIND));
    this.carreras.push(new Carrera(5, this.strings.CAREER_IELE));
    this.carreras.push(new Carrera(6, this.strings.CAREER_IMEC));
    this.carreras.push(new Carrera(7, this.strings.CAREER_ICIV));
    this.carreras.push(new Carrera(8, this.strings.CAREER_MEC));
    this.carreras.push(new Carrera(9, this.strings.CAREER_INST));
    this.carreras.push(new Carrera(10, this.strings.CAREER_EXT));

    //NIVELES
    this.niveles.push(new Nivel(1, this.strings.LEVEL_1));
    this.niveles.push(new Nivel(2, this.strings.LEVEL_2));
    this.niveles.push(new Nivel(3, this.strings.LEVEL_3));
    this.niveles.push(new Nivel(4, this.strings.LEVEL_4));
    this.niveles.push(new Nivel(5, this.strings.LEVEL_5));
    this.niveles.push(new Nivel(6, this.strings.LEVEL_6));
    this.niveles.push(new Nivel(7, this.strings.LEVEL_NA));

  }

  public onChangeSubject(): void {
    this.comisiones = [];
    if (!this.selectMateria) {
      return;
    }
    this.comisiones = this.selectMateria.comisiones;
  }

  public loadSubjects(): void {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        let data: any = JSON.parse(xmlhttp.responseText);
        for (let i in data) {
          this.materias.push(data[i]);
        }
        this.processSubjectsLoad();
      }
      if (xmlhttp.readyState === 4 && xmlhttp.status !== 200) {
        this.createAlert(this.strings.ERROR_CONN_TITLE, this.strings.OK_BUTTON, this.strings.ERROR_CONN_MESSAGE);
      }
    };
    xmlhttp.open('GET', this.subjectsURL, true);
    xmlhttp.send();
  }

  public processSubjectsLoad(): void {
    if (!this.materias || !this.selectCarrera || !this.selectNivel) {
      return;
    }
    this.selectMateria = undefined;
    this.selectComision = undefined;
    this.comisiones = [];

    this.filteredMaterias = this.materias
      .filter(materia => materia.id_carrera == this.selectCarrera.id)
      .filter(materia => materia.nivel == this.selectNivel.id);

  }

  private createAlert(title, button, message = ''): void {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: [button],
      message: message
    });
    alert.present();
  }

  private requestDistribution(): void {

    let loading = this.loadingController.create({
      content: this.strings.PLEASE_WAIT_LABEL
    });

    loading.present();

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        this.distribution = xmlhttp.responseText;
        this.gotoResultPage(this.distribution);
      }
      if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
        this.createAlert(this.strings.ERROR_CONN_TITLE, this.strings.OK_BUTTON, this.strings.ERROR_CONN_MESSAGE);
      }
      loading.dismiss();
    };

    let params =
      'fecha_inicio=' + this.myDate.substring(0, 10) +
      '&carrera=' + this.selectCarrera.id +
      '&nivel=' + this.selectNivel.id +
      '&materia=' + this.selectMateria.id +
      '&comisiones=' + this.selectComision.id;

    xmlhttp.open('POST', this.distributionURL, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(params);
  }

  public searchDistribution(): void {

    if (!this.selectCarrera || !this.selectCarrera.id) {
      this.createAlert(this.strings.MUST_CHOOSE_CAREER_LABEL, this.strings.OK_BUTTON);
      return;
    }

    if (!this.selectNivel || !this.selectNivel.id) {
      this.createAlert(this.strings.MUST_CHOOSE_LEVEL_LABEL, this.strings.OK_BUTTON);
      return;
    }

    if (!this.mDate) {
      this.createAlert(this.strings.MUST_CHOOSE_DATE_LABEL, this.strings.OK_BUTTON);
      return;
    }

    if (!this.selectMateria) {
      this.selectMateria = new Materia();
      this.selectMateria.id = 0;
    }

    if (!this.selectComision) {
      this.selectComision = new Comision();
      this.selectComision.id = null;
    }

    this.requestDistribution();

    this.storage.set(this.CARRERA_KEY, JSON.stringify(this.selectCarrera));
    this.storage.set(this.NIVEL_KEY, JSON.stringify(this.selectNivel));
  }

  private gotoResultPage(distribution: any): void {
    this.navController
      .push(ResultPage, {
        'distribution': distribution
      });
  }

}
