import prisma from '../../../prisma/index'; // Prisma client

export default async (req, res) => {
    try {
        // Get past 7 days
        const today = new Date();
        const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        const data = await prisma.$queryRaw`SELECT DATE(dt), SUM(revenue) FROM transactions WHERE DATE(dt) > ${lastWeek} GROUP BY DATE(dt) ORDER BY 1`;

        res.status(200).json(data);

    } catch (e) {
        console.log(e);
        return res.status(400).json({
            error: 'Failed to buy item',
        });
    }
}