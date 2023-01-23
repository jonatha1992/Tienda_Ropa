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
exports.producto = void 0;
const BEDetalle_1 = require("./BEDetalle");
const BECategoria_1 = require("./BECategoria");
const typeorm_1 = require("typeorm");
let producto = class producto extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], producto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], producto.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => BECategoria_1.categoria),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", BECategoria_1.categoria)
], producto.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => BEDetalle_1.detalle, detalle => detalle.producto),
    __metadata("design:type", Array)
], producto.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], producto.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], producto.prototype, "color", void 0);
producto = __decorate([
    (0, typeorm_1.Entity)()
], producto);
exports.producto = producto;
