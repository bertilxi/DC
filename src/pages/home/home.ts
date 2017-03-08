
import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Materia, Comision, Nivel, Carrera } from '../../providers/model';
import { Storage } from '@ionic/storage';
import { Strings } from '../../providers/strings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private mDate: Date = new Date();
  private myDate: String = this.mDate.toISOString();
  private strings: Strings = new Strings();

  private carreras: Array<Carrera> = new Array<Carrera>();
  private niveles: Array<Nivel> = new Array<Nivel>();
  private materias: Array<Materia> = new Array<Materia>();
  private filteredMaterias: Array<Materia> = new Array<Materia>();
  private comisiones: Array<Comision> = new Array<Comision>();
  private selectCarrera: Carrera = new Carrera(0, "");
  private selectNivel: Nivel = new Nivel(0, "");
  private selectComision: Comision;
  private selectMateria: Materia = new Materia();
  private distribution: any;
  private showDistribution: boolean = false;
  private CARRERA_KEY: string = "carrera";
  private NIVEL_KEY: string = "nivel";

  constructor(
    private storage: Storage,
    private alertCtrl: AlertController
  ) {

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
    this.carreras.push(new Carrera(1, "Ingeniería en Sistemas"));
    this.carreras.push(new Carrera(2, "Ingeniería Industrial"));
    this.carreras.push(new Carrera(5, "Ingeniería Eléctrica"));
    this.carreras.push(new Carrera(6, "Ingeniería Mecánica"));
    this.carreras.push(new Carrera(7, "Ingeniería Civil"));
    this.carreras.push(new Carrera(8, "TECNICATURA SUPERIOR EN MECATRÓNICA"));
    this.carreras.push(new Carrera(9, "Institucional"));
    this.carreras.push(new Carrera(10, "Extensión Universitaria"));

    //NIVELES
    this.niveles.push(new Nivel(1, "Nivel 1"));
    this.niveles.push(new Nivel(2, "Nivel 2"));
    this.niveles.push(new Nivel(3, "Nivel 3"));
    this.niveles.push(new Nivel(4, "Nivel 4"));
    this.niveles.push(new Nivel(5, "Nivel 5"));
    this.niveles.push(new Nivel(6, "Nivel 6"));
    this.niveles.push(new Nivel(7, "No corresponde"));

  }

  onChangeCareer() {
    this.processSubjectsLoad();
  }

  onChangeLevel() {
    this.processSubjectsLoad();
  }

  onChangeSubject() {
    this.comisiones = [];
    if (!this.selectMateria) {
      return;
    }
    for (let i in this.selectMateria.comisiones) {
      this.comisiones.push(this.selectMateria.comisiones[i]);
    }
  }

  loadSubjects() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        let data: any = JSON.parse(xmlhttp.responseText);
        for (let i in data) {
          this.materias.push(data[i]);
        }
      }
    }
    xmlhttp.open("GET", "http://www.frsf.utn.edu.ar/getMaterias.php", true);
    xmlhttp.send();
  }

  processSubjectsLoad() {
    if (!this.materias || !this.selectCarrera || !this.selectNivel) {
      return;
    }
    this.selectMateria = undefined;
    this.selectComision = undefined;
    this.comisiones = [];
    this.filteredMaterias = [];
    for (let x of this.materias) {
      if (x.id_carrera == this.selectCarrera.id &&
        x.nivel == this.selectNivel.id) {
        this.filteredMaterias.push(x)
      }
    }
  }

  newQuery() {
    // TODO hide and show correct buttons
    this.showDistribution = false;
  }

  searchDistribucion() {

    if (!this.selectCarrera || !this.selectCarrera.id) {
      let alert = this.alertCtrl.create({
        title: 'Debe seleccionar una carrera',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    if (!this.selectNivel || !this.selectNivel.id) {
      let alert = this.alertCtrl.create({
        title: 'Debe seleccionar un nivel',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    if (!this.mDate) {
      let alert = this.alertCtrl.create({
        title: 'Debe seleccionar una fecha',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    if (!this.selectMateria) {
      this.selectMateria = new Materia();
      this.selectMateria.id = 0;
    }

    if (!this.selectComision) {
      this.selectComision = new Comision(-1, '');
      this.selectComision.id = null;
    }

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        this.distribution = xmlhttp.responseText;
        this.showDistribution = true;
      }
    }

    let params =
      "fecha_inicio=" + this.myDate.substring(0, 10) +
      "&carrera=" + this.selectCarrera.id +
      "&nivel=" + this.selectNivel.id +
      "&materia=" + this.selectMateria.id +
      "&comisiones=" + this.selectComision.id;

    xmlhttp.open("POST", "http://www.frsf.utn.edu.ar/getDistribucion.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

    this.storage.set(this.CARRERA_KEY, JSON.stringify(this.selectCarrera));
    this.storage.set(this.NIVEL_KEY, JSON.stringify(this.selectNivel));
  }

}
