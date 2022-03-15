import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GIPHY_API;

const useFetch = ({ keyword }) => {
    const [gifUrl, setGifUrl] = useState('');

    const fetchGifs = async () => {
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`); //this api fetches our gifs using the keyword as a search parameter to generate the gifs, spaces are removed so only a word is sent as a keyword. Only 1 gif is generated because the limit is set to 1
            console.log(API_KEY);
            const { data } = await response.json(); //the gif is converted to json and set to data

            setGifUrl(data[0]?.images?.downsized_medium.url);   //data[0]?.images?.downsized_medium?.url is used by giphy to get and select the gif in a specific format
        } catch (error) {
            setGifUrl("https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif"); //sets this as the image incase we get an error
        }
    }

    useEffect(() => {
        if (keyword) fetchGifs();
    }, [keyword]); //runs the fetchGif function whenever our keyword changes

    return gifUrl;
}

export default useFetch;