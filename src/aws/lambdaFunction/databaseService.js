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
exports.DatabaseService = void 0;
require("reflect-metadata");
var client_1 = require("@prisma/client");
var tsyringe_1 = require("tsyringe");
var prisma = new client_1.PrismaClient();
// const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'],});
var DatabaseService = exports.DatabaseService = /** @class */ (function () {
    function DatabaseService() {
        this.client = prisma;
    }
    DatabaseService_1 = DatabaseService;
    DatabaseService.getInstance = function () {
        if (!DatabaseService_1.instance) {
            DatabaseService_1.instance = new DatabaseService_1();
        }
        return DatabaseService_1.instance;
    };
    DatabaseService.prototype.getClient = function () {
        return this.client;
    };
    var DatabaseService_1;
    DatabaseService.instance = null;
    DatabaseService = DatabaseService_1 = __decorate([
        (0, tsyringe_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], DatabaseService);
    return DatabaseService;
}());
// const dbService = DatabaseService.getInstance();
// const prismaClient = dbService.getClient();
