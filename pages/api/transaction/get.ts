import prisma from '../../../prisma/index'; // Prisma client

export default async (req, res) => {
    try {
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

    } catch (e) {
        return res.status(400).json({
            error: 'Failed to get graph data',
        });
    }
}