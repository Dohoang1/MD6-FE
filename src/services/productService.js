import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

const getProducts = async (page = 0, size = 10, search = '', categoryId = '', sort = 'id,asc') => {
    try {
        console.log('Calling API with params:', { page, size, search, categoryId, sort }); // Debug log
        const response = await axios.get(API_URL, {
            params: {
                page,
                size,
                search,
                categoryId,
                sort
            }
        });
        console.log('API Response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.response || error);
        throw error;
    }
};

export { getProducts };