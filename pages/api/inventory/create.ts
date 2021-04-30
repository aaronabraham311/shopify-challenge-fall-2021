import prisma from '../../../prisma/index'; // Prisma client
import  { imaggaCategorization } from "../../../utils/imagga";

export default async (req, res) => {
    const {
        filename,
        name,
        description,
        quantity,
        price,
    } = req.body;

    try {
        const s3Link = process.env.BASE_S3_LINK + filename
        
        // Tagging image
        const tag = await imaggaCategorization(s3Link, process.env.IMAGGA_KEY, process.env.IMAGGA_SECRET); 

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
            },
            include: {
                pictureAsset: true,
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