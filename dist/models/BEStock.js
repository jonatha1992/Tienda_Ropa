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
exports.BEStock = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
let BEStock = class BEStock extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int" }),
    __metadata("design:type", Number)
], BEStock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => _1.BEProducto, (producto) => producto.stock, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: "productoId" }),
    __metadata("design:type", _1.BEProducto
    // @Column()
    // public XXS: number
    // @Column()
    // public XS: number
    )
], BEStock.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BEStock.prototype, "S", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BEStock.prototype, "M", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BEStock.prototype, "L", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BEStock.prototype, "XL", void 0);
BEStock = __decorate([
    (0, typeorm_1.Entity)({ name: 'stock' })
], BEStock);
exports.BEStock = BEStock;
