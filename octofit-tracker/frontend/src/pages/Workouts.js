import React, { useState, useEffect } from 'react';
import { workoutAPI } from '../services/api';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await workoutAPI.getSuggestions();
      setWorkouts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Suggested Workouts</h2>
      {workouts.length === 0 ? (
        <p>No workouts available for your fitness level.</p>
      ) : (
        <div className="row">
          {workouts.map((workout) => (
            <div key={workout.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{workout.title}</h5>
                  <p className="card-text">{workout.description}</p>
                  <p className="card-text">
                    <strong>Duration:</strong> {workout.duration_minutes} min<br />
                    <strong>Difficulty:</strong> <span className="badge bg-info">{workout.difficulty}</span>
                  </p>
                  <button className="btn btn-sm btn-success">Start Workout</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
