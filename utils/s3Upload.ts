// @ts-nocheck
import axios from 'axios';

const s3Upload = async (file) => {
    // Change filename to URI (specially escaped filename)
    const filename = encodeURIComponent(file.name);

    // Get presign link for AWS REST API usage
    const response = await axios.post('/api/picture/presign', {
        file: filename,
    });
    const { url, fields } = await response.data;

    // Create multipart/form data for image upload
    const formData = new FormData();
    Object.entries({...fields, file}).forEach(([key, value]) => {
        formData.append(key, value);
    });

    // Send form data using presigned URL
    const res = await fetch(url, {
        method: 'POST',
        body: formData 
    });
    return filename;
}

export default s3Upload;