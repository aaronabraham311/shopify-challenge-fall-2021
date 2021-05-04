import { createMocks } from 'node-mocks-http';
import prisma from '../prisma/index';

import transactions from "../pages/api/transactions";

describe('Transaction testing', () => {
    it("Buy item", async () => {
        const item = await prisma.inventory.findFirst();
        
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                itemId: item.id,
                pictureAssetId: item.pictureAssetId,
                quantity: 0,
                price: 0
            }
        });
        await transactions(req, res);

        expect(res._getStatusCode()).toBe(200);

        const id = JSON.parse(res._getData()).transactionItem.id;

        await prisma.transaction.delete({
            where: {
                id,
            }
        });
    });
    it("Get transaction data", async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: {
                graphData: 'true'
            }
        });

        await transactions(req, res);
        expect(res._getStatusCode()).toBe(200);
    });
    it("Get three most recent transactions", async () => {
        const { req, res } = createMocks({
            recentThree: 'true'
        });

        await transactions(req, res);
        expect(res._getStatusCode()).toBe(200);
    });
});
