import React from "react";
import { Box, Image, Badge } from "@chakra-ui/react"

import ImageModal from "./ImageModal";

const ImageCard: React.FC = ({
    imageFilename,
    imageTag,
    itemTitle,
    inventoryItem,
    handleTransaction,
    handleInventoryDelete,
    admin
}) => {
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpen = () => {
        setModalOpen(true);
    }

    const handleClose = () => {
        setModalOpen(false);
    }

    const handleSubmit = (quantity) => {
        setModalOpen(false);
        handleTransaction({
            itemId: inventoryItem.id,
            pictureAssetId: inventoryItem.pictureAsset.id,
            quantity: parseInt(quantity),
            price: inventoryItem.price,
        });
    }

    return (
        <>
            <Box onClick={handleOpen}>
                <Box height="230px">
                    <Image src={imageFilename} maxH="250px"/>
                </Box>
                <Box pl="6" pt="6" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        {imageTag}
                    </Badge>
                    {inventoryItem.quantity === 0 && (
                        <Badge borderRadius="full" px="2" ml="10" colorScheme="red">
                            Sold Out
                        </Badge>
                    )}
                </Box>
                <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" pl="6" pt="6">
                    {itemTitle}
                </Box>
            </Box>
            <ImageModal 
                isOpen={modalOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                modalTitle="Buy picture"
                inventoryItem={inventoryItem}
                onDelete={handleInventoryDelete}
                admin={admin}
            />
        </>
    );
};

export default ImageCard;
