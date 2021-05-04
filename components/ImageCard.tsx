import React from "react";
import { 
    Box, 
    Image, 
    Badge, 
    Flex, 
    Spacer, 
    IconButton,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalFooter 
} from "@chakra-ui/react"
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

import ImageModal from "./ImageModal";
import { InventoryItemType } from "../utils/types"; 

type ImageCardProps = {
    imageFilename: string;
    imageTag: string;
    itemTitle: string;
    inventoryItem: InventoryItemType;
    handleTransaction?: ({ itemId, pictureAssetId, quantity, price}) => void;
    handleInventoryDelete?: ({ inventoryId, pictureId, filename }) => void;
    handleEditClick?: (item: InventoryItemType) => void;
    admin?: boolean;
}

const ImageCard = ({
    imageFilename,
    imageTag,
    itemTitle,
    inventoryItem,
    handleTransaction,
    handleInventoryDelete,
    handleEditClick,
    admin
}: ImageCardProps) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

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

    const handleDeleteModalOpen = () => {
        setDeleteModalOpen(true);
    }

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
    }

    const handleDeleteModalConfirm = () => {
        handleInventoryDelete({
            inventoryId: inventoryItem.id,
            pictureId: inventoryItem.pictureAssetId,
            filename: inventoryItem.pictureAsset.s3_key,
        });
        handleDeleteModalClose();
    }

    const onEditClick = () => {
        handleEditClick(inventoryItem);
    }

    return (
        <>
            <Box>
                <Box height="230px" onClick={handleOpen}>
                    <Image src={imageFilename} maxH="250px"/>
                </Box>
                <Flex pl="6" pt="6" pr="6" alignItems="baseline">
                    <Box onClick={handleOpen}>
                        <Badge borderRadius="full" px="2" colorScheme="teal">
                            {imageTag}
                        </Badge>
                        {inventoryItem.quantity === 0 && (
                            <Badge borderRadius="full" px="2" ml="10" colorScheme="red">
                                Sold Out
                            </Badge>
                        )}
                    </Box>
                    {admin && (
                        <>
                            <Spacer />
                            <IconButton
                                onClick={onEditClick} 
                                mr="5" 
                                aria-label="Edit" 
                                icon={<EditIcon />}
                            />
                            <IconButton 
                                onClick={handleDeleteModalOpen}
                                aria-label="Delete" 
                                icon={<DeleteIcon />}
                            />
                        </>
                    )}
                </Flex>
                <Box 
                    mt="1" 
                    fontWeight="semibold" 
                    as="h4" 
                    lineHeight="tight" 
                    pl="6" 
                    pt="6"
                    onClick={handleOpen}
                >
                    {itemTitle}
                </Box>
            </Box>
            <ImageModal 
                isOpen={modalOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                modalTitle="Buy picture"
                inventoryItem={inventoryItem}
                admin={admin}
            />
            {admin && (
                <Modal isOpen={deleteModalOpen} onClose={handleDeleteModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody mt="10">
                            <Text>Are you sure you want to delete this item? All transaction history for this item will be lost. </Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={handleDeleteModalClose}>Cancel</Button>
                            <Button ml="5" bg="red.500" color="white" onClick={handleDeleteModalConfirm}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default ImageCard;
