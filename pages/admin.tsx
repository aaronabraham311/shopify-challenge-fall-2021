import React, { useEffect } from "react"
import { GetServerSideProps } from "next"
import NavBarContainer from "../components/NavBarContainer";
import axios from "axios"
import { SimpleGrid } from "@chakra-ui/react";
import { getSession, signOut } from 'next-auth/client';

import Grid from "../components/Grid";
import AddInventory from "../components/AddInventory";
import RevenueGraph from "../components/RevenueGraph";
import RecentTransactionList from "../components/RecentTransactionList";
import s3Upload from "../utils/s3Upload";
import { InventoryItemType } from "../utils/types"; 
import url from "../utils/url";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const res = context.res;

  // If there is no user session, we redirect to the user to the main page
  if(!session) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }

  return { props: {} }
}

const AdminPage = () => {
  const [inventory, setInventory] = React.useState([]);
  const [filteredInventory, setFilteredInventory] = React.useState([]);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<InventoryItemType>({} as InventoryItemType);
  const [query, setQuery] = React.useState('');

  const getInventory = async () => {
    const response = await axios.get('/api/inventory');
    setInventory(response.data);
  };

  useEffect(() => {
    // Gets entire inventory upon rendering
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
  }, [query])

  const handleInventorySubmit = async ({
    file,
    name,
    description,
    price,
    quantity
  }) => {
    // Upload file to S3
    const filename = await s3Upload(file);
    
    // Update inventory
    const body = {
      filename: filename,
      name,
      description,
      quantity,
      price,
    }
    const newItem = await axios.post('/api/inventory', body);
    setInventory([...inventory, newItem.data]);
  }

  const handleInventoryEditSubmit = async ({
    id,
    name,
    description,
    price,
    quantity
  }) => {
    // Update inventory with edited fields
    const response = await axios.put(`/api/inventory/${id}`, {
      name,
      description,
      price,
      quantity
    });

    // Update React state with updated inventory
    const replaceIndex = inventory.findIndex(
      (item) => item.id === response.data.id
    );
    const copiedInventory = [...inventory];
    copiedInventory[replaceIndex] = response.data;
    setInventory(copiedInventory);
    setEditOpen(false);
    setEditItem({} as InventoryItemType);
  }

  const handleInventoryEditClose = () => {
    setEditOpen(false);
    setEditItem({} as InventoryItemType);
  }

  const handleInventoryEditClick = (item) => {
    setEditOpen(true);
    setEditItem(item);
  }

  const handleInventoryDelete = async ({ 
    inventoryId, 
    pictureId, 
    filename 
  }) => {
    // Delete item from database
    await axios.post(`/api/inventory/${inventoryId}`, {
      pictureId,
      filename
    });
    
    // Delete item from React state
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
      <NavBarContainer admin handleLogout={() => signOut({ callbackUrl: url })}/>
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
