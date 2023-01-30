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
const index_1 = require("./index");
let BEDetalle = class BEDetalle extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "integer" }),
    __metadata("design:type", Number)
], BEDetalle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => index_1.BEProducto, (producto) => producto.detalles, { nullable: false }),
    (0, typeorm_1.JoinColumn)({
        name: "productoId"
    }),
    __metadata("design:type", index_1.BEProducto)
], BEDetalle.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => index_1.BETalle, { cascade: false, nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "talleId" }),
    __metadata("design:type", index_1.BETalle)
], BEDetalle.prototype, "talle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => index_1.BEColor, { cascade: false, nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "colorId" }),
    __metadata("design:type", index_1.BEColor)
], BEDetalle.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BEDetalle.prototype, "stock", void 0);
BEDetalle = __decorate([
    (0, typeorm_1.Entity)({ name: 'detalle' })
    // @Index(["productoId", "talleId", "colorId"], { unique: true })
], BEDetalle);
exports.BEDetalle = BEDetalle;
