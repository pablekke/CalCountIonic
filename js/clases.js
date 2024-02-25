class Usuario {
  constructor() {
    this.id = null;
    this.caloriasDiarias = null;
    this.apiKey = null;
  }

  static parse(data) {
    let instancia = new Usuario();

    if (data.id) {
      instancia.id = data.id;
    }
    if (data.caloriasDiarias) {
      instancia.caloriasDiarias = data.caloriasDiarias;
    }
    if (data.apiKey) {
      instancia.apiKey = data.apiKey;
    }
    return instancia;
  }
}

class Alimento {
  constructor() {
    this.id = null;
    this.nombre = null;
    this.calorias = null;
    this.proteinas = null;
    this.grasas = null;
    this.carbohidratos = null;
    this.porcion = null;
    this.imagen = null;
  }

  static parse(data) {
    let instancia = new Alimento();

    if (data.id !== undefined) {
      instancia.id = data.id;
    }
    if (data.nombre !== undefined) {
      instancia.nombre = data.nombre;
    }
    if (data.calorias !== undefined) {
      instancia.calorias = parseFloat(data.calorias.toFixed(2));
    }
    if (data.proteinas !== undefined) {
      instancia.proteinas = data.proteinas.toFixed(2);;
    }
    if (data.grasas !== undefined) {
      instancia.grasas = data.grasas.toFixed(2);
    }
    if (data.carbohidratos !== undefined) {
      instancia.carbohidratos = data.carbohidratos.toFixed(2);;
    }
    if (data.porcion !== undefined) {
      instancia.porcion = data.porcion;
    }
    if (data.imagen !== undefined) {
      instancia.imagen = data.imagen;
    }

    return instancia;
  }
}

class Producto {
  constructor() {
    this.id = null;
    this.idAlimento = null;
    this.idUsuario = null;
    this.cantidad = null;
    this.fecha = null;
  }

  static parse(data) {
    let instancia = new Producto();

    if (data.id !== undefined) {
      instancia.id = data.id;
    }
    if (data.idAlimento !== undefined) {
      instancia.idAlimento = data.idAlimento;
    }
    if (data.idUsuario !== undefined) {
      instancia.idUsuario = data.idUsuario;
    }
    if (data.cantidad !== undefined) {
      instancia.cantidad = data.cantidad;
    }
    if (data.fecha !== undefined) {
      instancia.fecha = data.fecha;
    }

    return instancia;
  }
}





