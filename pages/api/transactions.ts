import prisma from '../../prisma/index'; // Prisma client

export default async function transactions(req, res) {
    const { query: { graphData, recentThree }, method } = req;

    try {
        switch (method) {
            case 'GET':
                if (graphData === 'true') {
                    // Get past 7 days
                    const today = new Date();
                    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                    const weekRevenue = await prisma.$queryRaw`SELECT DATE(dt), SUM(revenue) FROM transactions WHERE DATE(dt) > ${lastWeek} GROUP BY DATE(dt) ORDER BY 1`;

                    // Get total 
                    const totalRevenue = await prisma.transaction.aggregate({
                        sum: {
                            revenue: true
                        }
                    });

                    const data = {
                        weekRevenue,
                        totalRevenue,
                    }

                    res.status(200).json(data);
                }

                if (recentThree === 'true') {
                    const recentThree = await prisma.transaction.findMany({
                        take: 3,
                        orderBy: [
                            {
                                date: 'desc',
                            }
                        ],
                    });
            
                    return res.status(200).json(recentThree);
                }
                break
            case 'POST':
                const {
                    itemId,
                    pictureAssetId,
                    quantity,
                    price,
                } = req.body;

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
                        return res.status(200).json({
                            inventoryItem,
                            transactionItem: transaction,
                        });
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
                break
            default:
                res.status(405).end(`Method ${method} not allowed`);
        }
    } catch (e) {
        return res.status(400).json({
            error: 'Error interacting with transactions',
        });
    }
}