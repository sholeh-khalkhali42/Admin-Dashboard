// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectAllUsers, deleteUser, updateUser } from '../features/usersSlice';
import { fetchProducts, selectAllProducts, deleteProduct, updateProduct } from '../slices/productsSlice';
import { selectAllCategories } from '../slices/categoriesSlice';
import AddUserForm from './AddUserForm';
import AddProductForm from './AddProductForm';

const Dashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const loadingUsers = useSelector((state) => state.users.loading);
  const loadingProducts = useSelector((state) => state.products.loading);

  const [editingUser, setEditingUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');

  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState('');

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle user CRUD operations
  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserPhone(user.phone);
    setUserAddress(user.address);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    const updatedUser = { ...editingUser, name: userName, phone: userPhone, address: userAddress };
    dispatch(updateUser(updatedUser));
    setEditingUser(null);
    setUserName('');
    setUserPhone('');
    setUserAddress('');
  };

  // Handle product CRUD operations
  const handleDeleteProduct = (productId) => {
    dispatch(deleteProduct(productId));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductCategory(product.category);
    setProductImage(product.image);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...editingProduct,
      name: productName,
      price: productPrice,
      category: productCategory,
      image: productImage,
    };
    dispatch(updateProduct(updatedProduct));
    setEditingProduct(null);
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductImage('');
  };

  if (loadingUsers || loadingProducts) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="section">
        <h3>Users</h3>
        <AddUserForm />
        <h4>Edit User</h4>
        {editingUser && (
          <form onSubmit={handleUpdateUser}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Name"
              required
            />
            <input
              type="text"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="Phone"
              required
            />
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Address"
              required
            />
            <button type="submit">Update User</button>
          </form>
        )}
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.phone} - {user.address}
              <button onClick={() => handleEditUser(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>Products</h3>
        <AddProductForm />
        <h4>Edit Product</h4>
        {editingProduct && (
          <form onSubmit={handleUpdateProduct}>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              required
            />
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Price"
              required
            />
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              placeholder="Image URL"
            />
            <button type="submit">Update Product</button>
          </form>
        )}
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <img src={product.image} alt={product.name} width="100" />
              <p>{product.name} - ${product.price}</p>
              <p>{categories.find(cat => cat.id === product.category)?.name}</p>
              <button onClick={() => handleEditProduct(product)}>Edit</button>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
