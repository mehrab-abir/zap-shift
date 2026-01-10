import axios from "axios";

const uploadToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const image_api_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key
        }`;

    const img_data = await axios.post(image_api_url, formData);
    // console.log(img_data.data.data.display_url);

    return img_data.data.data.display_url;
}

export default uploadToImgbb;
