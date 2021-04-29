import React from "react";
import { Box, Image, Badge } from "@chakra-ui/react"

import ImageModal from "./ImageModal";

const ImageCard: React.FC = ({
    imageFilename,
    imageTag,
    itemTitle,
    inventoryItem
}) => {
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpen = () => {
        setModalOpen(true);
    }

    const handleClose = () => {
        setModalOpen(false);
    }

    const handleSubmit = () => {
        setModalOpen(false);
    }

    return (
        <>
            <Box onClick={handleOpen}>
                <Box height="250px">
                    <Image src={imageFilename}/>
                </Box>
                <Box pl="6" pt="6" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        {imageTag}
                    </Badge>
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
            />
        </>
    );
};

export default ImageCard;
