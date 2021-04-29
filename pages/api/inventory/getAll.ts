import prisma from '../../../prisma/index'; // Prisma client

export default async (req, res) => {
    try {
        // Get all inventories
        const inventory = await prisma.inventory.findMany({
            include: {
                pictureAsset: true,
            },
        });

        return res.status(200).json(inventory);
    } catch (e) {
        return res.status(400).json({
            error: 'Error getting all inventory',
        });
    }
}