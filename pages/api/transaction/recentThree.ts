import prisma from '../../../prisma/index'; // Prisma client

export default async (req, res) => {
    try {
        // Get past 7 days
        const recentThree = await prisma.transaction.findMany({
            take: 3,
            orderBy: [
                {
                    date: 'desc',
                }
            ],
        });

        return res.status(200).json(recentThree);
    } catch (e) {
        return res.status(400).json({
            error: 'Failed to get recent transactions',
        });
    }
}