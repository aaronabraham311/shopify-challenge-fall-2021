import prisma from '@prisma/client';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

// AWS config
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY, 
    region: process.env.BUCKET_REGION,
});

export default async (req, res) => {
    // Get information fields
    const { filename, name, description, quantity, price } = req.body;

    // Upload picture to S3
    const s3 = new AWS.S3();

    console.log(req.query.file);

    const post = await s3.createPresignedPost({
        Bucket: process.env.BUCKET_NAME,
        Fields: {
            key: req.query.file,
        },
    })

    res.status(200).json(post);
}