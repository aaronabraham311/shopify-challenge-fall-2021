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
        // Create inventory and picture assets
        const inventory = await prisma.inventory.create({
            data: {
                pictureAsset: {
                    create: { s3_key: filename },
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
        console.log(e);
        return res.status(400).json({
            error: 'Error adding to inventory',
        });
    }
}