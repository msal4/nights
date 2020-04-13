from rest_framework import serializers

from .models import Title, Season, Episode, Topic, Genre, Cast, ViewHit


class CastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cast
        fields = ('id', 'name')


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name')


class EpisodeSerializer(serializers.ModelSerializer):
    views = serializers.SerializerMethodField()

    class Meta:
        model = Episode
        fields = ('id', 'name', 'plot', 'runtime', 'index', 'views')

    def get_views(self, title):
        return title.hits.count()


class SeasonSerializer(serializers.ModelSerializer):
    episodes = EpisodeSerializer(many=True, read_only=True)

    class Meta:
        model = Season
        fields = ('id', 'name', 'index', 'episodes', 'released_at')


class TitleSerializer(serializers.ModelSerializer):
    seasons = SeasonSerializer(many=True, read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    cast = CastSerializer(many=True, read_only=True)
    views = serializers.SerializerMethodField()
    recommended = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = ('id', 'name', 'plot', 'runtime', 'imdb', 'rating', 'rated',
                  'type', 'is_new', 'views', 'seasons', 'genres', 'cast', 'recommended',
                  'released_at', 'created_at', 'updated_at')

    # noinspection PyMethodMayBeStatic
    def get_views(self, title):
        return title.hits.count()

    # noinspection PyMethodMayBeStatic
    def get_recommended(self, title):
        genres = title.genres.all()
        titles = Title.objects.filter(genres__in=genres)
        ordered_titles = titles.order_by('-created_at').exclude(pk=title.id).distinct()[:5]
        serializer = TitleListSerializer(ordered_titles, many=True, read_only=True)
        return serializer.data


class TitleListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Title
        fields = ('id', 'name', 'type', 'is_new', 'genres', 'released_at')


class ViewHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewHit
        fields = ('id', 'user', 'topic', 'playback_position', 'runtime', 'hit_date')


class HomeGenreSerializer(serializers.ModelSerializer):
    title_list = TitleListSerializer(many=True, read_only=True)

    class Meta:
        model = Genre
        fields = ('id', 'name', 'title_list')
