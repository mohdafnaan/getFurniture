import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads/products");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
const allowedMime = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, `${uniqueSuffix}_${name}${ext}`);
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB for images
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (!allowedExt.includes(ext) || !allowedMime.includes(mime)) {
      return cb(
        new Error("Only JPG, JPEG, PNG and WEBP image files are allowed"),
        false
      );
    }

    cb(null, true);
  },
});

export default upload;
