import fs, { existsSync, mkdir } from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const uploadPath = "./uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4(); // Generate unique UUID
    cb(null, uniqueFilename + "_" + file.originalname.replace(/\s+/g, "_"));
  },
});
const uploadMiddlware = multer({ storage: storage });

export default uploadMiddlware;
