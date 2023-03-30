
export class Producto {
	id = 0;
	titulo = ''
	precio = '';
	image = '';
	descripcion = '';
	categoria = {
		id: 0,
		nombre: "",
	};
	color = {
		id: 0.0,
		nombre: "",
	};
	stock = {
		id: 0,
		s: 0,
		m: 0,
		l: 0,
		xl: 0,
	};

}

export class categoria {
	id = 0;
	nombre = ''

	constructor(id, nombre) {
		this.id = id;
		this.nombre = nombre;
	}

}
export class color {
	id = 0;
	nombre = ''

	constructor(id, nombre) {
		this.id = id;
		this.nombre = nombre;
	}

}

// export default Producto;