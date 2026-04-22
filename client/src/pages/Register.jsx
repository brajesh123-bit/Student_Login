import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';

const initialForm = {
  name: '',
  email: '',
  password: '',
  course: '',
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await api.post('/register', form);
      setSuccess(data.message);
      setForm(initialForm);
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h1>Student Registration</h1>
        <p className="subtitle">Create your account to access the dashboard.</p>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            required
          />
          {error ? <p className="message error">{error}</p> : null}
          {success ? <p className="message success">{success}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="switch-text">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
