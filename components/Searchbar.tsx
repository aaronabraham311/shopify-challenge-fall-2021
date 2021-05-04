import React from "react";
import { 
    Box,
    Input
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons";

type SearchbarProps = {
  query: string;
  handleQueryChange: (e) => void;
}

const Searchbar = ({ 
    query,
    handleQueryChange
}: SearchbarProps) => {
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
