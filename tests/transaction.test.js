import { createMocks } from 'node-mocks-http';
import prisma from '../prisma/index';

import buyInventory from "../pages/api/transaction/buy";
import getTransactions from "../pages/api/transaction/get";
import recentThree from "../pages/api/transaction/recentThree";

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
        await buyInventory(req, res);

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
            method: 'GET'
        });

        await getTransactions(req, res);
        expect(res._getStatusCode()).toBe(200);
    });
    it("Get three most recent transactions", async () => {
        const { req, res } = createMocks({
            method: 'GET'
        });

        await recentThree(req, res);
        expect(res._getStatusCode()).toBe(200);
    });
});
