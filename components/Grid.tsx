import React from "react";
import { SimpleGrid } from "@chakra-ui/react"

import ImageCard from "./ImageCard";
import Searchbar from "./Searchbar";

const Grid: React.FC = ({ 
  inventory, 
  handleTransaction,
  handleInventoryDelete,
  handleEditClick,
  query,
  handleQueryChange,
  admin
}) => {
  return (
    <>
      <Searchbar query={query} handleQueryChange={handleQueryChange} />
      <SimpleGrid minChildWidth="300px" spacing="40px" p="10">
          {inventory.length > 0 && (inventory.map((item) => {
              return <ImageCard 
                  imageFilename={item.pictureAsset.s3_link}
                  imageTag={item.tag}
                  itemTitle={item.name}
                  inventoryItem={item}
                  handleTransaction={handleTransaction}
                  handleInventoryDelete={handleInventoryDelete}
                  handleEditClick={handleEditClick}
                  admin={admin}
              />
          }))}
      </SimpleGrid>
    </>
  );
};

export default Grid;
