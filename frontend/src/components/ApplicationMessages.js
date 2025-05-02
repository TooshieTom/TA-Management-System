import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const ApplicationMessages = ({ applicationId, userType }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/messages/${applicationId}`);
            setMessages(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
            setLoading(false);
        }
    }, [applicationId]);

    const markMessagesAsRead = useCallback(async () => {
        try {
            await axios.put(`http://localhost:8080/api/messages/${applicationId}/read`, null, {
                params: { recipientType: userType }
            });
        } catch (err) {
            console.error("Failed to mark messages as read:", err);
        }
    }, [applicationId, userType]);

    useEffect(() => {
        // Fetch messages
        fetchMessages();

        // Mark messages as read
        markMessagesAsRead();

        // Time interval that checks for new messages
        const interval = setInterval(fetchMessages, 10000);

        // Clear interval
        return () => clearInterval(interval);
    }, [applicationId, fetchMessages, markMessagesAsRead]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('http://localhost:8080/api/messages/send', null, {
                params: {
                    applicationId,
                    content: newMessage,
                    senderType: userType
                }
            });
            setNewMessage('');
            // Refresh the messages after sending
            fetchMessages();
        } catch (err) {
            console.error("Failed to send message:", err);
            alert("Failed to send message. Please try again.");
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    if (loading) return <p>Loading messages...</p>;

    return (
        <div style={{ marginTop: '2rem' }}>
            <div
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    height: '250px',
                    overflowY: 'auto',
                    padding: '10px',
                    marginBottom: '2rem',
                    backgroundColor: '#fafafa'
                }}
            >
                {messages.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'grey', marginTop: '10px' }}>
                        No messages yet. Start a conversation!
                    </p>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.messageId}
                            style={{
                                textAlign: message.senderType === userType ? 'right' : 'left',
                                marginBottom: '10px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: message.senderType === userType ? '#77dd77' : '#f1f0f0',
                                    borderRadius: '10px',
                                    padding: '8px 12px',
                                    maxWidth: '70%',
                                    wordBreak: 'break-word'
                                }}
                            >
                                <p style={{ margin: '0', fontSize: '14px' }}>{message.content}</p>
                                <span style={{ fontSize: '8px', color: 'grey', display: 'block', textAlign: 'right' }}>
                                    {formatDate(message.sentTime)} - {message.senderType === 'FACULTY' ? 'Faculty' : 'Student'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex'}}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' }}
                />
                <button type="submit" style={{ marginLeft: '16px', padding: '8px 16px', borderRadius: '10px' }}>Send</button>
            </form>
        </div>
    );
};

export default ApplicationMessages;