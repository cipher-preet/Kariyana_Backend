import { S3 } from "../S3Bucket/S3Intialization";
import multer from "multer";
import multerS3 from "multer-s3";

const BannerAndCaresols = multerS3({
  s3: S3,
  bucket: "kariyanastore",
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const parts = file.mimetype.split("/")[1];
    const randomNum = Math.floor(Math.random() * 100000);
    cb(
      null,
      `bannerAndCaresols/${file.originalname}-${Date.now()}-${randomNum}.${parts}`,
    );
  },
});

const BannerAndCaresolsUploads = multer({ storage: BannerAndCaresols });

export { BannerAndCaresolsUploads };
