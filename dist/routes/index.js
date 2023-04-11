"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
exports.router = (0, express_1.Router)();
exports.router.get("/", (req, res) => {
    res.status(200).sendFile(path_1.default.resolve(__dirname, '../views/index.html'));
});
exports.router.get("/alta", function (req, res) {
    res.status(200).sendFile(path_1.default.join(__dirname, '../views/NewAltaProducto.html'));
});
exports.router.get("/login", function (req, res) {
    res.status(200).sendFile(path_1.default.join(__dirname, '../views/login.html'));
});
//# sourceMappingURL=index.js.map