from django.contrib import admin
from .models import UserProfile, Team, Activity, Workout, Leaderboard


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'fitness_level', 'created_at')
    list_filter = ('fitness_level', 'created_at')
    search_fields = ('user__username', 'user__email')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'member_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'created_by__username')

    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = 'Members'


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'date', 'duration_minutes', 'calories_burned')
    list_filter = ('activity_type', 'date', 'created_at')
    search_fields = ('user__username', 'activity_type')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'for_fitness_level', 'duration_minutes')
    list_filter = ('difficulty', 'for_fitness_level', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('team', 'rank', 'total_activities', 'total_duration_minutes', 'total_calories_burned')
    list_filter = ('updated_at',)
    search_fields = ('team__name',)
    readonly_fields = ('updated_at',)

