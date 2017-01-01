/// <reference path="../../../typings/globals/jquery/index.d.ts" />
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { Materia, Comision, Nivel, Carrera } from '../../providers/model';

@Component({
  selector: 'hello-ionic-page',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {

  private mDate: Date = new Date();
  private myDate: String = this.mDate.toISOString();
  private day = this.mDate.getDate();
  private month = (this.mDate.getMonth() + 1);
  private year = this.mDate.getFullYear();

  private carreras: Array<Carrera> = new Array<Carrera>();
  private niveles: Array<Nivel> = new Array<Nivel>();
  private materias: Array<Materia> = new Array<Materia>();
  private filteredMaterias: Array<Materia> = new Array<Materia>();
  private comisiones: Array<Comision> = new Array<Comision>();
  private selectCarrera: Carrera;
  private selectNivel: Nivel;
  private selectComision: Comision;
  private selectMateria: Materia = new Materia();
  private distribution: any;
  private showDistribution: boolean = false;

  tmp: any;

  // IONIC Storage

  private CARRERA_KEY: string = "carrera";
  private NIVEL_KEY: string = "nivel";
  private MATERIAS_KEY = "materias";

  constructor(private storage: Storage, private data: DataService) {
    this.initData();
    this.selectCarrera = this.carreras[0];
    this.selectNivel = this.niveles[0];
    this.loadSubjects();
  }

  ionViewWillEnter() {



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

    this.storage.get(this.MATERIAS_KEY).then(data => {
      if (data) {
        this.materias = JSON.parse(data);
      }
    });

  }

  initData() {

    // CARRERAS
    /*
    const carrera0 = new Carrera();
    carrera0.id = 0;
    carrera0.nombre = "Selecciona una carrera";
    this.carreras.push(carrera0);    
    */

    const carrera1 = new Carrera();
    carrera1.id = 1;
    carrera1.nombre = "Ing. Sistemas";
    this.carreras.push(carrera1);
    const carrera2 = new Carrera();
    carrera2.id = 2;
    carrera2.nombre = "Ing. Industrial";
    this.carreras.push(carrera2);
    const carrera3 = new Carrera();
    carrera3.id = 5;
    carrera3.nombre = "Ing. Eléctrica";
    this.carreras.push(carrera3);
    const carrera4 = new Carrera();
    carrera4.id = 6;
    carrera4.nombre = "Ing. Mecánica";
    this.carreras.push(carrera4);
    const carrera5 = new Carrera();
    carrera5.id = 7;
    carrera5.nombre = "Ing. Civil";
    this.carreras.push(carrera5);
    const carrera6 = new Carrera();
    carrera6.id = 8;
    carrera6.nombre = "TECNICATURA SUPERIOR EN MECATRÓNICA";
    this.carreras.push(carrera6);
    const carrera7 = new Carrera();
    carrera7.id = 9;
    carrera7.nombre = "Institucional";
    this.carreras.push(carrera7);
    const carrera8 = new Carrera();
    carrera8.id = 10;
    carrera8.nombre = "Extensión Universitaria";
    this.carreras.push(carrera8);

    //NIVELES
    /*
        const nivel0 = new Nivel();
        nivel0.id = 0;
        nivel0.nombre = "Seleccione un nivel";
        this.niveles.push(nivel0);
    */

    const nivel1 = new Nivel();
    nivel1.id = 1;
    nivel1.nombre = "Nivel 1";
    this.niveles.push(nivel1);
    const nivel2 = new Nivel();
    nivel2.id = 2;
    nivel2.nombre = "Nivel 2";
    this.niveles.push(nivel2);
    const nivel3 = new Nivel();
    nivel3.id = 3;
    nivel3.nombre = "Nivel 3";
    this.niveles.push(nivel3);
    const nivel4 = new Nivel();
    nivel4.id = 4;
    nivel4.nombre = "Nivel 4";
    this.niveles.push(nivel4);
    const nivel5 = new Nivel();
    nivel5.id = 5;
    nivel5.nombre = "Nivel 5";
    this.niveles.push(nivel5);
    const nivel6 = new Nivel();
    nivel6.id = 6;
    nivel6.nombre = "Nivel 6";
    this.niveles.push(nivel6);
    const nivel7 = new Nivel();
    nivel7.id = 7;
    nivel7.nombre = "No corresponde";
    this.niveles.push(nivel7);


  }

  onChangeCareer() {
    this.processSubjectsLoad();
  }

  onChangeLevel() {
    this.processSubjectsLoad();
  }

  onChangeSubject() {

    this.comisiones = new Array<Comision>();
    for (let i in this.selectMateria.comisiones) {
      this.comisiones.push(this.selectMateria.comisiones[i]);
    }
    console.log(this.comisiones);
  }

  loadSubjects() {

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

        this.materias = JSON.parse(xmlhttp.responseText);
        /*
                for (let index in this.materias) {
                  for (let indexCom in this.materias[index].comisiones) {
                    console.log(this.materias[index].comisiones[indexCom].id);
                    console.log(this.materias[index].comisiones[indexCom].nombre);
                  }
                }
        */
        console.log(this.materias);
        console.log("get materias complete");
        this.storage.set(this.MATERIAS_KEY, JSON.stringify(this.materias));
      }

    }
    xmlhttp.open("GET", "http://www.frsf.utn.edu.ar/getMaterias.php", true);
    xmlhttp.send();

  }

  processSubjectsLoad() {

    if (!this.materias) {
      return;
    }

    if (this.selectCarrera && this.selectNivel) {

      this.filteredMaterias = new Array<Materia>();
      for (let index in this.materias) {

        let materia: Materia = this.materias[index];

        if (this.selectNivel.id == materia.nivel &&
          this.selectCarrera.id == materia.id_carrera) {
          this.filteredMaterias.push(this.materias[index]);
        }

      }
    }

  }

  processComissions() {

  }

  newQuery() {

    // TODO hide and show correct buttons
    this.showDistribution = false;
  }

  searchDistribucion() {

    // TODO: use alert controller
    if (!this.selectCarrera) {
      alert('Debe seleccionar una carrera');
      return;
    }

    if (!this.selectNivel) {
      alert('Debe seleccionar  un nivel');
      return;
    }

    if (!this.mDate) {
      alert('Debe seleccionar  una fecha válida');
      return;
    }

    if (!this.selectMateria) {
      alert('Debe seleccionar  una fecha válida');
      this.selectMateria = new Materia();
      this.selectMateria.id = 0;
    }

    if (!this.selectComision) {
      this.selectComision = new Comision();
      this.selectComision.id = null;
    }

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //this.distribution = JSON.parse(xmlhttp.responseText);
        this.distribution = xmlhttp.responseText;
        console.log(this.distribution);
        this.showDistribution = true;
      }
    }

    let params =
      "fecha_inicio=" + this.year + '-' + this.month + '-' + this.day +
      "&carrera=" + this.selectCarrera.id +
      "&nivel=" + this.selectNivel.id +
      "&materia=" + this.selectMateria.id +
      "&comisiones=" + this.selectComision.id;

    console.log(params);

    xmlhttp.open("POST", "http://www.frsf.utn.edu.ar/getDistribucion.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

    this.storage.set(this.CARRERA_KEY, JSON.stringify(this.selectCarrera));
    this.storage.set(this.NIVEL_KEY, JSON.stringify(this.selectNivel));

  }


}
