import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/booking.css';
import {useHistory} from "react-router-dom";
import jwtDecode from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';


function BookingComponent() {
    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {


        if (!accessToken) {
            // Redirect to login page or handle unauthorized access
            history.push('/');
        }
        else {
            try {
                const decodedToken = jwtDecode(accessToken);
                const expirationTime = decodedToken.exp * 1000;
                if (Date.now() >= expirationTime) {
                    history.push('/');
                }
            }
            catch (e) {
                history.push('/');
            }
        }
        // ... Perform any other operations with the JWT token
    }, [accessToken,history]);

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listbooking, setBooking] = useState([]);
    const [updatedStatus, setUpdatedStatus] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError(null);
        setBooking([]);

        try {
            const response = await axios.get(
                `http://localhost:8083/api/v1/bookings/customer/${email}/pending`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Corrected string interpolation
                    },
                }
            );
            const bookings = response.data;
            setBooking(bookings);
            if (response.data.length === 0) {
                setError('No booking found.');
                alert('No booking found.')
            }
            console.log(response.data);
        } catch (error) {
            setError('Error fetching booking. Please try again.');
            console.error('Error fetching booking:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleStatusChange = (event, bookingId) => {
        const { value } = event.target;
        setUpdatedStatus((prevState) => ({
            ...prevState,
            [bookingId]: value,
        }));
    };

    const handleUpdateStatus = async (bookingId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(
                `http://localhost:8083/api/v1/bookings/booking/${bookingId}/status`,
                {
                    status: updatedStatus[bookingId],
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
            alert(response.data);
            // Fetch the updated list of bookings
            const bookingsResponse = await axios.get(
                `http://localhost:8083/api/v1/bookings/customer/${email}/pending`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const bookings = bookingsResponse.data;
            setBooking(bookings);
        }
        catch (error) {
            setError('Error updating status. Please try again.');
            console.error('Error updating status:', error);
        }
        finally{
            setLoading(false);
        }
    }

    const handleRowClick = (booking) => {
        setSelectedBooking(booking);
    }
    return (
        <div>
            <h2>Find booking of customer</h2>
            <form onSubmit={handleSubmit} className="search-form">
                <label>
                    Email:
                    <input type="text" value={email} onChange={handleEmailChange} className="email-input"/>
                </label>
                <button type="submit">Fetch Booking</button>
            </form>

            {loading && <div>Loading...</div>}
            {error && <div>{error && listbooking.length === 0}</div> }
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th>Booking ID</th>
                        <th>Create date</th>
                        <th>Phone</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Status option</th>
                        <th>Action </th>
                    </tr>
                </thead>
                <tbody>
                    {listbooking.map((booking) => (
                        <tr key={booking.id} onClick={() => handleRowClick(booking)}>
                            <td>{booking.id}</td>
                            <td>{booking.createDate}</td>
                            <td>{booking.customer.phone}</td>
                            <td>{booking.customer.name}</td>
                            <td>{booking.status}</td>
                            <td>
                                <select value={updatedStatus[booking.id] || booking.status}
                                        onChange={(event) =>  handleStatusChange(event, booking.id)}>
                                    <option>pending</option>
                                    <option>confirmed</option>
                                    <option>paid</option>
                                    <option>cancelled</option>
                                </select>
                            </td>
                            <td>
                                <button type="button" className="btn btn-primary" onClick={() => handleUpdateStatus(booking.id)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedBooking && (
                <div>
                    <h3>Select Booking Id: {selectedBooking.id}</h3>
                    {selectedBooking.bookedTableList.map((bookedTable)=> (
                        <div key={bookedTable.id}>
                            <p>Table: {bookedTable.table.name}</p>
                            <p>Capacity: {bookedTable.table.capacity}</p>
                            <ul>
                                {bookedTable.detailFoodList.map((detailFood) => (
                                    <li key={detailFood.id}>
                                        <p>Food: {detailFood.food.name}</p>
                                        <p>Quantity: {detailFood.quantity}</p>
                                        <p>Price: {detailFood.price}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default BookingComponent;
