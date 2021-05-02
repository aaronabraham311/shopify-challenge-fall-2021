import prisma from '../../../prisma/index'; // Prisma client
import AWS from 'aws-sdk';

// AWS config
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY, 
    region: process.env.BUCKET_REGION,
});

export default async (req, res) => {
    const { inventoryId, pictureId, filename } = req.body;

    try {
        // Deleting S3 image from bucket
        const s3 = new AWS.S3();

        const s3Deletion = await s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: filename
        });
        
        console.log(s3Deletion);

        if (!s3Deletion) {
            return res.status(400).json({
                error: 'Error deleting from S3'
            });
        }

        // Deleting picture asset and inventory in single transaction
        const deleteAsset = await prisma.pictureAsset.delete({
            where: {
                id: pictureId,
            }
        });

        const deleteInventory = await prisma.inventory.delete({
            where: {
                id: inventoryId,
            }
        });

        if (!deleteAsset || !deleteInventory) {
            return res.status(400).json({
                error: 'Error deleting inventory and asset from tables'
            })
        }

        return res.status(200);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            error: 'Error deleting inventory item',
        });
    }
}