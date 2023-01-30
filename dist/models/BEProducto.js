"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BEProducto = void 0;
const index_1 = require("./index");
const typeorm_1 = require("typeorm");
let BEProducto = class BEProducto extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BEProducto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BEProducto.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => index_1.BECategoria, categoria => categoria.id, { cascade: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", index_1.BECategoria)
], BEProducto.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => index_1.BEDetalle, detalle => detalle.producto, { cascade: false })
    // @JoinColumn()
    ,
    __metadata("design:type", Array)
], BEProducto.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BEProducto.prototype, "descripcion", void 0);
BEProducto = __decorate([
    (0, typeorm_1.Entity)({ name: 'producto' })
], BEProducto);
exports.BEProducto = BEProducto;
