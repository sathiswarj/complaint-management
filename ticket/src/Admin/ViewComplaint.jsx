import React, { useState, useEffect } from 'react';
import { useParams , useNavigate} from 'react-router-dom';

const ViewComplaint = () => {
    const { id } = useParams();
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [category, setCategory] = useState('');
    const apiURL = "https://complaint-management-cmqf.vercel.app";
    const navigate = useNavigate()

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const response = await fetch(`${apiURL}/complaint/${id}`, {
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
                    setCategory(responseData.category || '');
                } else {
                    const errorMessage = await response.text();
                    setError(`Error fetching data: ${errorMessage}`);
                }
            } catch (err) {
                setError("An error occurred: " + err.message);
            }
        };

        fetchItem();
    }, [id]);

    const deleteCategory = async () => {
        if(window.confirm("Are you sure want to delete?")){
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const response = await fetch(`${apiURL}/complaint/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                const updatedData = await response.json();
                setData(updatedData);
                navigate('/admin/panel')
            } else {
                const errorMessage = await response.text();
                setError(`Error updating data: ${errorMessage}`);
            }
        } catch (err) {
            setError("An error occurred: " + err.message);
        }
    }
    };


    const updateCategory = async (e) => {
        e.preventDefault();
         try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const response = await fetch(`${apiURL}/complaint/${id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category })
            });

            if (response.ok) {
                const updatedData = await response.json();
                setData(updatedData);
            } else {
                const errorMessage = await response.text();
                setError(`Error updating data: ${errorMessage}`);
            }
        } catch (err) {
            setError("An error occurred: " + err.message);
        }
    
    };

    return (
        <>
            <h2>View Complaint</h2>
            {error && <p>{error}</p>}
            {data ? (
                <div className='container'>
                    <div className='form-group col-md-4'>
                        <h4><strong>Name:</strong> {data.name}</h4>
                    </div>
                    <div className='form-group col-md-4'>
                        <h4><strong>Email:</strong> {data.email}</h4>
                    </div>

                    <div className='form-group col-md-4'>
                        <h4><strong>Subject:</strong> {data.subject}</h4>

                    </div>

                    <div className='form-group col-md-4'>

                        <h4><strong>Complaint:</strong> {data.message}</h4>
                    </div>
                    <div className='form-group col-md-4'>

                        <h4><strong>Category:</strong> {data.category}</h4>
                    </div>
                    <div className='form-group col-md-4'>
                        <label htmlFor='category'>Category</label>
                        <select
                            id='category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select category</option>
                            <option value="Held">Held</option>
                            <option value="Cleared">Cleared</option>
                        </select>
                    </div>
                    <div className='form-group col-md-6'>
                    <button type="submit" onClick={updateCategory} className='btn btn-success'>Submit</button>
                </div>
                <div className='form-group col-md-6'>
                    <button  onClick={() => deleteCategory(data._id)} className='btn btn-danger'>Delete</button>
                </div>
                </div>
            ) : (
                <p>Loading complaint details...</p>
            )}
        </>
    );
}

export default ViewComplaint;
