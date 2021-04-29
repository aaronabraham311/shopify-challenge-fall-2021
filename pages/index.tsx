import React, { useEffect, useCallback } from "react"
import { GetStaticProps } from "next"
import NavBarContainer from "../components/NavBarContainer";
import axios from "axios"

import Grid from "../components/Grid";

export const getStaticProps: GetStaticProps = async () => {
  const inventory = [];
  return { props: { inventory } }
}

const Blog: React.FC = (props) => {
  const [inventory, setInventory] = React.useState([]);

  const getInventory = useCallback(async () => {
    const response = await axios.get('/api/inventory/getAll');
    setInventory(response.data);
  }, []);

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  const uploadPhoto = async(e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    
    const response = await axios.post('/api/picture/presign', {
      file: filename,
    });
    const { url, fields } = await response.data;
    const formData = new FormData();

    Object.entries({...fields, file}).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: 'POST',
      body: formData 
    });

    const body = {
      filename: filename,
      name: 'test',
      description: 'test sample',
      quantity: 0,
      price: 0,
      tag: 'test'
    }
    const res = await axios.post('/api/inventory/create', body)
  }

  console.log(inventory);
  
  return (
    <>
      <NavBarContainer />
      <Grid inventory={inventory} />
      <input onChange={uploadPhoto} type="file" accept="image/png, image/jpeg"/>
    </>
  )
}

export default Blog
