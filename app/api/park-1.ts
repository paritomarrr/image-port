import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract the imageName parameter from the query, including the extension
  const { imageName } = req.query;

  if (typeof imageName !== 'string') {
    res.status(400).json({ message: 'Invalid image name' });
    return;
  }

  // Construct the path to the image
  // Ensure the file name includes the extension (e.g., '.png')
  const imagePath = path.join(process.cwd(), 'public', imageName);

  // Use fs.promises to check if the file exists and read it asynchronously
  fs.promises.stat(imagePath)
    .then(() => fs.promises.readFile(imagePath))
    .then(data => {
      // Set the correct content-type
      res.setHeader('Content-Type', 'image/png');
      res.send(data);
    })
    .catch(() => {
      // If the file does not exist or any other error occurs, return a 404
      res.status(404).json({ message: 'Image not found' });
    });
}
