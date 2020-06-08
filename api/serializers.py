from pprint import pprint

from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from rest_framework import serializers

from .documents import TitleDocument
from .models import Title, Season, Episode, Topic, Genre, Cast, ViewHit, \
    Image, Media, Subtitle, Video, Trailer, LandingPromo, Provider
from .types import media_types
from . import helpers


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('url',)


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('url', 'formats', 'qualities')


class SubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtitle
        fields = ('url', 'language', 'formats')


class TrailerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trailer
        fields = ('url', 'formats')


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
    images = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    subtitles = serializers.SerializerMethodField()
    hits = serializers.SerializerMethodField()

    class Meta:
        model = Episode
        fields = ('id', 'name', 'plot', 'runtime', 'images', 'videos',
                  'subtitles', 'hits', 'index', 'views')

    # noinspection PyMethodMayBeStatic
    def get_views(self, title):
        return title.hits.count()

    @staticmethod
    def get_media(serializer, model, instance):
        serializer = serializer(instance.media.instance_of(model),
                                many=True, read_only=True)
        return serializer.data

    def get_images(self, instance):
        return self.get_media(ImageSerializer, Image, instance)

    def get_videos(self, instance):
        return self.get_media(VideoSerializer, Video, instance)

    def get_subtitles(self, instance):
        return self.get_media(SubtitleSerializer, Subtitle, instance)

    def get_hits(self, instance):
        user = self.context['request'].user
        if not user.is_anonymous:
            hits = user.viewhit_set.filter(topic_id=instance.id)
            print(hits)
            return HistorySerializer(hits, many=True, read_only=True).data
        return None


class SeasonSerializer(serializers.ModelSerializer):
    episodes = EpisodeSerializer(many=True)

    class Meta:
        model = Season
        fields = ('id', 'name', 'index', 'episodes', 'released_at')


class SeasonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ('id', 'name', 'index', 'released_at')


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = "__all__"


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"


class MediaSerializer(serializers.ModelSerializer):
    topic = TopicSerializer(read_only=True)
    provider = ProviderSerializer(read_only=True)

    class Meta:
        model = Media
        fields = "__all__"


class TitleSerializer(serializers.ModelSerializer):
    seasons = SeasonListSerializer(many=True)
    genres = GenreSerializer(many=True)
    cast = CastSerializer(many=True)
    media = MediaSerializer(write_only=True, many=True)
    views = serializers.SerializerMethodField()
    recommended = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    subtitles = serializers.SerializerMethodField()
    trailers = serializers.SerializerMethodField()

    def create(self, validated_data, instance=None):
        seasons = validated_data.pop("seasons")
        genres_data = validated_data.pop("genres")
        cast_data = validated_data.pop("cast")
        media = validated_data.pop("media")
        title = instance or Title.objects.create(**validated_data)

        title.genres.set([helpers.get_or_create(Genre.objects.all(), **item)
                          for item in genres_data])

        for item in media:
            if item["type"] in media_types:
                MediaType = media_types[item["type"]]
                title.media.add(helpers.get_or_create(
                    MediaType.objects.all(), topic=title, **item))

        title.cast.set([helpers.get_or_create(title.cast, **item)
                        for item in cast_data])

        for season_data in seasons:
            season = helpers.get_or_create(title.seasons, **season_data)
            if "episodes" in season_data:
                episodes = season_data.pop('episodes')
                for episode_data in episodes:
                    episode = helpers.get_or_create(
                        season.episodes, **episode_data)

        return title

    def update(self, instance, validated_data):
        return self.create(validated_data=validated_data, instance=instance)

    class Meta:
        model = Title
        fields = ('id', 'name', 'plot', 'runtime', 'imdb', 'rating', 'rated', 'images',
                  'videos', 'subtitles', 'trailers', 'media', 'type', 'is_new', 'views', 'seasons',
                  'genres', 'cast', 'recommended', 'released_at', 'created_at', 'updated_at')

    # noinspection PyMethodMayBeStatic
    def get_views(self, title):
        return title.hits.count()

    # noinspection PyMethodMayBeStatic
    def get_recommended(self, title):
        genres = title.genres.all()
        titles = Title.objects.filter(genres__in=genres)
        ordered_titles = titles.order_by(
            '-created_at').exclude(pk=title.id).distinct()[: 5]
        serializer = TitleListSerializer(
            ordered_titles, many=True, read_only=True)
        return serializer.data

    @staticmethod
    def get_media(serializer, model, instance):
        serializer = serializer(instance.media.instance_of(model),
                                many=True, read_only=True)
        return serializer.data

    def get_images(self, instance):
        return self.get_media(ImageSerializer, Image, instance)

    def get_videos(self, instance):
        return self.get_media(VideoSerializer, Video, instance)

    def get_subtitles(self, instance):
        return self.get_media(SubtitleSerializer, Subtitle, instance)

    def get_trailers(self, instance):
        return self.get_media(TrailerSerializer, Trailer, instance)


class TitleListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = ('id', 'name', 'type', 'is_new', 'rated', 'rating', 'runtime', 'images',
                  'genres', 'released_at')

    # noinspection PyMethodMayBeStatic
    def get_images(self, instance):
        serializer = ImageSerializer(instance.media.instance_of(Image),
                                     many=True, read_only=True)
        return serializer.data


class ViewHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewHit
        fields = ('id', 'user', 'topic', 'playback_position',
                  'season', 'episode', 'runtime', 'hit_date')


class SimpleEpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ('id', 'name', 'index')


class HistorySerializer(serializers.ModelSerializer):
    topic = TitleListSerializer(read_only=True)
    episode = SimpleEpisodeSerializer(read_only=True)

    class Meta:
        model = ViewHit
        fields = ('id', 'user', 'topic', 'season', 'episode',
                  'playback_position', 'runtime', 'hit_date')


class TitleGenreSerializer(serializers.ModelSerializer):
    title_list = TitleListSerializer(many=True, read_only=True)

    class Meta:
        model = Genre
        fields = ('id', 'name', 'title_list')


class LandingPromoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPromo
        fields = '__all__'
