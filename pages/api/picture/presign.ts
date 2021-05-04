import AWS from 'aws-sdk';

// AWS config
AWS.config.update({
    accessKeyId: process.env.AMETHYST_AWS_ACCESS_KEY,
    secretAccessKey: process.env.AMETHYST_AWS_SECRET_KEY, 
    region: process.env.AMETHYST_BUCKET_REGION,
});

export default async function presign(req, res) {
    // Get information fields
    const { file } = req.body;

    // Upload picture to S3
    const s3 = new AWS.S3();

    const post = await s3.createPresignedPost({
        Bucket: process.env.AMETHYST_BUCKET_NAME,
        Fields: {
            key: file,
        },
    });

    res.status(200).json(post);
}