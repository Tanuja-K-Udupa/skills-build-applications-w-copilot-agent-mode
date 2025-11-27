import React from 'react';

export default function Home({ user }) {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="jumbotron">
          <h1 className="display-4">Welcome to OctoFit Tracker! 🐙</h1>
          <p className="lead">Track your fitness journey, build a community, and compete on the leaderboard.</p>
          <hr className="my-4" />
          <p>
            Start logging your activities, join teams, and get personalized workout suggestions based on your fitness level.
          </p>
        </div>

        <div className="row mt-5">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">📊 Log Activities</h5>
                <p className="card-text">Record your running, cycling, swimming, and strength training sessions.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">👥 Join Teams</h5>
                <p className="card-text">Create or join teams to compete and support each other in your fitness goals.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">🏋️ Get Workouts</h5>
                <p className="card-text">Receive personalized workout suggestions based on your fitness level.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">🏆 Leaderboard</h5>
                <p className="card-text">Compete with teams and track progress on the global leaderboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
