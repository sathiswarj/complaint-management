import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiURL = "https://complaint-management-cmqf.vercel.app";

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const response = await fetch(`${apiURL}/user-complaints`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                       credentials: 'include'
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setData(responseData);
                } else {
                    const errorMessage = await response.text();
                    setError(`Error fetching data: ${errorMessage}`);
                }
            } catch (err) {
                setError("An error occurred: " + err.message);
            }
        };

        fetchComplaints();
    }, []);

    const handleView = (id) => {
        navigate(`/admin/view-complaint/${id}`);
    };

    return (
        <div className='container'>
          { data.length > 0 ? (  
          <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Complaint</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.subject}</td>
                            <td>{item.message}</td>
                            <td>
                                <button className='btn btn-info' onClick={() => handleView(item._id)}>
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ) : ( <p>No complaints found</p>)}
        </div>
    );
};

export default AdminPage;
