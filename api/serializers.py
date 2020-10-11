from pprint import pprint

from rest_framework import serializers, pagination
from django.utils import timezone

from .models import Title, Season, Episode, Topic, Genre, Cast, ViewHit, \
    Media, LandingPromo, Provider, NewsStory, Comment, Like
from . import helpers
from django.contrib.auth.models import User


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('url',)


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('url', 'formats', 'qualities')


class SubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('url', 'language', 'formats')


class TrailerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('url', 'formats')


class CastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cast
        fields = ('id', 'name')


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name')


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('id', 'url', 'type', 'formats', 'qualities', 'language')


class EpisodeSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, write_only=True)
    views = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    subtitles = serializers.SerializerMethodField()
    hits = serializers.SerializerMethodField()

    class Meta:
        model = Episode
        fields = ('id', 'name', 'plot', 'image', 'runtime', 'images', 'videos',
                  'media', 'subtitles', 'hits', 'index', 'views')

    # noinspection PyMethodMayBeStatic
    def get_views(self, instance):
        return instance.hits.count()

    @staticmethod
    def get_media(serializer, type, instance):
        return serializer(instance.media.filter(type=type),
                          many=True, read_only=True).data

    def get_images(self, instance):
        return self.get_media(ImageSerializer, 'image', instance)

    def get_videos(self, instance):
        return self.get_media(VideoSerializer, 'video', instance)

    def get_subtitles(self, instance):
        return self.get_media(SubtitleSerializer, 'subtitle', instance)

    def get_hits(self, instance):
        if 'request' in self.context:
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


class TitleCreateSerializer(serializers.ModelSerializer):
    seasons = SeasonSerializer(write_only=True, many=True)
    genres = GenreSerializer(many=True)
    cast = CastSerializer(many=True)
    media = MediaSerializer(many=True)

    def create(self, validated_data, instance=None):
        seasons_data = validated_data.pop("seasons")
        genres_data = validated_data.pop("genres")
        cast_data = validated_data.pop("cast")
        media_data = validated_data.pop("media")
        name = validated_data.pop("name")
        released_at = validated_data.pop(
            "released_at") if "released_at" in validated_data else None

        # Create or get the title instance
        queryset = Title.objects.order_by("-created_at")
        if not instance:
            print('no instance')
            if not released_at:
                print('no released_at')
                title = helpers.get_or_create(queryset, name=name)
            else:
                print('name and released_at')
                title = helpers.get_or_create(queryset, name=name,
                                              released_at=released_at)
        else:
            title = instance

        # Update title
        helpers.update_object(title, **validated_data)

        title.genres.set([helpers.get_or_create(Genre.objects.order_by("-created_at"), **item)
                          for item in genres_data])

        # Update the media with their respective types
        for item in media_data:
            helpers.get_or_create(title.media, topic=title, **item)

        title.cast.set([helpers.get_or_create(title.cast.order_by("-created_at"), **item)
                        for item in cast_data])

        # Update or add seasons and episodes
        for season_data in seasons_data:
            episodes = season_data.pop(
                'episodes') if 'episodes' in season_data else []
            season_index = season_data.pop("index")
            # Get or create
            season = helpers.get_or_create(
                title.seasons.order_by("-created_at"), index=season_index,
                series=title)
            # Update
            helpers.update_object(season, **season_data)

            if season.episodes.count() > len(episodes):
                title.updated_at = timezone.now()

            for episode_data in episodes:
                episode_index = episode_data.pop("index")
                media_data = episode_data.pop('media')
                episode = helpers.get_or_create(
                    season.episodes.order_by("-created_at"),
                    index=episode_index, episode_season=season)

                media = [helpers.get_or_create(
                    episode.media, **m) for m in media_data]
                episode.media.set(media)
                helpers.update_object(episode, **episode_data)

        return title

    def update(self, instance, validated_data):
        return self.create(validated_data=validated_data, instance=instance)

    class Meta:
        model = Title
        fields = ('id', 'name', 'plot', 'runtime', 'imdb', 'rating', 'rated',
                  'type', 'seasons', 'genres', 'featured_at', 'is_coming_soon', 'promoted_at', 'cast', 'media', 'released_at',
                  'created_at', 'updated_at')


class TitleSerializer(serializers.ModelSerializer):
    seasons = SeasonListSerializer(many=True)
    genres = GenreSerializer(many=True)
    cast = CastSerializer(many=True)
    views = serializers.SerializerMethodField()
    recommended = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    subtitles = serializers.SerializerMethodField()
    trailers = serializers.SerializerMethodField()
    rated = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = ('id', 'name', 'plot', 'runtime', 'imdb', 'rating', 'rated', 'images',
                  'videos', 'subtitles', 'trailers', 'type', 'is_new', 'views', 'seasons', 'is_coming_soon',
                  'genres', 'cast', 'recommended', 'released_at', 'created_at', 'updated_at')

    # noinspection PyMethodMayBeStatic
    def get_views(self, title):
        return title.hits.count()

    def get_rated(self, title):
        if hasattr(title, "rated") and title.rated:
            return str(title.rated) + '+'
        return '+'

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
    def get_media(serializer, t, instance):
        return serializer(instance.media.filter(type=t),
                          many=True, read_only=True).data

    def get_images(self, instance):
        return self.get_media(ImageSerializer, 'image', instance)

    def get_videos(self, instance):
        return self.get_media(VideoSerializer, 'video', instance)

    def get_subtitles(self, instance):
        return self.get_media(SubtitleSerializer, 'subtitle', instance)

    def get_trailers(self, instance):
        return self.get_media(TrailerSerializer, 'trailer', instance)


class TitleListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    images = serializers.SerializerMethodField()
    rated = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = ('id', 'name', 'type', 'is_new', 'rated', 'rating', 'runtime', 'images',
                  'genres', 'released_at')

    # noinspection PyMethodMayBeStatic
    def get_images(self, instance):
        return ImageSerializer(
            instance.media.filter(type='image'),
            many=True,
            read_only=True
        ).data

    def get_rated(self, title):
        if hasattr(title, "rated") and title.rated:
            return str(title.rated) + '+'
        return '+'


class ViewHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewHit
        fields = ('id', 'user', 'topic', 'playback_position',
                  'season', 'episode', 'runtime', 'hit_date')


class SimpleEpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = ('id', 'name', 'plot', 'index', 'image')


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'body', 'user', 'topic', 'created_at')
        read_only_fields = ('user',)

    def create(self, validated_data):
        user = self.context['request'].user
        return Comment.objects.create(**validated_data, user=user)


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('topic',)


class NewsStoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'image')


class NewsStorySerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField('paginated_comments')

    class Meta:
        model = NewsStory
        fields = ('id', 'name', 'body', 'image', 'likes', 'comments')

    def get_likes(self, story):
        return story.likes.count()

    def paginated_comments(self, obj):
        comments = Comment.objects.filter(topic=obj).order_by('-created_at')
        paginator = pagination.PageNumberPagination()
        page = paginator.paginate_queryset(comments, self.context['request'])
        serializer = CommentSerializer(page, many=True, context={
            'request': self.context['request']})

        # pprint(paginator.get_paginated_response(serializer.data))
        return {
            'count': comments.count(),
            'next': paginator.get_next_link(),
            'previous': paginator.get_previous_link(),
            'results': serializer.data
        }
