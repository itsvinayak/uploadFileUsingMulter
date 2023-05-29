import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    dotenv.config();
} else {
    dotenv.config({ path: '.env.prod' });
    console.log = function() { };
}


const app = express();

const __dirname = path.resolve();
console.log('__dirname : ', __dirname);
const uploadFolder = path.join(__dirname, 'uploads');
console.log('uploadFolder : ', uploadFolder);

// create folder if not exist
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: function(_req, file, cb) {
        console.log('file : ', file);
        return cb(null, uploadFolder)
    },
    filename: function(_req, file, cb) {
        console.log('file from filename function : ', file);
        let origFileName = file.originalname.split('.')[0];
        let filename = origFileName + '-' + Date.now() + path.extname(file.originalname);
        console.log('filename : ', filename);
        return cb(null, filename)
    }
});


const upload = multer({ storage: storage });

// list all files is upload folder
app.get('/', (_req, res) => {
    let fileList = fs.readdirSync(uploadFolder);
    console.log('fileList : ', fileList);
    res.status(200).json({ fileList });
});

// upload single file
app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log('req.file : ', req.file);
    res.status(201).json({
        status: "success",
        message: "File upload successfully!!",
    });
});


// upload multiple files
app.post('/api/upload-multiple', upload.array('files'), (req, res) => {
    console.log('req.files : ', req.files);
    res.status(201).json({ files: req.files });
});



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
