from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Team, Activity, Workout, Leaderboard


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'avatar', 'fitness_level', 'created_at', 'updated_at']


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model"""
    created_by = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_by', 'members', 'member_count', 'created_at', 'updated_at']

    def get_member_count(self, obj):
        return obj.members.count()


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model"""
    user = UserSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(),
        source='team',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Activity
        fields = [
            'id', 'user', 'activity_type', 'duration_minutes', 'distance_km',
            'calories_burned', 'notes', 'team_id', 'date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.team:
            data['team'] = instance.team.id
        return data


class WorkoutSerializer(serializers.ModelSerializer):
    """Serializer for Workout model"""
    class Meta:
        model = Workout
        fields = [
            'id', 'title', 'description', 'difficulty', 'duration_minutes',
            'exercises', 'for_fitness_level', 'created_at', 'updated_at'
        ]


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for Leaderboard model"""
    team = TeamSerializer(read_only=True)

    class Meta:
        model = Leaderboard
        fields = ['id', 'team', 'total_activities', 'total_duration_minutes', 'total_calories_burned', 'rank', 'updated_at']
