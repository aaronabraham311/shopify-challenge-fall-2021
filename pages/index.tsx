import React, { useEffect, useCallback } from "react"
import { GetStaticProps } from "next"
import { signIn } from "next-auth/client";
import NavBarContainer from "../components/NavBarContainer";
import axios from "axios"

import Grid from "../components/Grid";
import url from "../utils/url";

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}

const MainPage: React.FC = (props) => {
  const [inventory, setInventory] = React.useState([]);
  const [filteredInventory, setFilteredInventory] = React.useState([]);
  const [query, setQuery] = React.useState('');


  const getInventory = async () => {
    const response = await axios.get('/api/inventory');
    setInventory(response.data);
  };

  useEffect(() => {
    // Gets all inventory upon render
    getInventory();
  }, []);

  useEffect(() => {
    // Sets filtered items based on query entered in search bar
    if (query === '') {
      setFilteredInventory([]);
    } else {
      const filteredInventory = inventory.filter(item => item.tag.includes(query));
      setFilteredInventory(filteredInventory);
    }
  }, [query]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  }

  const handleTransactionSubmit = async ({ 
    itemId,
    pictureAssetId,
    quantity,
    price
  }) => {
    // Adds transaction to database
    const response = await axios.post('/api/transactions', {
      itemId,
      pictureAssetId,
      quantity,
      price,
    });
    const { inventoryItem } = response.data;

    // Updates React state with updated inventory
    const replaceIndex = inventory.findIndex(
      (item) => item.id === inventoryItem.id
    );
    const copiedInventory = [...inventory];
    copiedInventory[replaceIndex] = inventoryItem;
    setInventory(copiedInventory);
  }
  
  return (
    <>
      <NavBarContainer handleLogin={() => signIn(undefined, {
        callbackUrl: `${url}/admin`
      })}/>
      <Grid 
        inventory={
          filteredInventory.length > 0 || query !== '' ? filteredInventory : inventory
        }
        query={query}
        handleQueryChange={handleQueryChange}
        handleTransaction={handleTransactionSubmit}
      />
    </>
  )
}

export default MainPage
