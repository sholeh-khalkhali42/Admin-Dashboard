import React, { useState } from 'react';
import {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from './productsApi';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  title: Yup.string().required('نام محصول الزامی است'),
  price: Yup.number().min(1, 'حداقل قیمت 1').required('قیمت الزامی است'),
  thumbnail: Yup.string().url('لینک تصویر معتبر نیست').required('لینک تصویر الزامی است'),
});

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, error, isLoading } = useGetProductsQuery();
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleAdd = async (values, { resetForm }) => {
    try {
      await addProduct(values).unwrap();
      toast.success('محصول با موفقیت افزوده شد');
      resetForm();
    } catch {
      toast.error('افزودن محصول ناموفق بود');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success('محصول حذف شد');
    } catch {
      toast.error('خطا در حذف محصول');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateProduct({ id: selectedProduct.id, ...values }).unwrap();
      toast.success('محصول با موفقیت ویرایش شد');
      setShowEditModal(false);
    } catch {
      toast.error('خطا در ویرایش محصول');
    }
  };

  if (isLoading) return <div className="text-center mt-5">در حال بارگذاری...</div>;
  if (error) return <div className="text-danger text-center">خطا در بارگذاری محصولات</div>;

  const filteredProducts = data.products
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => (priceFilter ? p.price <= +priceFilter : true));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary">مدیریت محصولات</h2>

      <Formik
        initialValues={{ title: '', price: '', thumbnail: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAdd}
      >
        {() => (
          <Form className="row g-3 mb-4 justify-content-center">
            <div className="col-md-3">
              <Field name="title" className="form-control" placeholder="نام محصول" />
              <ErrorMessage name="title" component="div" className="text-danger small" />
            </div>
            <div className="col-md-2">
              <Field name="price" type="number" className="form-control" placeholder="قیمت" />
              <ErrorMessage name="price" component="div" className="text-danger small" />
            </div>
            <div className="col-md-4">
              <Field name="thumbnail" className="form-control" placeholder="لینک عکس" />
              <ErrorMessage name="thumbnail" component="div" className="text-danger small" />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-success w-100">افزودن</button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="row mb-4 justify-content-center">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="جستجو در محصولات..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-2 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="حداکثر قیمت"
            value={priceFilter}
            onChange={(e) => {
              setPriceFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="row">
        {displayedProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.thumbnail || 'https://via.placeholder.com/100x100'}
                className="card-img-top"
                alt={product.title}
                style={{ height: '150px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text text-muted">${product.price}</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowEditModal(true);
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

    
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ویرایش محصول</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            title: selectedProduct?.title || '',
            price: selectedProduct?.price || '',
            thumbnail: selectedProduct?.thumbnail || '',
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleUpdate}
        >
          {() => (
            <Form>
              <Modal.Body>
                <div className="mb-3">
                  <label className="form-label">نام محصول</label>
                  <Field name="title" className="form-control" />
                  <ErrorMessage name="title" component="div" className="text-danger small" />
                </div>
                <div className="mb-3">
                  <label className="form-label">قیمت</label>
                  <Field name="price" type="number" className="form-control" />
                  <ErrorMessage name="price" component="div" className="text-danger small" />
                </div>
                <div className="mb-3">
                  <label className="form-label">لینک عکس</label>
                  <Field name="thumbnail" className="form-control" />
                  <ErrorMessage name="thumbnail" component="div" className="text-danger small" />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  انصراف
                </Button>
                <Button variant="primary" type="submit">
                  ذخیره تغییرات
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Products;
