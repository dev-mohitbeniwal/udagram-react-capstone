"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRouter = exports.requireAuth = void 0;
const express_1 = require("express");
const VideoItem_1 = require("../models/VideoItem");
const jwt = __importStar(require("jsonwebtoken"));
const AWS = __importStar(require("../../../../aws"));
const c = __importStar(require("../../../../config/config"));
const router = express_1.Router();
function requireAuth(req, res, next) {
    // return next();
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: "No authorization headers." });
    }
    const token_bearer = req.headers.authorization.split(" ");
    if (token_bearer.length != 2) {
        return res.status(401).send({ message: "Malformed token." });
    }
    const token = token_bearer[1];
    return jwt.verify(token, c.config.jwt.secret, (err, decoded) => {
        if (err) {
            return res
                .status(500)
                .send({ auth: false, message: "Failed to authenticate." });
        }
        return next();
    });
}
exports.requireAuth = requireAuth;
// Get all feed items
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield VideoItem_1.VideoItem.findAndCountAll({ order: [["id", "DESC"]] });
    items.rows.map((item) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
}));
// Get a specific resource
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    const item = yield VideoItem_1.VideoItem.findByPk(id);
    res.send(item);
}));
// update a specific resource
router.patch("/:id", requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@TODO try it yourself
    res.send(500).send("not implemented");
}));
// Get a signed url to put a new item in the bucket
router.get("/signed-url/:fileName", requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
}));
// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post("/", requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const caption = req.body.caption;
    const fileName = req.body.url;
    // check Caption is valid
    if (!caption) {
        return res
            .status(400)
            .send({ message: "Caption is required or malformed" });
    }
    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: "File url is required" });
    }
    const item = yield new VideoItem_1.VideoItem({
        caption: caption,
        url: fileName,
    });
    const saved_item = yield item.save();
    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
}));
exports.VideoRouter = router;
//# sourceMappingURL=video.router.js.map