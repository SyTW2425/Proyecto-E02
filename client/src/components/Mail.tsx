import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import NavBar from './NavBar';
import '../styles/Mail.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TradeRequest {
  _id: string;
  requesterUserId: string;
  requesterCardId: string;
  targetUserId: string;
  targetCardId: string;
  message: string;
}

const Mail = () => {
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const userId = localStorage.getItem('id_usuario');

  useEffect(() => {
    const fetchTradeRequests = async () => {
      try {
        const response = await api.get(`/users/${userId}/mailbox`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTradeRequests(response.data.mailbox);
      } catch (error) {
        console.error('Error fetching trade requests:', error);
      }
    };

    fetchTradeRequests();
  }, [userId]);

  const handleAccept = async (requestId: string) => {
    try {
      await api.post(`/users/${userId}/mailbox/${requestId}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTradeRequests(tradeRequests.filter(request => request._id !== requestId));
      toast.success('Trade request accepted successfully!');
    } catch (error) {
      console.error('Error accepting trade request:', error);
      toast.error('Error accepting trade request.');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await api.post(`/users/${userId}/mailbox/${requestId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTradeRequests(tradeRequests.filter(request => request._id !== requestId));
      toast.success('Trade request rejected successfully!');
    } catch (error) {
      console.error('Error rejecting trade request:', error);
      toast.error('Error rejecting trade request.');
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Buzón de mensajes</h1>
      {tradeRequests.length === 0 ? (
        <p>No hay solicitudes de intercambio.</p>
      ) : (
        <ul className="trade-requests-list">
          {tradeRequests.map((request) => (
            <li key={request._id} className="trade-request-item">
              <p>{request.message}</p>
              <button onClick={() => handleAccept(request._id)}>Aceptar</button>
              <button onClick={() => handleReject(request._id)}>Rechazar</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/home">Volver al inicio</Link>
    </div>
  );
};

export default Mail;