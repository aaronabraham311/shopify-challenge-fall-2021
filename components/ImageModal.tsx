import React from "react";
import {
    Box,
    SimpleGrid,
    Image,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";

import { InventoryItemType } from "../utils/types"; 

type ImageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (quantity: number) => void;
    modalTitle: string;
    inventoryItem: InventoryItemType;
    admin?: boolean;
}

const ImageModal = ({
    isOpen,
    onClose,
    onSubmit,
    modalTitle,
    inventoryItem,
    admin
}: ImageModalProps) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            quantity: 0,
        }
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <form
                onSubmit={handleSubmit((data) =>{
                    onSubmit(data.quantity);
                    reset({ quantity: 0 });
                })}
            >
                <ModalContent maxW="800px">
                    <ModalHeader>{modalTitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={5}>
                            <Box>
                                <Image maxW="300px" src={inventoryItem.pictureAsset.s3_link}/>
                            </Box>
                            <Box>
                                <Text mt="2" mb="1"><b>Item name:</b> {inventoryItem.name}</Text>
                                <Text mt="1" mb="1"><b>Item description:</b> {inventoryItem.description}</Text>
                                <Text mt="1" mb="1"><b>Price:</b> ${inventoryItem.price}</Text>
                                <Text mt="1" mb="1"><b>Store stock:</b> {inventoryItem.quantity}</Text>
                                <Text mt="1" mb="1"><b>Buy:</b></Text>
                                <Controller
                                    control={control}
                                    name="quantity"
                                    render={(restProps) => {
                                        const {name, ...fields} = restProps.field;
                                        return (
                                            <NumberInput {...fields} min={0} max={inventoryItem.quantity}>
                                                <NumberInputField name={name} />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        )
                                    }}
                                />
                                {inventoryItem.quantity === 0 && (
                                    <Text color={"red.500"}>Sold out</Text>
                                )}
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} mr={3}>Close</Button>
                        <Button 
                            type="submit"
                            disabled={inventoryItem.quantity === 0 || admin}
                        >
                            Buy
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
};

export default ImageModal;
