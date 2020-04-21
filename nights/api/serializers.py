from rest_framework import serializers

from .models import Title, Season, Episode, Topic, Genre, \
    Cast, ViewHit, Image, Media, Subtitle, Video, Trailer


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('id',)


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('id', 'url', 'formats', 'qualities')


class SubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtitle
        fields = ('id', 'url', 'language')


class TrailerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trailer
        fields = ('id', 'url', 'language')


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

    # noinspection PyMethodMayBeStatic
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
    image = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    subtitles = serializers.SerializerMethodField()
    trailers = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = ('id', 'name', 'plot', 'runtime', 'imdb', 'rating', 'rated', 'image',
                  'videos', 'subtitles', 'trailers', 'type', 'is_new', 'views', 'seasons',
                  'genres', 'cast', 'recommended', 'released_at', 'created_at', 'updated_at')

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

    @staticmethod
    def get_media(serializer, model, instance):
        serializer = serializer(instance.media.instance_of(model),
                                many=True, read_only=True)
        return serializer.data

    def get_image(self, instance):
        return self.get_media(ImageSerializer, Image, instance)

    def get_videos(self, instance):
        return self.get_media(VideoSerializer, Video, instance)

    def get_subtitles(self, instance):
        return self.get_media(SubtitleSerializer, Subtitle, instance)

    def get_trailers(self, instance):
        return self.get_media(TrailerSerializer, Trailer, instance)


class TitleListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = ('id', 'name', 'type', 'is_new', 'rated', 'rating', 'image',
                  'genres', 'released_at')

    # noinspection PyMethodMayBeStatic
    def get_image(self, instance):
        serializer = ImageSerializer(instance.media.instance_of(Image)[0],
                                     read_only=True)
        return serializer.data


class ViewHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewHit
        fields = ('id', 'user', 'topic', 'playback_position', 'runtime', 'hit_date')


class HistorySerializer(serializers.ModelSerializer):
    topic = TitleListSerializer(read_only=True)
    season = SeasonSerializer(read_only=True)
    episode = EpisodeSerializer(read_only=True)

    class Meta:
        model = ViewHit
        fields = ('id', 'user', 'topic', 'season', 'episode', 'playback_position', 'runtime', 'hit_date')


class HomeGenreSerializer(serializers.ModelSerializer):
    title_list = TitleListSerializer(many=True, read_only=True)

    class Meta:
        model = Genre
        fields = ('id', 'name', 'title_list')
