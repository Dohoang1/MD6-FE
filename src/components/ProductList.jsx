import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Grid, 
    Card, 
    CardMedia, 
    CardContent, 
    Typography,
    Pagination,
    TextField,
    Box,
    Alert
} from '@mui/material';
import { getProducts } from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Đang gọi API...'); // Debug log
            const response = await getProducts(page, 8, search);
            console.log('Dữ liệu nhận được:', response); // Debug log
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    label="Tìm kiếm sản phẩm"
                    variant="outlined"
                    value={search}
                    onChange={handleSearchChange}
                />
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Typography>Đang tải...</Typography>
            ) : products.length === 0 ? (
                <Typography align="center">Không có sản phẩm nào.</Typography>
            ) : (
                <>
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={3}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.imageUrl || 'https://via.placeholder.com/200'}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200';
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            {product.name}
                                        </Typography>
                                        <Typography>
                                            Giá: {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.price)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.description?.substring(0, 100)}...
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={totalPages}
                                page={page + 1}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default ProductList;