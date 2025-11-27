import React, { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activityAPI.getMyActivities();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>My Activities</h2>
      {activities.length === 0 ? (
        <p>No activities yet. Start logging your workouts!</p>
      ) : (
        <div className="row">
          {activities.map((activity) => (
            <div key={activity.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{activity.activity_type.toUpperCase()}</h5>
                  <p className="card-text">
                    <strong>Duration:</strong> {activity.duration_minutes} min<br />
                    {activity.distance_km && <><strong>Distance:</strong> {activity.distance_km} km<br /></>}
                    <strong>Calories:</strong> {activity.calories_burned || 'N/A'}<br />
                    <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
                  </p>
                  {activity.notes && <p className="card-text"><em>{activity.notes}</em></p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
