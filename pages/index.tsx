import React, { useEffect, useCallback } from "react"
import { GetStaticProps } from "next"
import { useRouter } from "next/router";
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

  const getInventory = useCallback(async () => {
    const response = await axios.get('/api/inventory/getAll');
    setInventory(response.data);
  }, []);

  useEffect(() => {
    getInventory();
  }, [getInventory]);

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

    const replaceIndex = inventory.findIndex(
      (item) => item.id === response.data.id
    );
    const copiedInventory = [...inventory];
    copiedInventory[replaceIndex] = response.data;
    setInventory(copiedInventory);
  }
  
  const handleLogin = () => {
    router.push('/admin');
  }
  
  return (
    <>
      <NavBarContainer handleLogin={handleLogin}/>
      <Grid 
        inventory={inventory} 
        handleTransaction={handleTransactionSubmit}
      />
    </>
  )
}

export default MainPage
