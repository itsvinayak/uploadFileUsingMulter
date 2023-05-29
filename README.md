<h1 align="center" > uploadFileUsingMulter </h1>
File Uploads Made Easy with Multer package in nodeJS

--- 


In today's world, file uploads have become a very common feature in web applications. Node.js provides an easy way to handle file uploads in web applications. With the help of third-party packages like `multer` and `formidable`, file uploads can be handled with ease.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xhbpollgm5hzyjjissx6.png)

In this article, we will explore how to handle file uploads in Node.js using Multer and build an API Backend for Uploading Single and Multiple Files.

## Multer

Multer provides an easy way to handle file uploads in Node.js. It provides a lot of options to customize the file upload process, and it has the following features:

- File uploads with customizable file names and storage location

- Limiting the file size

- Filtering the files based on their MIME types

- Handling multiple files at once

If you are building a web application with file upload functionality, Multer is worth considering.

## Requirements

- **Express.js:** Set up an Express.js server to handle HTTP requests and build the API endpoints.

- **Multer:** Install the Multer middleware package using NPM. Multer is a popular middleware that enables file uploads in Node.js.

## Initialization NodeJS Project

- **Setting up project directory:** Create a new directory for this project on your local machine with the name fileShare.

```
mkdir fileShare

```

- I **nitialize the project:** Open your terminal or command prompt, navigate to the project directory you created, and run the following command to initialize a new Node.js project:

```
npm init

```

This command will prompt you to provide information about your project, such as the project name, version, description, entry point, etc. You can either fill in the details or press enter to accept the default values.

- **Install required dependencies:** Here we will install express.js, multer, and nodemon for creating this Project

```
npm install --save express


npm install --save multer


npm install --save-dev nodemon

```

- **Setting up package.json**

```
{
  "name": "fileshare",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.mjs",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}

```

- **create an index.mjs file:** This index.mjs file will contain our code for handling file upload

```
touch index.mjs

```

### **Folder Structure 🗂**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/owy5j4z557dzew6la23n.png)

## **Implementation :**

- **Setting up an Express Server**

```
import express from 'express';
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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

```

- **Create a folder to upload files**

```
import express from 'express';
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
console.log(' __dirname : ',__ dirname);
const uploadFolder = path.join(__dirname, 'uploads');
console.log('uploadFolder : ', uploadFolder);

//Create a folder if not exist
fs.mkdirSync(uploadFolder, { recursive: true });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

```

In the code above, **fs.mkdirSync()** will create a folder if dont exist, this folder will be created in the current directory

- **Initialization of Multer**

```
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
console.log(' __dirname : ',__ dirname);
const uploadFolder = path.join(__dirname, 'uploads');
console.log('uploadFolder : ', uploadFolder);

//Create a folder if not exist
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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

```

- **Creating a POST endpoint to handle single and multiple file upload**

```
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
console.log(' __dirname : ',__ dirname);
const uploadFolder = path.join(__dirname, 'uploads');
console.log('uploadFolder : ', uploadFolder);

//Create a folder if not exist
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

```

In the code above, we set up a storage engine for `multer` to define where the uploaded files will be stored. and then set up `multer` middleware to handle the file uploads.

- **Create a GET endpoint to get all uploaded files**

```
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
console.log(' __dirname : ',__ dirname);
const uploadFolder = path.join(__dirname, 'uploads');
console.log('uploadFolder : ', uploadFolder);

//Create a folder if not exist
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

app.get('/', (_req, res) => {
    let fileList = fs.readdirSync(uploadFolder);
    console.log('fileList : ', fileList);
    res.status(200).json({ fileList });
});

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

```

With this API backend in place, you can easily handle file uploads in your web application.

## Testing API Endpoints

- Uploading a single file using the **CURL** command

```
curl --location --request POST 'http://localhost:3000/api/upload' \
    --form 'file=@"filename_one.txt"'

```

- Uploading multiple files using the **CURL** command

```
curl --location --request POST 'http://localhost:3000/api/upload-multiple' \
    --form 'files=@"filename_one.txt"' \
    --form 'files=@"filename_two.txt"'

```

## Conclusion

Handling file uploads in Node.js has become very easy with the help of packages like Multer. it provides an easy way to handle file uploads with a lot of customization options. If you are building a web application with file upload functionality.

The complete source code for this project is readily available on GitHub. By accessing the repository, you can explore the code, review its structure, and utilize it to enhance your understanding or further develop your own Node.js projects. Feel free to visit the GitHub repository to access the complete source code and leverage it for your needs.
