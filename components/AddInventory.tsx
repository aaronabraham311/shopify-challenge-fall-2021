import React from "react";
import { Flex, IconButton, Spacer } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons";

import AdminImageModal from "./AdminImageModal";
import { InventoryItemType } from "../utils/types"; 

type AddInventoryProps = {
  handleInventorySubmit: ({ file, name, description, price, quantity}) => void;
  edit: boolean;
  handleEditClose: () => void;
  handleEditSubmit: ({ id, name, description, price, quantity }) => void;
  editItem: InventoryItemType;
}

const AddInventory = ({ 
  handleInventorySubmit,
  edit,
  handleEditClose,
  handleEditSubmit,
  editItem, 
}: AddInventoryProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleOpen = () => {
    setModalOpen(true);
  } 

  const handleClose = () => {
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
        isOpen={modalOpen || edit}
        onClose={handleClose}
        modalTitle={edit ? "Edit item" : "Upload item to store"}
        handleInventorySubmit={handleInventorySubmit}
        edit={edit}
        handleInventoryEdit={handleEditSubmit}
        handleEditClose={handleEditClose}
        editItem={editItem}
      />
    </>
  );
};

export default AddInventory;
