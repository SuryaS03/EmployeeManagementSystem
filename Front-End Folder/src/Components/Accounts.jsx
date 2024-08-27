import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Accounts.css'; // Import your custom CSS file

const Accounts = () => {
    const [categories, setCategories] = useState([]);
    const [employeeCounts, setEmployeeCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoryResult = await axios.get('http://localhost:3000/auth/category');
                if (categoryResult.data.Status) {
                    setCategories(categoryResult.data.Result);
                } else {
                    setError(categoryResult.data.Error);
                }

                // Fetch employee counts
                const countResult = await axios.get('http://localhost:3000/auth/categorycount');
                if (countResult.data.Status) {
                    setEmployeeCounts(countResult.data.Result);
                } else {
                    setError(countResult.data.Error);
                }
            } catch (err) {
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-5"><p>Loading...</p></div>;
    if (error) return <div className="text-center mt-5"><p className="text-danger">Error: {error}</p></div>;

    const employeeCountMap = employeeCounts.reduce((map, item) => {
        map[item.category_name] = item.employee_count;
        return map;
    }, {});

    return (
        <div className='container mt-4'>
            <div className='text-center mb-4'>
                <h3>Category and Employee List</h3>
            </div>

            <div className='table-responsive'>
                <table className='table table-striped table-bordered'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Category ID</th>
                            <th>Category Name</th>
                            <th>Employee Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.name}</td>
                                <td>{employeeCountMap[c.name] || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Accounts;
