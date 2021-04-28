import prisma from '../../../prisma/index'; // Prisma client

export default async (req, res) => {
    const {
        filename,
        name,
        description,
        quantity,
        price,
        tag
    } = req.body;

    try {
        const s3Link = process.env.BASE_S3_LINK + filename
        // Create inventory and picture assets
        const inventory = await prisma.inventory.create({
            data: {
                pictureAsset: {
                    create: { 
                        s3_key: filename,
                        s3_link: s3Link,
                    },
                },
                name,
                description,
                quantity,
                price,
                tag,
            }
        });

        if(inventory) {
            return res.status(200).json(inventory);
        } else {
            return res.status(400).json({
                error: 'Error adding to inventory',
            })
        }
    } catch (e) {
        return res.status(400).json({
            error: 'Error adding to inventory',
        });
    }
}