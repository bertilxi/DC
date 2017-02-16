
export class Carrera {
  id: number;
  nombre: string;

  constructor(mID: number, mNombre: string) {
    this.id = mID;
    this.nombre = mNombre;
  }

}

export class Materia {
  comisiones: Array<Comision>;
  id: number;
  id_carrera: number;
  nombre: string;
  nivel: number;

}

export class Comision {
  id: number;
  nombre: string;

  constructor(mID: number, mNombre: string) {
    this.id = mID;
    this.nombre = mNombre;
  }

}

export class Nivel {
  id: number;
  nombre: string;

  constructor(mID: number, mNombre: string) {
    this.id = mID;
    this.nombre = mNombre;
  }

}

export class Distribucion {

}