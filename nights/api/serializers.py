from rest_framework import serializers

from .models import Title, Season, Episode, Topic, Genre, Cast, ViewHit


class CastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cast
        fields = ('name', 'created_at')


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('name', 'created_at')


class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = '__all__'


class SeasonSerializer(serializers.ModelSerializer):
    episodes = EpisodeSerializer(many=True, read_only=True)

    class Meta:
        model = Season
        fields = ('name', 'index', 'episodes', 'released_at')


class TitleSerializer(serializers.ModelSerializer):
    seasons = SeasonSerializer(many=True, read_only=True)
    views = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = ('id', 'name', 'plot', 'runtime', 'imdb', 'rating', 'rated',
                  'type', 'is_new', 'views', 'seasons', 'genres', 'cast', 'released_at', 'created_at', 'updated_at')

    def get_views(self, title):
        return title.hits.count()


class TitleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        fields = ['id', 'name', 'type', 'is_new', 'released_at']


class ViewHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewHit
        fields = ('user', 'topic', 'playback_position', 'runtime', 'hit_date')
