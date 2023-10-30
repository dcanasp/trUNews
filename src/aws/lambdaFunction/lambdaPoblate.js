"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
require("reflect-metadata");
var tsyringe_1 = require("tsyringe");
var faker_1 = require("@faker-js/faker");
var databaseService_1 = require("./databaseService");
var argon2_1 = require("argon2");
var sanitizeHtml_1 = require("./sanitizeHtml");
var database = tsyringe_1.container.resolve(databaseService_1.DatabaseService).getClient();
var numberOfEntries = 20;
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var hashPassword_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, argon2_1.hash)(password)];
                case 1:
                    hashPassword_1 = _a.sent();
                    return [2 /*return*/, hashPassword_1];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, ''];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.hashPassword = hashPassword;
exports.main = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crearUsuarios(database)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, crearArticulos(database)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, crearFollowers(database)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, crearSaved(database)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, crearArticleHasCategories(database)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, crearCommunityHasArticle(database)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, crearCommunityHasUsers(database)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
function crearUsuarios(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var i, firstName, lastName, username, hash_1, rol, profession, description, profile_image;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < numberOfEntries)) return [3 /*break*/, 5];
                    firstName = faker_1.faker.person.firstName();
                    lastName = faker_1.faker.person.lastName();
                    username = faker_1.faker.internet.displayName({ firstName: firstName, lastName: lastName });
                    return [4 /*yield*/, hashPassword("password")];
                case 2:
                    hash_1 = _a.sent();
                    rol = Math.floor(Math.random() * 2) + 1;
                    profession = Math.random() < 0.5 ? faker_1.faker.person.jobTitle() : null;
                    description = Math.random() < 0.5 ? faker_1.faker.lorem.sentence() : null;
                    profile_image = 'https://trunews.s3.us-east-2.amazonaws.com/profile/defaultProfile.jpg';
                    return [4 /*yield*/, databaseService.users.create({
                            data: {
                                name: firstName,
                                lastname: lastName,
                                username: username,
                                hash: hash_1,
                                rol: rol,
                                profession: profession,
                                description: description,
                                profile_image: profile_image
                            }
                        }).catch(function (err) {
                            console.error("Error creating user: ", err);
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function crearArticulos(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var numberOfEntriesArticle, allUserIds, i, randomIndex, id_writer, title, date, views, text, image_url, sanitizedText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    numberOfEntriesArticle = numberOfEntries * 3;
                    return [4 /*yield*/, databaseService.users.findMany({
                            where: {
                                rol: 1
                            },
                            select: {
                                id_user: true
                            }
                        })];
                case 1:
                    allUserIds = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < numberOfEntriesArticle)) return [3 /*break*/, 5];
                    randomIndex = Math.floor(Math.random() * allUserIds.length);
                    id_writer = allUserIds[randomIndex].id_user;
                    title = faker_1.faker.lorem.sentence();
                    date = faker_1.faker.date.recent({ days: 15 });
                    views = Math.floor(Math.random() * 1000);
                    text = "<div><h1>".concat(faker_1.faker.lorem.words(), "</h1><p>").concat(faker_1.faker.lorem.paragraph(), "</p><p>").concat(faker_1.faker.lorem.paragraph(), "</p><p>").concat(faker_1.faker.lorem.paragraph(), "</p><p>").concat(faker_1.faker.lorem.paragraph(), "</p><p>").concat(faker_1.faker.lorem.paragraph(), "</p><p>").concat(faker_1.faker.lorem.paragraph(), "</p><p>").concat(faker_1.faker.lorem.paragraph(), "</p><ul><li>").concat(faker_1.faker.lorem.word(), "</li><li>").concat(faker_1.faker.lorem.word(), "</li></ul><p>").concat(faker_1.faker.lorem.paragraph(), "</p></div>");
                    image_url = faker_1.faker.image.url({ height: 1800, width: 1920 });
                    sanitizedText = (0, sanitizeHtml_1.sanitizeHtml)(text);
                    return [4 /*yield*/, databaseService.article.create({
                            data: {
                                id_writer: id_writer,
                                title: title,
                                date: date,
                                views: views,
                                text: text,
                                sanitizedText: sanitizedText,
                                image_url: image_url
                            }
                        }).catch(function (err) {
                            console.error("Error creating article: ", err);
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function crearFollowers(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var localNumberOfEntries, allUserIds, i, id_follower, id_following;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localNumberOfEntries = numberOfEntries * 2;
                    return [4 /*yield*/, databaseService.users.findMany({
                            select: {
                                id_user: true
                            }
                        })];
                case 1:
                    allUserIds = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < localNumberOfEntries)) return [3 /*break*/, 5];
                    id_follower = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
                    id_following = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
                    while (id_follower === id_following) {
                        id_following = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
                    }
                    return [4 /*yield*/, databaseService.follower.create({
                            data: {
                                id_follower: id_follower,
                                id_following: id_following
                            }
                        }).catch(function (err) {
                            console.error("Error creating follower: ", err); // va a fallar cuando por suerte vuelvan a salir 2 veces los mismos numeros
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function crearSaved(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var allUserIds, allArticleIds, i, id_user, id_article, date;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, databaseService.users.findMany({
                        select: {
                            id_user: true
                        }
                    })];
                case 1:
                    allUserIds = _a.sent();
                    return [4 /*yield*/, databaseService.article.findMany({
                            select: {
                                id_article: true
                            }
                        })];
                case 2:
                    allArticleIds = _a.sent();
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < numberOfEntries)) return [3 /*break*/, 6];
                    id_user = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
                    id_article = allArticleIds[Math.floor(Math.random() * allArticleIds.length)].id_article;
                    date = faker_1.faker.date.recent({ days: 10 });
                    return [4 /*yield*/, databaseService.saved.create({
                            data: {
                                id_user: id_user,
                                id_article: id_article,
                                date: date
                            }
                        }).catch(function (err) {
                            console.error("Error creating saved: ", err);
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function crearCategories(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var categories, _i, categories_1, cat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    categories = ['U.S. NEWS', 'COMEDY', 'PARENTING', 'WORLD NEWS', 'ARTS & CULTURE', 'TECH', 'SPORTS', 'ENTERTAINMENT', 'POLITICS', 'WEIRD NEWS', 'ENVIRONMENT', 'EDUCATION', 'CRIME', 'SCIENCE', 'WELLNESS', 'BUSINESS', 'STYLE & BEAUTY', 'FOOD & DRINK', 'MEDIA', 'QUEER VOICES', 'HOME & LIVING', 'WOMEN', 'BLACK VOICES', 'TRAVEL', 'MONEY', 'RELIGION', 'LATINO VOICES', 'IMPACT', 'WEDDINGS & DIVORCES', 'GOOD NEWS', 'FIFTY'];
                    _i = 0, categories_1 = categories;
                    _a.label = 1;
                case 1:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 4];
                    cat = categories_1[_i];
                    return [4 /*yield*/, databaseService.categories.create({
                            data: {
                                cat_name: cat
                            }
                        }).catch(function (err) {
                            console.error("Error creating saved: ", err);
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
function crearArticleHasCategories(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var allCategoriesId, allArticleIds, _i, allArticleIds_1, article, cantidadCategorias, usedCategories, i, id_category;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, databaseService.categories.findMany({
                        select: {
                            id_category: true
                        }
                    })];
                case 1:
                    allCategoriesId = _a.sent();
                    return [4 /*yield*/, databaseService.article.findMany({
                            orderBy: {
                                id_article: 'desc', // Order by id_article in descending order to get latest articles
                            },
                            take: numberOfEntries,
                            select: {
                                id_article: true
                            },
                        })];
                case 2:
                    allArticleIds = _a.sent();
                    _i = 0, allArticleIds_1 = allArticleIds;
                    _a.label = 3;
                case 3:
                    if (!(_i < allArticleIds_1.length)) return [3 /*break*/, 9];
                    article = allArticleIds_1[_i];
                    cantidadCategorias = Math.ceil(Math.random() * 4);
                    usedCategories = [];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < cantidadCategorias)) return [3 /*break*/, 7];
                    id_category = allCategoriesId[Math.floor(Math.random() * allCategoriesId.length)].id_category;
                    while (usedCategories.includes(id_category)) {
                        id_category = allCategoriesId[Math.floor(Math.random() * allCategoriesId.length)].id_category;
                    }
                    usedCategories.push(id_category);
                    return [4 /*yield*/, databaseService.article_has_categories.create({
                            data: {
                                articles_id_article: article.id_article,
                                categories_id_categories: id_category
                            }
                        }).catch(function (err) {
                            console.error("Error creating saved: ", err); // falla cuando por suerte un articulo queda con 2 veces la misma categoria de la que ya esta en la db
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    ;
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 3];
                case 9:
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
function crearComunidades(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var numberOfEntries, allUserIds, names, i, nombre, creator, descripcion, date, avatar, banner, comunidadCreada, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    numberOfEntries = 20;
                    return [4 /*yield*/, databaseService.users.findMany({
                            select: {
                                id_user: true
                            }
                        })];
                case 1:
                    allUserIds = _a.sent();
                    names = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < numberOfEntries)) return [3 /*break*/, 8];
                    nombre = "".concat(faker_1.faker.commerce.department(), "-").concat(faker_1.faker.commerce.productAdjective(), "-").concat(Math.random().toString(36).substring(2, 8));
                    creator = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
                    descripcion = Math.random() < 0.5 ? faker_1.faker.commerce.productDescription() : null;
                    date = faker_1.faker.date.recent({ days: 10 });
                    avatar = faker_1.faker.image.avatar();
                    banner = faker_1.faker.image.url({ height: 500, width: 1500 });
                    while (names.includes(nombre)) {
                        nombre = "".concat(faker_1.faker.commerce.department(), "-").concat(faker_1.faker.commerce.productAdjective(), "-").concat(Math.random().toString(36).substring(2, 8));
                    }
                    names.push(nombre);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, databaseService.community.create({
                            data: {
                                name: nombre,
                                description: descripcion,
                                creator_id: creator,
                                date: date,
                                avatar_url: avatar,
                                banner_url: banner,
                            }
                        })];
                case 4:
                    comunidadCreada = _a.sent();
                    return [4 /*yield*/, databaseService.community_has_users.create({
                            data: {
                                users_id_community: creator,
                                community_id_community: comunidadCreada.id_community
                            }
                        })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.error("Error creating saved: ", err_1);
                    return [3 /*break*/, 7];
                case 7:
                    i++;
                    return [3 /*break*/, 2];
                case 8:
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
function crearCommunityHasArticle(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var localNumberOfEntries, allCommunitysId, allArticleIds, allUserIds, i, id_article, id_community, id_user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localNumberOfEntries = Math.ceil(numberOfEntries / 3);
                    return [4 /*yield*/, databaseService.community.findMany({
                            select: {
                                id_community: true
                            }
                        })];
                case 1:
                    allCommunitysId = _a.sent();
                    return [4 /*yield*/, databaseService.article.findMany({
                            select: {
                                id_article: true
                            }
                        })];
                case 2:
                    allArticleIds = _a.sent();
                    return [4 /*yield*/, databaseService.users.findMany({
                            select: {
                                id_user: true
                            }
                        })];
                case 3:
                    allUserIds = _a.sent();
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < localNumberOfEntries)) return [3 /*break*/, 7];
                    id_article = allArticleIds[Math.floor(Math.random() * allArticleIds.length)].id_article;
                    id_community = allCommunitysId[Math.floor(Math.random() * allCommunitysId.length)].id_community;
                    id_user = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
                    return [4 /*yield*/, databaseService.community_has_articles.create({
                            data: {
                                article_id_community: id_article,
                                community_id_community: id_community,
                                users_id_community: id_user
                            }
                        }).catch(function (err) {
                            console.error("Error creating saved: ", err); // falla cuando por suerte un articulo queda con 2 veces la misma categoria
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
;
function crearCommunityHasCategorys(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var localNumberOfEntries, allCommunitysId, allCategoriesId, i, id_category, id_community;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localNumberOfEntries = Math.ceil(numberOfEntries / 3);
                    return [4 /*yield*/, databaseService.community.findMany({
                            select: {
                                id_community: true
                            }
                        })];
                case 1:
                    allCommunitysId = _a.sent();
                    return [4 /*yield*/, databaseService.categories.findMany({
                            select: {
                                id_category: true
                            }
                        })];
                case 2:
                    allCategoriesId = _a.sent();
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < localNumberOfEntries)) return [3 /*break*/, 6];
                    id_category = allCategoriesId[Math.floor(Math.random() * allCategoriesId.length)].id_category;
                    id_community = allCommunitysId[Math.floor(Math.random() * allCommunitysId.length)].id_community;
                    return [4 /*yield*/, databaseService.community_has_categories.create({
                            data: {
                                categories_id_community: id_category,
                                community_id_community: id_community
                            }
                        }).catch(function (err) {
                            console.error("Error creating saved: ", err); // falla cuando por suerte un articulo queda con 2 veces la misma categoria
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
;
function crearCommunityHasUsers(databaseService) {
    return __awaiter(this, void 0, void 0, function () {
        var allCommunitysId, allUserIds, i, id_user, id_community;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, databaseService.community.findMany({
                        select: {
                            id_community: true
                        }
                    })];
                case 1:
                    allCommunitysId = _a.sent();
                    return [4 /*yield*/, databaseService.users.findMany({
                            select: {
                                id_user: true
                            }
                        })];
                case 2:
                    allUserIds = _a.sent();
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < numberOfEntries)) return [3 /*break*/, 6];
                    id_user = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
                    id_community = allCommunitysId[Math.floor(Math.random() * allCommunitysId.length)].id_community;
                    return [4 /*yield*/, databaseService.community_has_users.create({
                            data: {
                                users_id_community: id_user,
                                community_id_community: id_community
                            }
                        }).catch(function (err) {
                            console.error("Error creating saved: ", err); // falla cuando por suerte un articulo queda con 2 veces la misma categoria
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
;
