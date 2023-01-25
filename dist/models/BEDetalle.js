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
exports.BEDetalle = void 0;
const typeorm_1 = require("typeorm");
const BEProducto_1 = require("./BEProducto");
const BETalle_1 = require("./BETalle");
let BEDetalle = class BEDetalle extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BEDetalle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => BEProducto_1.BEProducto, (producto) => producto.detalles),
    __metadata("design:type", BEProducto_1.BEProducto)
], BEDetalle.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => BETalle_1.BETalle, { cascade: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", BETalle_1.BETalle)
], BEDetalle.prototype, "talle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BEDetalle.prototype, "stock", void 0);
BEDetalle = __decorate([
    (0, typeorm_1.Entity)({ name: 'detalle' })
], BEDetalle);
exports.BEDetalle = BEDetalle;
