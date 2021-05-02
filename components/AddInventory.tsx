import React from "react";
import { Flex, IconButton, Spacer } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons";

import AdminImageModal from "./AdminImageModal";

const AddInventory: React.FC = ({ handleInventorySubmit }) => {
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
      <Flex 
        alignContent="flex-end"
        justifyContent="space-between"
        w="100%"
        p={8}
        bg="transparent"
      >
        <Spacer />
        <IconButton 
          aria-label="Add picture"
          onClick={handleOpen}
          icon={<AddIcon />} 
        />
      </Flex>
      <AdminImageModal 
        isOpen={modalOpen}
        onClose={handleClose}
        modalTitle={"Upload item to store"}
        handleInventorySubmit={handleInventorySubmit}
      />
    </>
  );
};

export default AddInventory;
