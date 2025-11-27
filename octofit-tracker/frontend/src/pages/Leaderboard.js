import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';

export default function Leaderboard() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardAPI.getRankings();
      setLeaderboards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Team Leaderboard</h2>
      {leaderboards.length === 0 ? (
        <p>No teams on the leaderboard yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team Name</th>
                <th>Activities</th>
                <th>Total Duration (min)</th>
                <th>Total Calories</th>
              </tr>
            </thead>
            <tbody>
              {leaderboards.map((lb) => (
                <tr key={lb.id}>
                  <td><strong>#{lb.rank}</strong></td>
                  <td>{lb.team.name}</td>
                  <td>{lb.total_activities}</td>
                  <td>{lb.total_duration_minutes}</td>
                  <td>{lb.total_calories_burned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
