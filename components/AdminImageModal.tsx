import React from "react";
import {
    Box,
    SimpleGrid,
    Text,
    Button,
    Input,
    InputGroup,
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
import axios from 'axios';

// https://gist.github.com/Sqvall/23043a12a7fabf0f055198cb6ec39531
const FileUpload = ({ register }) => {
    return (
        <InputGroup>
            <input 
                type="file" 
                accept="image/png, image/jpeg"
                ref={register}
            />
        </InputGroup>
    )
}

const AdminImageModal: React.FC = ({
    isOpen,
    onClose,
    modalTitle,
    handleInventorySubmit
}) => {
    const [file, setFile] = React.useState(null);
    const { handleSubmit, control, reset } = useForm();

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    }

    const uploadPhoto = async({
        name,
        description,
        price,
        quantity
    }) => {
        const filename = encodeURIComponent(file.name);
        const response = await axios.post('/api/picture/presign', {
          file: filename,
        });
        const { url, fields } = await response.data;
        const formData = new FormData();
    
        Object.entries({...fields, file}).forEach(([key, value]) => {
          formData.append(key, value);
        });
    
        await fetch(url, {
          method: 'POST',
          body: formData 
        });
    
        const body = {
          filename: filename,
          name,
          description,
          quantity: parseInt(quantity),
          price: parseInt(price),
          tag: 'test'
        }
        const newItem = axios.post('/api/inventory/create', body);
        setInventory([...inventory, newItem]);
      }
    
    const onSubmit = (data) => {
        const parsedData = {
            file,
            name: data.name,
            description: data.description,
            quantity: parseInt(data.quantity),
            price: parseFloat(data.price),
        }
        handleInventorySubmit(parsedData);
        reset();
        setFile(null);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <ModalContent>
                    <ModalHeader>{modalTitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                        <Box>
                            <Text>Enter picture name</Text>
                            <Controller 
                                name="name"
                                control={control}
                                defaultValue={''}
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
                                defaultValue={''}
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
                                defaultValue={0}
                                render={props => 
                                    <NumberInput {...props.field} min={0}>
                                        <NumberInputField name="price" />
                                    </NumberInput>
                                }
                            />
                            <Text>Enter number of items</Text>
                            <Controller 
                                name="quantity"
                                control={control}
                                defaultValue={0}
                                render={props => 
                                    <NumberInput {...props.field} min={0}>
                                        <NumberInputField name="quantity" />
                                    </NumberInput>
                                }
                            />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} mr={3}>Close</Button>
                        <Button 
                            type="submit"
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
};

export default AdminImageModal;
