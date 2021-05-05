import axios from 'axios';

export const imaggaCategorization = async (fileLink, key, secret) => {
    // Gets tag from Imagga by sending S3 picture link
    const res = await axios.get(`https://api.imagga.com/v2/tags?image_url=${fileLink}`, {
            auth: {
                username: key,
                password: secret,
            }
        });
    return res.data.result.tags[0].tag.en;
}