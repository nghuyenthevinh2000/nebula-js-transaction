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
exports.__esModule = true;
var config_1 = require("./config");
var proto_signing_1 = require("@cosmjs/proto-signing");
var amino_1 = require("@cosmjs/amino");
var nebulajs_1 = require("@nghuyenthevinh2000/nebulajs");
var tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
var helpers_1 = require("@osmonauts/helpers");
var _a = nebulajs_1.nebula.launchpad.MessageComposer.withTypeUrl, createProject = _a.createProject, deleteProject = _a.deleteProject, withdrawAllTokens = _a.withdrawAllTokens;
var _b = nebulajs_1.nebula.ido.MessageComposer.withTypeUrl, enableIDO = _b.enableIDO, commitParticipation = _b.commitParticipation;
var rpcEndpoint = "http://localhost:26657/";
var getNetwork = function (network_name) { return config_1.networks[network_name]; };
var signAndBroadcast = function (_a) {
    var client = _a.client, chainId = _a.chainId, address = _a.address, msgs = _a.msgs, fee = _a.fee, _b = _a.memo, memo = _b === void 0 ? '' : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var _c, accountNumber, sequence, txRaw, txBytes;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client.getSequence(address)];
                case 1:
                    _c = _d.sent(), accountNumber = _c.accountNumber, sequence = _c.sequence;
                    return [4 /*yield*/, client.sign(address, msgs, fee, memo, {
                            accountNumber: accountNumber,
                            sequence: sequence,
                            chainId: chainId
                        })];
                case 2:
                    txRaw = _d.sent();
                    txBytes = tx_1.TxRaw.encode(txRaw).finish();
                    return [4 /*yield*/, client.broadcastTx(txBytes)];
                case 3: return [2 /*return*/, _d.sent()];
            }
        });
    });
};
function sendCreateProject(_a) {
    var project_title = _a.project_title, project_information = _a.project_information, mnemonic = _a.mnemonic;
    return __awaiter(this, void 0, void 0, function () {
        var signer, accs, msg, fee, client, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: getNetwork("nebula").bech32Prefix })];
                case 1:
                    signer = _b.sent();
                    return [4 /*yield*/, signer.getAccounts()];
                case 2:
                    accs = _b.sent();
                    msg = createProject({
                        owner: accs[0].address,
                        projectTitle: project_title,
                        projectInformation: project_information
                    });
                    fee = {
                        amount: amino_1.coins(100, 'unebula'),
                        gas: "100000"
                    };
                    return [4 /*yield*/, nebulajs_1.getSigningNebulaClient({
                            rpcEndpoint: rpcEndpoint,
                            signer: signer // OfflineSigner
                        })];
                case 3:
                    client = _b.sent();
                    res = signAndBroadcast({
                        client: client,
                        chainId: 'nebula-1',
                        address: accs[0].address,
                        msgs: [msg],
                        fee: fee,
                        memo: ''
                    });
                    return [2 /*return*/, res];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var msg, msg1, msg2, msg3, ms4;
    return __generator(this, function (_a) {
        try {
            msg = createProject({
                owner: "",
                projectTitle: "",
                projectInformation: ""
            });
            console.log(msg);
            msg1 = deleteProject({
                owner: "",
                projectId: helpers_1.Long.fromString("1")
            });
            console.log(msg1);
            msg2 = withdrawAllTokens({
                owner: "",
                projectId: helpers_1.Long.fromString("1")
            });
            console.log(msg2);
            msg3 = enableIDO({
                owner: "",
                projectId: helpers_1.Long.fromString("1"),
                tokenForDistribution: amino_1.coins(1000000000, 'unebula'),
                tokenListingPrice: amino_1.coins("1000000", "uusdt"),
                allocationLimit: [],
                startTime: new Date()
            });
            console.log(msg3);
            ms4 = commitParticipation({
                participant: "",
                tokenCommit: amino_1.coins("1000000", "uusdt"),
                projectId: helpers_1.Long.fromString("1")
            });
            console.log(ms4);
        }
        catch (e) {
            console.log(e);
        }
        return [2 /*return*/];
    });
}); })();
