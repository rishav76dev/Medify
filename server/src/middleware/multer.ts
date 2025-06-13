// import express, { Request, Response } from 'express';

// const upload = multer({ dest: 'uploads/' });

// const app = express();

// app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
//   // Types now recognize `req.file`
//   if (req.file) {
//     res.send(`File uploaded: ${req.file.originalname}`);
//   } else {
//     res.status(400).send('No file uploaded');
//   }
// });

import multer, { StorageEngine } from 'multer';
import { Request } from 'express';

const storage: StorageEngine = multer.diskStorage({
  filename: function (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) {
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage });
