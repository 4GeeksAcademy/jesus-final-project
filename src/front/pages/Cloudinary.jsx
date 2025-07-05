import React from 'react'
import { useState } from 'react'
import { motion } from "framer-motion";

const Cloudinary = () => {

    const preset_name = "yu1h90st";
    const cloud_name = "dwgl3ivi4"

    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false)


    const uploadImage = async (e) => {
        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', preset_name)

        setLoading(true)

        try {

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();
            setImage(file.secure_url);
            setLoading(false);
            //await actions.sendPhoto(file.secure_url) //15 Enviamos la url a un action para hacer algo en back. Lo dejamos bloqueado para que no de error de importacion de Context actions o de la función.
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }

    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <h1>Upload Image</h1>

                <input type="file"
                    name="file"
                    placeholder='Upload an image'
                    // accept='image/png, image/jpeg' 
                    onChange={(e) => uploadImage(e)}
                />

                {loading ? (
                    <h3>Loading...</h3>
                ) : (
                    <img src={image} alt="imagen subida" />    //estilo imagen
                )}
            </motion.div>

        </div>
    );
}

export default Cloudinary