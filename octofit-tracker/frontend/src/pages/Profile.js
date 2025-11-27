import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export default function Profile({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading profile...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!profile) return <div className="alert alert-info">No profile found.</div>;

  return (
    <div>
      <h2>My Profile</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{profile.user.username}</h5>
          <p className="card-text">
            <strong>Email:</strong> {profile.user.email}<br />
            <strong>Fitness Level:</strong> <span className="badge bg-primary">{profile.fitness_level}</span><br />
            <strong>Bio:</strong> {profile.bio || 'No bio added yet'}
          </p>
          <button className="btn btn-primary">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
