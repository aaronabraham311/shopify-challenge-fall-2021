import React from "react";
import { 
    Box,
    Input
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons";

const Searchbar: React.FC = ({ 
    query,
    handleQueryChange
}) => {
  return (
    <Box mb="10" pl="10" pr="10">
        <Input 
            value={query} 
            onChange={handleQueryChange}
            placeholder="Filter on tags" 
        />
    </Box>
  );
};

export default Searchbar;
