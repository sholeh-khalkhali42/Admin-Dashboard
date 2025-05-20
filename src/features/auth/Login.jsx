import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Spinner, Alert } from 'react-bootstrap';

const validationSchema = Yup.object({
  username: Yup.string().required('نام کاربری الزامی است'),
  password: Yup.string().required('رمز عبور الزامی است'),
});

const Login = () => {
  const dispatch = useDispatch();
  const { status, token, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h4 className="text-center mb-4">ورود به حساب کاربری</h4>

        <Formik
          initialValues={{ username: 'emilys', password: 'emilyspass' }}
          validationSchema={validationSchema}
          onSubmit={(values) => dispatch(loginUser(values))}
        >
          {() => (
            <Form>
              <div className="mb-3">
                <label className="form-label">نام کاربری</label>
                <Field name="username" className="form-control" />
                <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
              </div>

              <div className="mb-3">
                <label className="form-label">رمز عبور</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
              </div>

              {error && <Alert variant="danger" className="py-2">{error}</Alert>}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    در حال ورود...
                  </>
                ) : (
                  'ورود'
                )}
              </button>
              <p>for test username:emilys && password:</p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
