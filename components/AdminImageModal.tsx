import React from "react";
import {
    Box,
    Text,
    Button,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    NumberInput,
    NumberInputField
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";

import { InventoryItemType } from "../utils/types"; 

type AdminImageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    modalTitle: string;
    handleInventorySubmit: ({ file, name, description, price, quantity}) => void;
    edit: boolean;
    handleInventoryEdit: ({ id, name, description, price, quantity }) => void;
    handleEditClose: () => void;
    editItem: InventoryItemType;
}

const AdminImageModal = ({
    isOpen,
    onClose,
    modalTitle,
    handleInventorySubmit,
    edit,
    handleInventoryEdit,
    handleEditClose,
    editItem
}: AdminImageModalProps) => {
    const [file, setFile] = React.useState(null);
    const { handleSubmit, control, reset } = useForm();

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    }
    
    const onSubmit = (data) => {
        const parsedData = {
            name: data.name,
            description: data.description,
            quantity: parseInt(data.quantity),
            price: parseFloat(data.price),
        }

        if (edit) {
            handleInventoryEdit({
                ...parsedData, id: editItem.id
            })
        } else {

            handleInventorySubmit({
                ...parsedData, file
            });
        }
        reset();
        setFile(null);
        onClose();
    }

    const handleClose = () => {
        if (edit) {
            handleEditClose();
        } else {
            onClose();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <ModalContent>
                    <ModalHeader>{modalTitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {!edit && (
                            <Box mb={4}>
                                <Text>Upload image</Text>
                                <input
                                    required  
                                    name="image" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileUpload} 
                                />
                            </Box>
                        )}
                        <Box>
                            <Text>Enter picture name</Text>
                            <Controller 
                                name="name"
                                control={control}
                                defaultValue={edit ? editItem.name : ''}
                                render={props => 
                                    <Input
                                        name="name" 
                                        {...props.field}
                                    />
                                }
                            />
                            <Text>Enter description</Text>
                            <Controller 
                                name="description"
                                control={control}
                                defaultValue={edit ? editItem.description: ''}
                                render={props => 
                                    <Input 
                                        name="description"
                                        {...props.field}
                                    />
                                }
                            />
                            <Text>Enter price</Text>
                            <Controller 
                                name="price"
                                control={control}
                                defaultValue={edit ? editItem.price : 0}
                                render={props => 
                                    <NumberInput {...props.field} min={0} precision={2}>
                                        <NumberInputField name="price" />
                                    </NumberInput>
                                }
                            />
                            <Text>Enter number of items</Text>
                            <Controller 
                                name="quantity"
                                control={control}
                                defaultValue={edit ? editItem.quantity: 0}
                                render={props => 
                                    <NumberInput {...props.field} min={0} precision={0}>
                                        <NumberInputField name="quantity" />
                                    </NumberInput>
                                }
                            />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleClose} mr={3}>Close</Button>
                        <Button 
                            type="submit"
                        >
                            {edit ? "Edit" : "Submit"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
};

export default AdminImageModal;
