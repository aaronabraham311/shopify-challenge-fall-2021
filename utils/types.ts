export interface PictureAssetItemType {
    id: number;
    s3_key: string;
    s3_link: string;
}

export interface InventoryItemType {
    id: number;
    name: string;
    description: string;
    created_at: string;
    pictureAsset: PictureAssetItemType;
    pictureAssetId: number;
    price: number;
    quantity: number;
    tag: string;
}