import prisma from '../../../prisma/index'; // Prisma client

export default async (req, res) => {
    const {
        itemId,
        pictureAssetId,
        quantity,
        price,
    } = req.body;

    try {
        // Create transaction
        const revenue = quantity * price;

        const transaction = await prisma.transaction.create({
            data: {
                pictureAssetId,
                quantity,
                price,
                revenue,
            }
        });

        if(transaction) {
            // Update inventory
            const inventoryItem = await prisma.inventory.update({
                where: {
                    id: itemId,
                },
                data: {
                    quantity: {
                        decrement: quantity
                    } 
                },
                include: {
                    pictureAsset: true
                }
            });

            if(inventoryItem) {
                return res.status(200).json(inventoryItem);
            } else {
                return res.status(400).json({
                    error: 'Failed to buy item',
                })
            }
        } else {
            return res.status(400).json({
                error: 'Failed to buy item',
            })
        }
    } catch (e) {
        return res.status(400).json({
            error: 'Failed to buy item',
        });
    }
}