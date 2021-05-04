import { createMocks } from 'node-mocks-http';
import { readFileSync } from 'fs';
import prisma from '../prisma/index';

import presign from "../pages/api/picture/presign";
import inventoryGetPost from "../pages/api/inventory";
import inventoryPutDelete from "../pages/api/inventory/[id]";

describe('Inventory testing', () => {
    it("Presign image for S3 upload", async () => {
        const imgBlob = readFileSync(require('path').resolve(__dirname, './test_image.jpg'));
        const testImgFile = new File(imgBlob, 'test_img.jpg');
        const filename = encodeURIComponent(testImgFile.name);
        
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                filename,
            }
        });
        await presign(req, res);

        expect(res._getStatusCode()).toBe(200);
    });
    it("Upload inventory item to RDS", async () => {
        const body = {
            filename: "test_image.jpg",
            name: "test",
            description: "test",
            quantity: 0,
            price: 0,
        };

        const { req, res } = createMocks({
            method: 'POST',
            body
        });

        await inventoryGetPost(req, res);
        expect(res._getStatusCode()).toBe(200);

        const inventoryId = JSON.parse(res._getData()).id;
        const pictureAssetId = JSON.parse(res._getData()).pictureAsset.id;
        await prisma.inventory.delete({
            where: {
                id: inventoryId
            }
        });
        await prisma.pictureAsset.delete({
            where: {
                id: pictureAssetId
            }
        });
    });
    it("Get all items from RDS", async () => {
        const { req, res } = createMocks({
            method: 'GET'
        });

        await inventoryGetPost(req, res);
        expect(res._getStatusCode()).toBe(200);
    });
    it("Edit item on RDS", async () => {
        const body = {
            filename: "test_image.jpg",
            name: "test",
            description: "test",
            quantity: 0,
            price: 0,
        };

        const { req, res } = createMocks({
            method: 'POST',
            body
        });

        await inventoryGetPost(req, res);
        expect(res._getStatusCode()).toBe(200);

        const inventoryId = JSON.parse(res._getData()).id;
        const pictureAssetId = JSON.parse(res._getData()).pictureAsset.id;
        const { req: editReq, res: editRes } = createMocks({
            method: 'PUT',
            query: {
                id: inventoryId
            },
            body: {
                name: 'test',
                description: 'test',
                quantity: 0,
                price: 0,
            }
        });
        await inventoryPutDelete(editReq, editRes);
        expect(editRes._getStatusCode()).toBe(200);

        await prisma.inventory.delete({
            where: {
                id: inventoryId
            }
        });
        await prisma.pictureAsset.delete({
            where: {
                id: pictureAssetId
            }
        });
    });
});
