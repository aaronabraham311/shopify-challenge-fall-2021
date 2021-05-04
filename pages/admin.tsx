import React, { useEffect } from "react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router";
import NavBarContainer from "../components/NavBarContainer";
import axios from "axios"
import { SimpleGrid } from "@chakra-ui/react";
import { getSession, signOut } from 'next-auth/client';

import Grid from "../components/Grid";
import AddInventory from "../components/AddInventory";
import RevenueGraph from "../components/RevenueGraph";
import RecentTransactionList from "../components/RecentTransactionList";
import s3Upload from "../utils/s3Upload";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const res = context.res;
  if(!session) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }

  return { props: {} }
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

  const handleInventorySubmit = async ({
    file,
    name,
    description,
    price,
    quantity
  }) => {
    const filename = await s3Upload(file);
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
      <NavBarContainer admin handleLogout={() => signOut({ callbackUrl: 'http://localhost:3000/'})}/>
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
