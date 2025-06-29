import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [".csv", ".xlsx", ".axls"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type. Only .csv, .xlsx, and .axls files are allowed."), false);
    }
}

const upload = multer({storage, fileFilter});
export default upload;