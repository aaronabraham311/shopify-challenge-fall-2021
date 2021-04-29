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

const ImageModal: React.FC = ({
    isOpen,
    onClose,
    onSubmit,
    modalTitle,
    inventoryItem
}) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            quantity: 0,
        }
    })

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{modalTitle}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <SimpleGrid columns={2} spacing={5}>
                        <Box>
                            <Image src={inventoryItem.pictureAsset.s3_link}/>
                        </Box>
                        <Box>
                            <Text>{inventoryItem.name}</Text>
                            <Text>{inventoryItem.description}</Text>
                            <Text>Price: {inventoryItem.price}</Text>
                            <Text>Store stock: {inventoryItem.quantity}</Text>
                            <Text>Buy: </Text>
                            <Controller
                                control={control}
                                name="quantity"
                                render={({ name, ...restProps }) => (
                                    <NumberInput min={0} max={inventoryItem.quantity} {...restProps}>
                                        <NumberInputField name={name}/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
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
                        onClick={handleSubmit((data) => {
                            console.log(data);
                            onSubmit();
                        })} 
                        disabled={inventoryItem.quantity === 0}
                    >
                        Buy
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImageModal;
