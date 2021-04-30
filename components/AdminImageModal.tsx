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
    modalTitle
}) => {
    const { handleSubmit, register, control } = useForm();

    const validateFiles = (value) => {
        console.log(value);
        if (value.length < 1) {
            return 'Image is required'
        }

        if (value.size / (1024 * 1024) > 10) {
            return 'Max image size is 10mb'
        } 

        return true;
    }

    const uploadPhoto = async(e) => {
        const file = e.target.files[0];
        const filename = encodeURIComponent(file.name);
        
        const response = await axios.post('/api/picture/presign', {
          file: filename,
        });
        const { url, fields } = await response.data;
        const formData = new FormData();
    
        Object.entries({...fields, file}).forEach(([key, value]) => {
          formData.append(key, value);
        });
    
        const upload = await fetch(url, {
          method: 'POST',
          body: formData 
        });
    
        const body = {
          filename: filename,
          name: 'test',
          description: 'test sample',
          quantity: 0,
          price: 0,
          tag: 'test'
        }
        const res = await axios.post('/api/inventory/create', body)
      }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <form
                onSubmit={handleSubmit((data) =>{
                    console.log(data);
                })}
            >
                <ModalContent>
                    <ModalHeader>{modalTitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={5}>
                            <Box>
                                <Text>Upload image</Text>
                                <Controller 
                                    name="image"
                                    control={control}
                                    defaultValue={''}
                                    render={props => 
                                        <input 
                                            name="image"
                                            type="file" 
                                            accept="image/png, image/jpeg"
                                            {...props.field}
                                        />      
                                    }
                                />
                            </Box>
                            <Box>
                                <Text>Enter picture name</Text>
                                <Input />
                                <Text>Enter description</Text>
                                <Input />
                                <Text>Enter price</Text>
                                <NumberInput min={0}>
                                    <NumberInputField />
                                </NumberInput>
                                <Text>Enter number of items</Text>
                                <NumberInput min={0}>
                                    <NumberInputField />
                                </NumberInput>
                            </Box>
                        </SimpleGrid>
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
