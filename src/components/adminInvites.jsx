import { useEffect, useState } from 'react';
import {
    getDatesFromTimeStamp,
    getTimeStamp,
    JOIN_REQUEST,
    PENDING_INVITES, RESPOND_REQUEST
} from '../constants/constants';

const AdminInvites = () => {
    const [invites, setInvites] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem('access_token');

    const fetchInvites = async () => {
        try {
            const response = await fetch(PENDING_INVITES, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            console.log("Invites came to you for Room",data);
            setInvites(data);
        } catch (error) {
            console.error('Error fetching invites:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJoinRequests = async () => {
       try{
        const response = await fetch(JOIN_REQUEST, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        console.log("Req Join Requests",data);
           setJoinRequests(data);
    } catch (error) {
            console.error('Error fetching invites:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleRespond = async (roomId, action, requested_user) => {
        try {
            const response = await fetch(RESPOND_REQUEST(roomId), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    requested_user: requested_user,
                    action: action,
                })
            });
            const result = await response.json();
            console.log("Invites came to you for Room",result);
            alert(result.message);
            fetchInvites(); // Refresh the list
        } catch (error) {
            console.error('Error responding to invite:', error);
            alert('Failed to process request');
        }
    };

    useEffect(() => {
        fetchInvites();
        fetchJoinRequests();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Pending Requests and Invites</h2>
            {invites.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                <div className="space-y-4">
                    {invites.map((invite) => (
                        <div key={invite.created_at} className="p-4 border rounded-lg">
                            <p><strong>Room ID to join:</strong> {invite.room_id}</p>
                            <p><strong>Requested by:</strong> {invite.username}</p>
                            <p><strong>For user:</strong> {invite.created_by}</p>
                            <p><strong>Status:</strong> {invite.status}</p>
                            <p><strong>Request Sent at:</strong> {getDatesFromTimeStamp(invite.created_at)} {getTimeStamp(invite.created_at)} </p>
                            <p>{invite.created_by} sent invite to join Room {invite.room_id} </p>
                            <div className="mt-2 space-x-2">
                                <button
                                    onClick={() => handleRespond(invite.room_id, 'accept',invite.created_by)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleRespond(invite.room_id, 'reject')}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}


                </div>
            )}
            <h3 className="text-lg font-semibold mt-6 mb-2">Give Permission to Users to Join these rooms</h3>
            {joinRequests.length === 0 ? (
                <p>No pending join requests</p>
            ) : (
                <div className="space-y-4">
                    {joinRequests.map((request) => (
                        <div key={request.room_id} className="p-4 border rounded-lg">
                            <p><strong>Room ID:</strong> {request.room_id}</p>
                            <p><strong>Username:</strong> {request.username}</p>
                            <p><strong>Status:</strong> {request.status}</p>
                            <p>{request.username} asking your permission to join Room {request.room_id}</p>
                            {/* Add accept/reject buttons for join requests if needed */}
                            <div className="mt-2 space-x-2">
                                <button
                                    onClick={() => handleRespond(request.room_id, 'accept',request.created_by)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleRespond(request.room_id, 'reject')}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminInvites;