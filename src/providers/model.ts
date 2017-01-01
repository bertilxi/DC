
export class Carrera {
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

export class Nivel {
  id: number;
  nombre: string;
}

export class Distribucion {

}