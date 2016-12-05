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
const core_1 = require("@angular/core");
const Observable_1 = require('rxjs/Observable');
const socket_service_1 = require('./socket.service');
const http_1 = require('../model/http');
let TrafficService = class TrafficService {
    constructor(socketService) {
        this.socketService = socketService;
        this._list = [];
        this._maxRows = Infinity;
        this._replacedOnly = false;
        this._cache = new Map();
        this.traffic = Observable_1.Observable.merge(socketService.getRequestsObservable(), socketService.getResponseObservable()).scan(this._process.bind(this), this._list);
    }
    set maxRows(maxRows) {
        this._maxRows = maxRows;
        // if (this._list.length > maxRows) {
        //     this._list.splice(maxRows - this._list.length);
        // }
    }
    set replacedOnly(replacedOnly) {
        this._replacedOnly = replacedOnly;
        // if (this._list.length > maxRows) {
        //     this._list.splice(maxRows - this._list.length);
        // }
        if (replacedOnly) {
            this._list.splice(0).forEach(item => {
                if (item._req.origUrl) {
                    this._list.push(item);
                }
            });
        }
    }
    clear() {
        this._list.splice(0);
    }
    _process(list, item) {
        if (item instanceof http_1.Req) {
            if (this._replacedOnly && !item.origUrl) {
                return list;
            }
            var rr = new http_1.ReqRes(item);
            list.push(rr);
            this._cache.set(item.id, rr);
        }
        else {
            var res = item;
            var rr = this._cache.get(res.id);
            rr && (rr.res = res);
        }
        if (list.length > this._maxRows) {
            list.shift();
        }
        return list;
    }
};
TrafficService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [socket_service_1.SocketService])
], TrafficService);
exports.TrafficService = TrafficService;