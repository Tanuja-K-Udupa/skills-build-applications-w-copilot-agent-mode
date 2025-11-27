from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from django.db.models import Sum, Count
from .models import UserProfile, Team, Activity, Workout, Leaderboard
from .serializers import (
    UserSerializer, UserProfileSerializer, TeamSerializer,
    ActivitySerializer, WorkoutSerializer, LeaderboardSerializer
)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for User model"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for UserProfile model"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own profile
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        try:
            profile = request.user.profile
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


class TeamViewSet(viewsets.ModelViewSet):
    """ViewSet for Team model"""
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add a member to the team"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'detail': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            team.members.add(user)
            return Response({'detail': 'Member added successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Remove a member from the team"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'detail': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            team.members.remove(user)
            return Response({'detail': 'Member removed successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class ActivityViewSet(viewsets.ModelViewSet):
    """ViewSet for Activity model"""
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own activities
        if self.request.user.is_staff:
            return Activity.objects.all()
        return Activity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_activities(self, request):
        """Get current user's activities"""
        activities = Activity.objects.filter(user=request.user).order_by('-date')
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get current user's activity statistics"""
        activities = Activity.objects.filter(user=request.user)
        stats = {
            'total_activities': activities.count(),
            'total_duration': activities.aggregate(Sum('duration_minutes'))['duration_minutes__sum'] or 0,
            'total_calories': activities.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            'total_distance': activities.aggregate(Sum('distance_km'))['distance_km__sum'] or 0,
        }
        return Response(stats)

    @action(detail=False, methods=['get'])
    def team_activities(self, request):
        """Get all team activities"""
        team_id = request.query_params.get('team_id')
        if not team_id:
            return Response({'detail': 'team_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        activities = Activity.objects.filter(team_id=team_id).order_by('-date')
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)


class WorkoutViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Workout model"""
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """Get workout suggestions based on user's fitness level"""
        try:
            user_profile = request.user.profile
            workouts = Workout.objects.filter(for_fitness_level=user_profile.fitness_level)
            serializer = self.get_serializer(workouts, many=True)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Leaderboard model"""
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def rankings(self, request):
        """Get leaderboard rankings"""
        leaderboards = Leaderboard.objects.all().order_by('-total_duration_minutes')
        
        # Assign ranks
        for index, lb in enumerate(leaderboards, 1):
            lb.rank = index
            lb.save()

        serializer = self.get_serializer(leaderboards, many=True)
        return Response(serializer.data)

