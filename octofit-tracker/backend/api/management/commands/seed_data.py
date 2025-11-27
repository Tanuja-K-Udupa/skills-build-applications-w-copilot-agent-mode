from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, Team, Activity, Workout, Leaderboard
from datetime import datetime, timedelta
import json


class Command(BaseCommand):
    help = 'Seed the database with sample data for OctoFit Tracker'

    def handle(self, *args, **options):
        # Create test users
        users = []
        for i in range(1, 4):
            user, created = User.objects.get_or_create(
                username=f'user{i}',
                defaults={
                    'email': f'user{i}@octofit.com',
                    'first_name': f'User',
                    'last_name': f'{i}',
                }
            )
            users.append(user)
            
            # Create user profile
            UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'fitness_level': ['beginner', 'intermediate', 'advanced'][i-1],
                    'bio': f'I am user {i} and love fitness!',
                }
            )
        
        # Create teams
        team1, _ = Team.objects.get_or_create(
            name='Octopus Warriors',
            defaults={
                'description': 'A team of fitness enthusiasts',
                'created_by': users[0],
            }
        )
        team1.members.set(users)
        
        team2, _ = Team.objects.get_or_create(
            name='Code Runners',
            defaults={
                'description': 'Tech team that runs for fitness',
                'created_by': users[1],
            }
        )
        team2.members.set([users[1], users[2]])
        
        # Create sample activities
        activity_types = ['running', 'cycling', 'swimming', 'strength', 'yoga']
        base_date = datetime.now().date()
        
        for user in users:
            for i in range(5):
                Activity.objects.get_or_create(
                    user=user,
                    date=base_date - timedelta(days=i),
                    activity_type=activity_types[i % len(activity_types)],
                    defaults={
                        'duration_minutes': 30 + (i * 10),
                        'distance_km': 5.0 if activity_types[i % len(activity_types)] in ['running', 'cycling'] else None,
                        'calories_burned': 200 + (i * 50),
                        'notes': f'Great {activity_types[i % len(activity_types)]} session!',
                        'team': team1 if user in team1.members.all() else None,
                    }
                )
        
        # Create sample workouts
        workouts_data = [
            {
                'title': 'Morning Jog',
                'description': 'Easy morning jog to start the day',
                'difficulty': 'easy',
                'duration_minutes': 30,
                'for_fitness_level': 'beginner',
                'exercises': json.dumps(['5 min warm-up', '20 min jog', '5 min cool-down']),
            },
            {
                'title': 'HIIT Workout',
                'description': 'High intensity interval training',
                'difficulty': 'hard',
                'duration_minutes': 45,
                'for_fitness_level': 'advanced',
                'exercises': json.dumps(['10 min warm-up', '30 min HIIT', '5 min cool-down']),
            },
            {
                'title': 'Yoga Flow',
                'description': 'Relaxing yoga session',
                'difficulty': 'easy',
                'duration_minutes': 60,
                'for_fitness_level': 'beginner',
                'exercises': json.dumps(['Sun salutations', 'Standing poses', 'Seated poses', 'Savasana']),
            },
            {
                'title': 'Strength Training',
                'description': 'Full body strength workout',
                'difficulty': 'medium',
                'duration_minutes': 50,
                'for_fitness_level': 'intermediate',
                'exercises': json.dumps(['Warm-up', 'Upper body', 'Lower body', 'Core']),
            },
        ]
        
        for workout_data in workouts_data:
            Workout.objects.get_or_create(
                title=workout_data['title'],
                defaults=workout_data
            )
        
        # Create leaderboards
        for team in [team1, team2]:
            activities = Activity.objects.filter(team=team)
            total_activities = activities.count()
            total_duration = sum(a.duration_minutes for a in activities)
            total_calories = sum(a.calories_burned or 0 for a in activities)
            
            Leaderboard.objects.get_or_create(
                team=team,
                defaults={
                    'total_activities': total_activities,
                    'total_duration_minutes': total_duration,
                    'total_calories_burned': total_calories,
                }
            )
        
        # Create superuser
        User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@octofit.com',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded database with sample data!'))
