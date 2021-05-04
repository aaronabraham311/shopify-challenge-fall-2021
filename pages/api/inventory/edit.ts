import prisma from '../../../prisma/index'; // Prisma client

export default async function editInventory (req, res) {
    const { 
        id,
        name,
        description,
        quantity,
        price
     } = req.body;

    try {
        // Updating inventory record
        const updateInventory = await prisma.inventory.update({
            where: {
                id,
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

        return res.status(200).json(updateInventory);
    } catch (e) {
        return res.status(400).json({
            error: 'Error updating inventory item',
        });
    }
}