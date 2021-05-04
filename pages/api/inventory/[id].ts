import prisma from '../../../prisma/index'; // Prisma client
import AWS from 'aws-sdk';

// AWS config
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY, 
    region: process.env.BUCKET_REGION,
});

export default async function inventoryPutDelete(req, res) {
    const { query: { id }, method } = req;

    try {
        switch (method) {
            case 'PUT':
                const { 
                    name,
                    description,
                    quantity,
                    price
                } = req.body;

                const updateInventory = await prisma.inventory.update({
                    where: {
                        id: parseInt(id),
                    },
                    data: {
                        name,
                        description,
                        quantity,
                        price,
                    },
                    include: {
                        pictureAsset: true
                    }
                })
        
                res.status(200).json(updateInventory);
                break
            case 'POST':
                const { pictureId, filename } = req.body;

                // Deleting S3 image from bucket
                const s3 = new AWS.S3();

                const s3Deletion = await new Promise(async (resolve, reject) => {
                    await s3.deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: filename
                    }, function(err, data){
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });

                if (!s3Deletion) {
                    return res.status(400).json({
                        error: 'Error deleting from S3'
                    });
                }

                // Deleting picture asset and inventory 
                const deleteInventory = await prisma.inventory.delete({
                    where: {
                        id: parseInt(id),
                    }
                });

                const deleteAsset = await prisma.pictureAsset.delete({
                    where: {
                        id: parseInt(pictureId)
                    }
                });

                if (!deleteInventory || !deleteAsset) {
                    return res.status(400).json({
                        error: 'Error deleting inventory and asset from tables'
                    })
                }

                res.status(200).json(deleteInventory);
                break
            default:
                res.status(405).end(`Method ${method} not allowed`);
        }
    } catch (e) {
        return res.status(400).json({
            error: 'Error editing/deleting items from inventory',
        });
    }
}