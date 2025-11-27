import React, { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamAPI.getTeams();
      setTeams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Teams</h2>
      {teams.length === 0 ? (
        <p>No teams available. Create one to get started!</p>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">{team.description}</p>
                  <p className="card-text"><small className="text-muted">Members: {team.member_count}</small></p>
                  <button className="btn btn-sm btn-primary">View Team</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
