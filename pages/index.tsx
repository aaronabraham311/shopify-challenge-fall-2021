import React, { useEffect, useCallback } from "react"
import { GetStaticProps } from "next"
import { useRouter } from "next/router";
import { signIn } from "next-auth/client";
import NavBarContainer from "../components/NavBarContainer";
import axios from "axios"

import Grid from "../components/Grid";

export const getStaticProps: GetStaticProps = async () => {
  const inventory = [];
  return { props: { inventory } }
}

const MainPage: React.FC = (props) => {
  const router = useRouter();
  const [inventory, setInventory] = React.useState([]);
  const [filteredInventory, setFilteredInventory] = React.useState([]);
  const [query, setQuery] = React.useState('');


  const getInventory = useCallback(async () => {
    const response = await axios.get('/api/inventory/getAll');
    setInventory(response.data);
  }, []);

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  useEffect(() => {
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
    const response = await axios.post('/api/transaction/buy', {
      itemId,
      pictureAssetId,
      quantity,
      price,
    });
    const { inventoryItem } = response.data;
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
        callbackUrl: 'http://localhost:3000/admin'
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
