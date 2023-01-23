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
exports.detalle = void 0;
const talle_1 = require("./talle");
const typeorm_1 = require("typeorm");
const producto_1 = require("./producto");
let detalle = class detalle extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], detalle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_1.producto, (producto) => producto.detalles),
    __metadata("design:type", producto_1.producto)
], detalle.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => talle_1.talle),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", talle_1.talle)
], detalle.prototype, "talle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], detalle.prototype, "stock", void 0);
detalle = __decorate([
    (0, typeorm_1.Entity)()
], detalle);
exports.detalle = detalle;
