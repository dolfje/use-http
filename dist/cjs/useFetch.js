"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (_) try {
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var use_ssr_1 = __importDefault(require("use-ssr"));
var urs_1 = __importDefault(require("urs"));
var types_1 = require("./types");
var useFetchArgs_1 = __importDefault(require("./useFetchArgs"));
var doFetchArgs_1 = __importDefault(require("./doFetchArgs"));
var utils_1 = require("./utils");
var useCache_1 = __importDefault(require("./useCache"));
var CACHE_FIRST = types_1.CachePolicies.CACHE_FIRST;
function useFetch() {
    var _this = this;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var _a = useFetchArgs_1.default.apply(void 0, args), host = _a.host, path = _a.path, customOptions = _a.customOptions, requestInit = _a.requestInit, dependencies = _a.dependencies;
    var cacheLife = customOptions.cacheLife, cachePolicy = customOptions.cachePolicy, // 'cache-first' by default
    interceptors = customOptions.interceptors, onAbort = customOptions.onAbort, onError = customOptions.onError, onNewData = customOptions.onNewData, onTimeout = customOptions.onTimeout, perPage = customOptions.perPage, persist = customOptions.persist, responseType = customOptions.responseType, retries = customOptions.retries, retryDelay = customOptions.retryDelay, retryOn = customOptions.retryOn, suspense = customOptions.suspense, timeout = customOptions.timeout, defaults = __rest(customOptions, ["cacheLife", "cachePolicy", "interceptors", "onAbort", "onError", "onNewData", "onTimeout", "perPage", "persist", "responseType", "retries", "retryDelay", "retryOn", "suspense", "timeout"]);
    var cache = useCache_1.default({ persist: persist, cacheLife: cacheLife, cachePolicy: cachePolicy });
    var isServer = use_ssr_1.default().isServer;
    var controller = react_1.useRef();
    var res = react_1.useRef({});
    var data = react_1.useRef(defaults.data);
    var timedout = react_1.useRef(false);
    var attempt = react_1.useRef(0);
    var error = react_1.useRef();
    var hasMore = react_1.useRef(true);
    var suspenseStatus = react_1.useRef('pending');
    var suspender = react_1.useRef();
    var mounted = react_1.useRef(false);
    var _b = urs_1.default(defaults.loading), loading = _b[0], setLoading = _b[1];
    var forceUpdate = react_1.useReducer(function () { return ({}); }, [])[1];
    var makeFetch = utils_1.useDeepCallback(function (method) {
        var doFetch = function (routeOrBody, body, overrideRequestInit) { return __awaiter(_this, void 0, void 0, function () {
            var theController, _a, url, options, response, timer, newData, newRes, _b, opts, shouldRetry, _c, _d, theData, err_1, opts, shouldRetry, _e, _f, theData;
            var _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (isServer)
                            return [2 /*return*/]; // for now, we don't do anything on the server
                        controller.current = new AbortController();
                        controller.current.signal.onabort = onAbort;
                        theController = controller.current;
                        return [4 /*yield*/, doFetchArgs_1.default(__assign(__assign({}, requestInit), overrideRequestInit), method, theController, cacheLife, cache, host, path, routeOrBody, body, interceptors.request)];
                    case 1:
                        _a = _h.sent(), url = _a.url, options = _a.options, response = _a.response;
                        error.current = undefined;
                        // don't perform the request if there is no more data to fetch (pagination)
                        if (perPage > 0 && !hasMore.current && !error.current)
                            return [2 /*return*/, data.current];
                        if (!suspense)
                            setLoading(true);
                        timer = timeout && setTimeout(function () {
                            timedout.current = true;
                            theController.abort();
                            if (onTimeout)
                                onTimeout();
                        }, timeout);
                        _h.label = 2;
                    case 2:
                        _h.trys.push([2, 17, 23, 24]);
                        if (!(response.isCached && cachePolicy === CACHE_FIRST)) return [3 /*break*/, 3];
                        newRes = (_g = response.cached) === null || _g === void 0 ? void 0 : _g.clone();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, fetch(url, options)];
                    case 4:
                        newRes = (_h.sent()).clone();
                        _h.label = 5;
                    case 5:
                        if (theController == controller.current) {
                            res.current = newRes.clone();
                        }
                        return [4 /*yield*/, utils_1.tryGetData(newRes, defaults.data, responseType)];
                    case 6:
                        newData = _h.sent();
                        newRes.data = onNewData(data.current, newData);
                        if (!interceptors.response) return [3 /*break*/, 8];
                        return [4 /*yield*/, interceptors.response({ response: newRes, request: requestInit })];
                    case 7:
                        _b = _h.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        _b = newRes;
                        _h.label = 9;
                    case 9:
                        newRes = _b;
                        utils_1.invariant('data' in newRes, 'You must have `data` field on the Response returned from your `interceptors.response`');
                        if (theController == controller.current) {
                            res.current = newRes;
                            data.current = res.current.data;
                        }
                        opts = { attempt: attempt.current, response: newRes };
                        // if we just have `retries` set with NO `retryOn` then
                        // automatically retry on fail until attempts run out
                        _c = !utils_1.isFunction(retryOn) && Array.isArray(retryOn) && retryOn.length < 1 && (newRes === null || newRes === void 0 ? void 0 : newRes.ok) === false
                            // otherwise only retry when is specified
                            || Array.isArray(retryOn) && retryOn.includes(newRes.status);
                        if (_c) 
                        // if we just have `retries` set with NO `retryOn` then
                        // automatically retry on fail until attempts run out
                        return [3 /*break*/, 12];
                        _d = utils_1.isFunction(retryOn);
                        if (!_d) return [3 /*break*/, 11];
                        return [4 /*yield*/, retryOn(opts)];
                    case 10:
                        _d = (_h.sent());
                        _h.label = 11;
                    case 11:
                        _c = _d;
                        _h.label = 12;
                    case 12:
                        shouldRetry = (_c) && retries > 0 && retries > attempt.current;
                        if (!shouldRetry) return [3 /*break*/, 14];
                        return [4 /*yield*/, retry(opts, routeOrBody, body)];
                    case 13:
                        theData = _h.sent();
                        return [2 /*return*/, theData];
                    case 14:
                        if (!(cachePolicy === CACHE_FIRST && !response.isCached)) return [3 /*break*/, 16];
                        return [4 /*yield*/, cache.set(response.id, newRes.clone())];
                    case 15:
                        _h.sent();
                        _h.label = 16;
                    case 16:
                        if (Array.isArray(data.current) && !!(data.current.length % perPage))
                            hasMore.current = false;
                        return [3 /*break*/, 24];
                    case 17:
                        err_1 = _h.sent();
                        if (attempt.current >= retries && timedout.current && theController == controller.current)
                            error.current = utils_1.makeError('AbortError', 'Timeout Error');
                        opts = { attempt: attempt.current, error: err_1 };
                        // if we just have `retries` set with NO `retryOn` then
                        // automatically retry on fail until attempts run out
                        _e = !utils_1.isFunction(retryOn) && Array.isArray(retryOn) && retryOn.length < 1;
                        if (_e) 
                        // if we just have `retries` set with NO `retryOn` then
                        // automatically retry on fail until attempts run out
                        return [3 /*break*/, 20];
                        _f = utils_1.isFunction(retryOn);
                        if (!_f) return [3 /*break*/, 19];
                        return [4 /*yield*/, retryOn(opts)];
                    case 18:
                        _f = (_h.sent());
                        _h.label = 19;
                    case 19:
                        _e = _f;
                        _h.label = 20;
                    case 20:
                        shouldRetry = (_e) && retries > 0 && retries > attempt.current;
                        if (!shouldRetry) return [3 /*break*/, 22];
                        return [4 /*yield*/, retry(opts, routeOrBody, body)];
                    case 21:
                        theData = _h.sent();
                        return [2 /*return*/, theData];
                    case 22:
                        if (err_1.name !== 'AbortError' && theController == controller.current) {
                            error.current = err_1;
                        }
                        return [3 /*break*/, 24];
                    case 23:
                        if (timer)
                            clearTimeout(timer);
                        return [7 /*endfinally*/];
                    case 24:
                        if (theController == controller.current) {
                            if (newRes && !newRes.ok && !error.current)
                                error.current = utils_1.makeError(newRes.status, newRes.statusText);
                            if (!suspense)
                                setLoading(false);
                            if (attempt.current === retries)
                                attempt.current = 0;
                            if (error.current)
                                onError({ error: error.current });
                            timedout.current = false;
                            controller.current = undefined;
                        }
                        if (newRes) {
                            return [2 /*return*/, newRes.data];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        }); }; // end of doFetch()
        var retry = function (opts, routeOrBody, body) { return __awaiter(_this, void 0, void 0, function () {
            var delay, d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delay = (utils_1.isFunction(retryDelay) ? retryDelay(opts) : retryDelay);
                        if (!(Number.isInteger(delay) && delay >= 0)) {
                            console.error('retryDelay must be a number >= 0! If you\'re using it as a function, it must also return a number >= 0.');
                        }
                        attempt.current++;
                        if (!delay) return [3 /*break*/, 2];
                        return [4 /*yield*/, utils_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, doFetch(routeOrBody, body)];
                    case 3:
                        d = _a.sent();
                        return [2 /*return*/, d];
                }
            });
        }); };
        if (suspense) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(_this, void 0, void 0, function () {
                    var newData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                suspender.current = doFetch.apply(void 0, args).then(function (newData) {
                                    suspenseStatus.current = 'success';
                                    return newData;
                                }, function () {
                                    suspenseStatus.current = 'error';
                                });
                                forceUpdate();
                                return [4 /*yield*/, suspender.current];
                            case 1:
                                newData = _a.sent();
                                return [2 /*return*/, newData];
                        }
                    });
                });
            };
        }
        return doFetch;
    }, [isServer, onAbort, requestInit, host, path, interceptors, cachePolicy, perPage, timeout, persist, cacheLife, onTimeout, defaults.data, onNewData, forceUpdate, suspense]);
    var post = react_1.useCallback(makeFetch(types_1.HTTPMethod.POST), [makeFetch]);
    var del = react_1.useCallback(makeFetch(types_1.HTTPMethod.DELETE), [makeFetch]);
    var request = react_1.useMemo(function () { return Object.defineProperties({
        get: makeFetch(types_1.HTTPMethod.GET),
        post: post,
        patch: makeFetch(types_1.HTTPMethod.PATCH),
        put: makeFetch(types_1.HTTPMethod.PUT),
        options: makeFetch(types_1.HTTPMethod.OPTIONS),
        head: makeFetch(types_1.HTTPMethod.HEAD),
        connect: makeFetch(types_1.HTTPMethod.CONNECT),
        trace: makeFetch(types_1.HTTPMethod.TRACE),
        del: del,
        delete: del,
        abort: function () { return controller.current && controller.current.abort(); },
        query: function (query, variables, options) { return post({ query: query, variables: variables }, undefined, options); },
        mutate: function (mutation, variables, options) { return post({ mutation: mutation, variables: variables }, undefined, options); },
        cache: cache
    }, {
        loading: { get: function () { return loading.current; } },
        error: { get: function () { return error.current; } },
        data: { get: function () { return data.current; } },
    }); }, [makeFetch]);
    var response = react_1.useMemo(function () { return utils_1.toResponseObject(res, data); }, []);
    // onMount/onUpdate
    react_1.useEffect(function () {
        mounted.current = true;
        if (Array.isArray(dependencies)) {
            var methodName = requestInit.method || types_1.HTTPMethod.GET;
            var methodLower = methodName.toLowerCase();
            var req = request[methodLower];
            req();
        }
        return function () { return mounted.current = false; };
    }, dependencies);
    // Cancel any running request when unmounting to avoid updating state after component has unmounted
    // This can happen if a request's promise resolves after component unmounts
    react_1.useEffect(function () { return request.abort; }, []);
    if (suspense && suspender.current) {
        if (isServer)
            throw new Error('Suspense on server side is not yet supported! 🙅‍♂️');
        switch (suspenseStatus.current) {
            case 'pending':
                throw suspender.current;
            case 'error':
                throw error.current;
        }
    }
    return Object.assign([request, response, loading.current, error.current], __assign(__assign({ request: request, response: response }, request), { loading: loading.current, data: data.current, error: error.current }));
}
exports.useFetch = useFetch;
exports.default = useFetch;