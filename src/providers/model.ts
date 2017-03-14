export class Carrera {
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get nombre(): string {
    return this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  constructor(id: number, nombre: string) {
    this._id = id;
    this._nombre = nombre;
  }

  private _id: number;
  private _nombre: string;
}

export class Nivel {
  constructor(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }

  id: number;
  nombre: string;
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
}
