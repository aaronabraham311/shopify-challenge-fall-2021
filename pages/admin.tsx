import React, { useEffect, useCallback } from "react"
import { GetStaticProps } from "next"
import { useRouter } from "next/router";
import NavBarContainer from "../components/NavBarContainer";
import axios from "axios"
import { SimpleGrid } from "@chakra-ui/react";

import Grid from "../components/Grid";
import AddInventory from "../components/AddInventory";
import RevenueGraph from "../components/RevenueGraph";
import RecentTransactionList from "../components/RecentTransactionList";

export const getStaticProps: GetStaticProps = async () => {
  const inventory = [];
  return { props: { inventory } }
}

const AdminPage: React.FC = (props) => {
  const router = useRouter();
  const [inventory, setInventory] = React.useState([]);
  const [filteredInventory, setFilteredInventory] = React.useState([]);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState({});
  const [query, setQuery] = React.useState('');

  const getInventory = async () => {
    const response = await axios.get('/api/inventory/getAll');
    setInventory(response.data);
  };

  useEffect(() => {
    getInventory();
  }, []);

  useEffect(() => {
    if (query === '') {
      setFilteredInventory([]);
    } else {
      const filteredInventory = inventory.filter(item => item.tag.includes(query));
      setFilteredInventory(filteredInventory);
    }
  }, [query])

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

  const handleLogout = () => {
    router.push('/');
  }

  const handleInventorySubmit = async ({
    file,
    name,
    description,
    price,
    quantity
  }) => {
    const filename = encodeURIComponent(file.name);
    const response = await axios.post('/api/picture/presign', {
      file: filename,
    });
    const { url, fields } = await response.data;
    const formData = new FormData();

    Object.entries({...fields, file}).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await fetch(url, {
      method: 'POST',
      body: formData 
    });

    const body = {
      filename: filename,
      name,
      description,
      quantity,
      price,
    }
    const newItem = await axios.post('/api/inventory/create', body);
    setInventory([...inventory, newItem.data]);
  }

  const handleInventoryEditSubmit = async ({
    id,
    name,
    description,
    price,
    quantity
  }) => {
    const response = await axios.put('/api/inventory/edit', {
      id,
      name,
      description,
      price,
      quantity
    });

    const replaceIndex = inventory.findIndex(
      (item) => item.id === response.data.id
    );
    const copiedInventory = [...inventory];
    copiedInventory[replaceIndex] = response.data;
    setInventory(copiedInventory);
    setEditOpen(false);
    setEditItem({});
  }

  const handleInventoryEditClose = () => {
    setEditOpen(false);
    setEditItem({});
  }

  const handleInventoryEditClick = (item) => {
    console.log(item);
    setEditOpen(true);
    setEditItem(item);
  }

  const handleInventoryDelete = async ({ 
    inventoryId, 
    pictureId, 
    filename 
  }) => {
    await axios.post('/api/inventory/delete', {
      inventoryId,
      pictureId,
      filename
    });
    const modifiedInventory = inventory.filter(
      (item) => item.id !== inventoryId
    );
    setInventory(modifiedInventory);
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  }

  return (
    <>
      <NavBarContainer admin handleLogout={handleLogout}/>
      <SimpleGrid columns={2} spacing="40" p="10">
        <RevenueGraph />
        <RecentTransactionList />
      </SimpleGrid>
      <AddInventory 
        handleInventorySubmit={handleInventorySubmit} 
        edit={editOpen}
        handleEditClose={handleInventoryEditClose}
        handleEditSubmit={handleInventoryEditSubmit}
        editItem={editItem}
      />
      <Grid 
        inventory={
          filteredInventory.length > 0 || query !== '' ? filteredInventory : inventory
        } 
        handleTransaction={handleTransactionSubmit}
        handleInventoryDelete={handleInventoryDelete}
        handleEditClick={handleInventoryEditClick}
        query={query}
        handleQueryChange={handleQueryChange}
        admin
      />
    </>
  )
}

export default AdminPage
