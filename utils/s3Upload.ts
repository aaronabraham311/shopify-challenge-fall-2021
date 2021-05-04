// @ts-nocheck
import axios from 'axios';

const s3Upload = async (file) => {
    const filename = encodeURIComponent(file.name);
    const response = await axios.post('/api/picture/presign', {
        file: filename,
    });
    const { url, fields } = await response.data;

    const formData = new FormData();

    Object.entries({...fields, file}).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const res = await fetch(url, {
        method: 'POST',
        body: formData 
    });
    return filename;
}

export default s3Upload;