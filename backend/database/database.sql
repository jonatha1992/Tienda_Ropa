CREATE TABLE Producto
(
    Id Serial,
    Nombre character varying(40)   ,
    Id_categoria integer  ,
    Descripcion character varying(200) ,
    Color character varying(40),
    Imagen character varying(200),
    CONSTRAINT producto_pkey PRIMARY KEY (id),
    foreign KEY (Id_categoria) references Categoria(Id)
)

CREATE TABLE Detalle
(
    Id_producto  integer ,
    Id_talle integer  ,
    stock int ,
    PRIMARY KEY(Id_producto , Id_talle)
    foreign KEY (Id_producto) references Producto(Id),
    foreign KEY  (Id_talle) references Talle(Id)

)
CREATE TABLE Categoria
(
    Id  Serial ,
    Categoria character varying(200)  ,
    CONSTRAINT Categoria_pkey PRIMARY KEY (id)
)

CREATE TABLE Talle
(
    Id  Serial ,
    talle character varying(3)  ,
    CONSTRAINT Talle_pkey PRIMARY KEY (id)
)


