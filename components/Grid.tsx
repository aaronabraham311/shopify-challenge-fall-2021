import React from "react";
import { SimpleGrid } from "@chakra-ui/react"

import ImageCard from "./ImageCard";
import Searchbar from "./Searchbar";
import { InventoryItemType } from "../utils/types"; 

type GridProps = {
  inventory: Array<InventoryItemType>;
  handleTransaction?:  ({ itemId, pictureAssetId, quantity, price}) => void;
  handleInventoryDelete?: ({ inventoryId, pictureId, filename }) => void;
  handleEditClick?: (item: InventoryItemType) => void;
  query: string;
  handleQueryChange: (e) => void;
  admin?: boolean;
}

const Grid = ({ 
  inventory, 
  handleTransaction,
  handleInventoryDelete,
  handleEditClick,
  query,
  handleQueryChange,
  admin
}: GridProps) => {
  return (
    <>
      <Searchbar query={query} handleQueryChange={handleQueryChange} />
      <SimpleGrid minChildWidth="300px" spacing="40px" p="10">
          {inventory.length > 0 && (inventory.map((item) => {
              return <ImageCard
                  key={item.id} 
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
