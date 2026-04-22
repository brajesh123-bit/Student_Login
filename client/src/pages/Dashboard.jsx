import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [course, setCourse] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [courseMessage, setCourseMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        setStudent(data.student);
        setCourse(data.student.course);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard');
        handleLogout();
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    navigate('/login');
  };

  const handlePasswordChange = (event) => {
    setPasswordForm({
      ...passwordForm,
      [event.target.name]: event.target.value,
    });
  };

  const submitPasswordUpdate = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setError('');

    try {
      const { data } = await api.put('/update-password', passwordForm);
      setPasswordMessage(data.message);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update password');
    }
  };

  const submitCourseUpdate = async (event) => {
    event.preventDefault();
    setCourseMessage('');
    setError('');

    try {
      const { data } = await api.put('/update-course', { course });
      setStudent(data.student);
      localStorage.setItem('student', JSON.stringify(data.student));
      setCourseMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update course');
    }
  };

  if (!student) {
    return (
      <div className="auth-page">
        <div className="card">
          <h1>Loading Dashboard...</h1>
          {error ? <p className="message error">{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>
            <p className="subtitle">Only authenticated students can access this page.</p>
          </div>
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {error ? <p className="message error">{error}</p> : null}

        <div className="dashboard-grid">
          <section className="card panel">
            <h2>Your Details</h2>
            <div className="details-list">
              <p>
                <strong>Name:</strong> {student.name}
              </p>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
              <p>
                <strong>Course:</strong> {student.course}
              </p>
            </div>
          </section>

          <section className="card panel">
            <h2>Update Password</h2>
            <form className="form" onSubmit={submitPasswordUpdate}>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
              {passwordMessage ? <p className="message success">{passwordMessage}</p> : null}
              <button type="submit">Update Password</button>
            </form>
          </section>

          <section className="card panel">
            <h2>Change Course</h2>
            <form className="form" onSubmit={submitCourseUpdate}>
              <input
                type="text"
                name="course"
                placeholder="Enter new course"
                value={course}
                onChange={(event) => setCourse(event.target.value)}
                required
              />
              {courseMessage ? <p className="message success">{courseMessage}</p> : null}
              <button type="submit">Update Course</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
