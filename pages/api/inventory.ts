import prisma from '../../prisma/index'; // Prisma client
import  { imaggaCategorization } from "../../utils/imagga";

export default async function inventoryGetPost(req, res) {
    const { method } = req;

    try {
        switch (method) {
            case 'GET':
                const allInventory = await prisma.inventory.findMany({
                    include: {
                        pictureAsset: true,
                    },
                });
                res.status(200).json(allInventory);
                break
            case 'POST':
                const {
                    filename,
                    name,
                    description,
                    quantity,
                    price,
                } = req.body;

                const s3Link = process.env.AMETHYST_BASE_S3_LINK + filename
        
                // Tagging image
                const tag = await imaggaCategorization(s3Link, process.env.AMETHYST_IMAGGA_KEY, process.env.AMETHYST_IMAGGA_SECRET); 

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
                    res.status(200).json(inventory);
                } else {
                    res.status(400).json({
                        error: 'Error adding to inventory',
                    })
                }
                break
            default:
                res.status(405).end(`Method ${method} not allowed`);
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            error: 'Error adding to inventory',
        });
    }
}