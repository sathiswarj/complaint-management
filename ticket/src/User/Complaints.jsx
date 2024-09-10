import React, { useEffect, useState } from 'react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiURL = "https://complaint-management-one.vercel.app/";

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No complaints found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${apiURL}/my-complaints`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setComplaints(data);
        } else {
          setError('Failed to fetch complaints');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>My Complaints</h2>
      {complaints.length > 0 ? (
        <ul>
          {complaints.map((complaint) => (
            <li key={complaint._id}>
              <h3>{complaint.subject}</h3>
              <p>{complaint.message}</p>
              <small>{new Date(complaint.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
};

export default Complaints;
