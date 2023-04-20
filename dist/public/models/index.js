
export class Producto {
	id = 0;
	titulo = ''
	precio = '';
	imagen = '';
	descripcion = '';
	categoria = new categoria();
	color = new color();
	stock = new stock()
	createtAt = "";
	updateAt = "";
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

export class stock {
	id = 0;
	S = 0;
	M = 0;
	L = 0;
	XL = 0;
};
