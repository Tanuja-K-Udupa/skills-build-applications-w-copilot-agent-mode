// API Service for OctoFit Tracker
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Utility function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API Error');
  }

  return response.json();
};

// User APIs
export const userAPI = {
  getUsers: () => apiCall('/users/'),
  getUser: (id) => apiCall(`/users/${id}/`),
  getProfile: () => apiCall('/profiles/me/'),
  updateProfile: (data) => apiCall('/profiles/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

// Team APIs
export const teamAPI = {
  getTeams: () => apiCall('/teams/'),
  getTeam: (id) => apiCall(`/teams/${id}/`),
  createTeam: (data) => apiCall('/teams/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTeam: (id, data) => apiCall(`/teams/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  addMember: (teamId, userId) => apiCall(`/teams/${teamId}/add_member/`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  }),
  removeMember: (teamId, userId) => apiCall(`/teams/${teamId}/remove_member/`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  }),
};

// Activity APIs
export const activityAPI = {
  getActivities: () => apiCall('/activities/'),
  getActivity: (id) => apiCall(`/activities/${id}/`),
  createActivity: (data) => apiCall('/activities/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateActivity: (id, data) => apiCall(`/activities/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteActivity: (id) => apiCall(`/activities/${id}/`, {
    method: 'DELETE',
  }),
  getMyActivities: () => apiCall('/activities/my_activities/'),
  getStats: () => apiCall('/activities/stats/'),
  getTeamActivities: (teamId) => apiCall(`/activities/team_activities/?team_id=${teamId}`),
};

// Workout APIs
export const workoutAPI = {
  getWorkouts: () => apiCall('/workouts/'),
  getWorkout: (id) => apiCall(`/workouts/${id}/`),
  getSuggestions: () => apiCall('/workouts/suggestions/'),
};

// Leaderboard APIs
export const leaderboardAPI = {
  getLeaderboards: () => apiCall('/leaderboard/'),
  getRankings: () => apiCall('/leaderboard/rankings/'),
};

// Auth APIs
export const authAPI = {
  login: (username, password) => apiCall('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  logout: () => apiCall('/auth/logout/', {
    method: 'POST',
  }),
  getUser: () => apiCall('/auth/user/'),
};
