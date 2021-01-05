import os
from pprint import pprint

from django.contrib.auth.models import User
from PIL import Image
from django.core.files.storage import default_storage
from django.db.models import Q, Count, F
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers
from django.conf import settings
from rest_framework import status, filters, mixins, generics
from rest_framework import viewsets, views, parsers, permissions
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import FileUploadParser

from django.core.cache import cache
from rest_framework.decorators import permission_classes
from .mixins import GetSerializerClassMixin
from .models import Title, Episode, Season, Genre, Cast, ViewHit, LandingPromo, NewsStory
from .paginators import TitleGenreRowViewPagination, TitleViewPagination, NewsStoryViewPagination, MyListViewPagination
from .permissions import IsAdminOrReadOnly
from . import serializers
from . import helpers
from api.models import Comment, Like, Topic
import urllib3
from django.http import HttpResponse

http = urllib3.PoolManager()


@api_view(['GET'])
def forward_images(request, *args, **kwargs):
    if 'image_url' in request.query_params:
        url: str = request.query_params['image_url']
        if url.find('1001nights') == -1:
            return Response(status=400)

        try:
            res = http.request('GET', url)
            response = HttpResponse(
                res.data, status=res.status)

            response['Content-Type'] = res.headers['Content-Type']
            response['Content-Length'] = res.headers['Content-Length']
            return response
        except:
            return Response(status=400)

    return Response(status=status.HTTP_404_NOT_FOUND)


@permission_classes(permissions.IsAdminUser)
@api_view(['DELETE'])
def forget_cache(request, *args, **kwargs):
    cache.clear()
    return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes(permissions.IsAdminUser)
@api_view(['DELETE'])
def delete_title(request, *args, **kwargs):
    params = request.query_params

    if 'name' in params and 'released_at' in params:
        Title.objects.filter(
            name=params['name'],
            released_at=params['released_at']
        ).delete()
        cache.clear()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response({"detail": "name and released_at are required."},
                    status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def retrieve_episode(request, *args, **kwargs):
    params = request.query_params

    if 'name' in params and 'released_at' in params:
        titles = Title.objects.filter(
            name=params['name'],
            released_at=params['released_at']
        )

        if len(titles):
            title = titles[0]
            if 'season_index' in params and 'episode_index' in params:
                seasons = title.seasons.filter(
                    index=int(params['season_index']))
                if len(seasons):
                    season = seasons[0]
                    episodes = season.episodes.filter(
                        index=params['episode_index'])
                    if len(episodes):
                        episode = episodes[0]
                        return Response(serializers.EpisodeSerializer(episode).data)

    return Response({'detail': 'No Episode Found with these details'}, status=status.HTTP_404_NOT_FOUND)


def rate_query(request, queryset):
    params = request.query_params
    if 'rated' in params and params['rated']:
        if params['rated'] == 'G':
            queryset = queryset.filter(rated__range=(1, 11))
    else:
        queryset = queryset.exclude(rated__range=(1, 11))

    return queryset


@cache_page(60 * 60 * 4)
@api_view(['GET'])
def list_promos(request, *args, **kwargs):
    queryset = Title.objects.all()
    params = request.query_params

    # Filters
    queryset = rate_query(request, queryset).filter(
        promoted_at__isnull=False).order_by("-promoted_at")
    if 'type' in params and params['type']:
        queryset = queryset.filter(type=params['type'])
    if 'limit' in params and params['limit']:
        limit = int(params['limit'])
        return Response(serializers.TitleSerializer(queryset[:limit], many=True).data)

    if len(queryset):
        queryset = queryset[0]

    return Response(serializers.TitleSerializer([]).data)


class TrendingView(mixins.ListModelMixin, generics.GenericAPIView):
    queryset = Title.objects.filter(
        featured_at__isnull=False, is_coming_soon=False).order_by('-featured_at')
    serializer_class = serializers.TitleListSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('type',)

    @method_decorator(cache_page(60 * 60))
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            rate_query(request, self.get_queryset()))
        page = self.paginate_queryset(queryset) or queryset

        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response(serializer.data)


class RecentlyAddedView(mixins.ListModelMixin, generics.GenericAPIView):
    queryset = Title.objects.filter(
        is_coming_soon=False).order_by('-updated_at')
    serializer_class = serializers.TitleListSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('type',)

    @method_decorator(cache_page(60 * 60))
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            rate_query(request, self.get_queryset()))
        page = self.paginate_queryset(queryset) or queryset

        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response(serializer.data)


class TitleGenreRowView(mixins.ListModelMixin, generics.GenericAPIView):
    queryset = Genre.objects.order_by('name')
    serializer_class = serializers.TitleGenreSerializer
    pagination_class = TitleGenreRowViewPagination
    filter_backends = (
        filters.OrderingFilter,
        DjangoFilterBackend
    )
    filterset_fields = ('type',)
    ordering_fields = ('name', 'type', 'created_at')
    ordering = ('-created_at',)

    @method_decorator(cache_page(60 * 60 * 4))
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset) or queryset

        for genre in page:
            titles = genre.titles.filter(is_coming_soon=False)
            titles = rate_query(request, titles)
            genre.title_list = self.filter_queryset(titles)[:10]

        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response(serializer.data)


class CastViewSet(viewsets.ModelViewSet):
    queryset = Cast.objects.all()
    serializer_class = serializers.CastSerializer
    permission_classes = [IsAdminOrReadOnly]

    @method_decorator(cache_page(60 * 60 * 10))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = serializers.GenreSerializer
    permission_classes = [IsAdminOrReadOnly]

    def paginate_queryset(self, queryset, view=None):
        return None

    @method_decorator(cache_page(60 * 60 * 10))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class TitleViewSet(GetSerializerClassMixin, viewsets.ModelViewSet):
    queryset = Title.objects.all()
    serializer_class = serializers.TitleSerializer
    permission_classes = [IsAdminOrReadOnly]
    serializer_action_classes = {
        'list': serializers.TitleListSerializer,
        'create': serializers.TitleCreateSerializer,
        'update': serializers.TitleCreateSerializer,
    }
    pagination_class = TitleViewPagination
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend
    )
    filterset_fields = ('type', 'genres', 'cast',
                        'is_coming_soon', 'released_at')
    search_fields = ('name',)
    ordering_fields = ('name', 'type', 'rating', 'views', 'created_at')
    ordering = ('-created_at',)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).distinct()

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @method_decorator(cache_page(60 * 60 * 4))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class SeasonViewSet(viewsets.ModelViewSet):
    queryset = Season.objects.all()
    serializer_class = serializers.SeasonSerializer
    permission_classes = [IsAdminOrReadOnly]

    @method_decorator(cache_page(60))
    @vary_on_headers('Authorization')
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class EpisodeViewSet(viewsets.ModelViewSet):
    queryset = Episode.objects.all()
    serializer_class = serializers.EpisodeSerializer
    permission_classes = [IsAdminOrReadOnly]

    def create(self, request, *args, **kwargs):
        try:
            season_id = request.data['episode_season']
            # Update series date so that `is_new` returns `true`
            season = Season.objects.get(pk=season_id)
            season.series.updated_at = timezone.now()
            season.series.save()
        except Season.DoesNotExist:
            return Response({'detail': 'Season not found.'}, status=status.HTTP_404_NOT_FOUND)
        except (KeyError, ValueError):
            pass

        return super().create(request, *args, **kwargs)

    def update(self, request, pk=None, *args, **kwargs):
        episode = Episode.objects.filter(id=pk)[0]

        if 'image' in request.data:
            image = request.data.pop('image')
            if len(image) > 0:
                i = image[0]
                episode.image.save(str(pk) + '.jpg', i, save=True)

        if 'name' in request.data:
            episode.name = request.data['name']

        if 'plot' in request.data:
            episode.plot = request.data['plot']

        episode.save()
        return Response(serializers.SimpleEpisodeSerializer(episode).data, status=status.HTTP_200_OK)


class FileUploadView(views.APIView):
    parser_classes = [parsers.FileUploadParser]
    permission_classes = [permissions.IsAdminUser]

    @staticmethod
    def put(request, directory, filename, format=None):
        file_obj = request.data['file']

        path = '%s/%s/%s' % (settings.MEDIA_ROOT, directory, filename)
        # Overwrite the file if it already exists
        if default_storage.exists(path):
            default_storage.delete(path)
        default_storage.save(path, file_obj.file)

        url = '%s%s/%s' % (settings.MEDIA_URL, directory, filename)
        return Response(
            {'path': url, 'filename': filename},
            status=status.HTTP_201_CREATED
        )


class MyListViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.TitleListSerializer
    pagination_class = MyListViewPagination

    def get_queryset(self):
        return self.request.user.my_list.order_by('-mylist__date_added')

    @staticmethod
    def post(request, *args, **kwargs):
        try:
            title_id = request.data['id']
            title = get_object_or_404(Title, pk=title_id)
            request.user.my_list.add(title)
            return Response({'detail': '%s is added to your list.' % title.name},
                            status=status.HTTP_201_CREATED)

        except KeyError as e:
            key = e.args[0]
            return Response({'detail': '`%s` is required.' % key},
                            status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def delete(request, pk, *args, **kwargs):
        title = get_object_or_404(request.user.my_list.all(), pk=pk)
        request.user.my_list.remove(title)
        return Response({'detail': '%s is removed from your list.' % title.name},
                        status=status.HTTP_200_OK)


class WatchHistoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
                          viewsets.GenericViewSet):
    serializer_class = serializers.HistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'topic_id'

    def get_queryset(self):
        return self.request.user.viewhit_set.filter(
            type='title').order_by('-hit_date')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).exclude(
            playback_position=F('runtime'))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @staticmethod
    def put(request, topic_id, *args, **kwargs):
        topic_type = 'title'
        season_id = None
        episode_id = None
        try:
            position = int(float(request.data['playback_position']))
            runtime = int(float(request.data['runtime']))
            if 'type' in request.data:
                topic_type = request.data['type']
            if 'episode' in request.data and 'season' in request.data:
                season_id = request.data['season']
                episode_id = request.data['episode']

        except KeyError as e:
            return Response({'detail': '%s is required.' % e.args[0]})

        user = request.user

        title = get_object_or_404(Title, pk=topic_id)

        if not title.runtime and title.type == 'm' and runtime:
            title.runtime = runtime
            title.save()

        try:
            # Check if hit already exists
            hit = user.viewhit_set.get(topic_id=title.id)
            # Update the hit
            if hit.runtime != runtime:
                hit.runtime = runtime
            if hit.playback_position != position:
                hit.playback_position = position

            # Update episode hit if it's a series
            if episode_id and season_id:
                if (hit.episode and episode_id != hit.episode.id) or not hit.episode:
                    hit.episode = get_object_or_404(Episode, pk=episode_id)
                if (hit.season and season_id != hit.episode.id) or not hit.season:
                    hit.season = get_object_or_404(Season, pk=season_id)

                episode_hit, created = user.viewhit_set.get_or_create(
                    topic=hit.episode)

                if created:
                    episode_hit.type = 'episode'
                episode_hit.runtime = runtime
                episode_hit.playback_position = position
                episode_hit.save()

            # Update `hit_date` for ordering titles
            hit.hit_date = timezone.now()
            hit.save()

        except ViewHit.DoesNotExist:
            season = None
            episode = None
            if episode_id and season_id:
                episode = get_object_or_404(Episode, pk=episode_id)
                season = get_object_or_404(Season, pk=season_id)

            # Otherwise add a new hit
            user.viewhit_set.create(
                topic=title, playback_position=position, runtime=runtime,
                type=topic_type, season=season, episode=episode)

        return Response(status=status.HTTP_204_NO_CONTENT)


class LandingPromoViewSet(viewsets.ModelViewSet):
    queryset = LandingPromo.objects.all()
    serializer_class = serializers.LandingPromoSerializer
    permission_classes = [IsAdminOrReadOnly]

    def paginate_queryset(self, queryset, view=None):
        return None

    # @method_decorator(cache_page(60 * 60 * 10))
    # def dispatch(self, request, *args, **kwargs):
    #     return super().dispatch(request, *args, **kwargs)


class NewsStoryViewSet(GetSerializerClassMixin, viewsets.ModelViewSet):
    queryset = NewsStory.objects.order_by('-created_at')
    serializer_class = serializers.NewsStorySerializer
    pagination_class = NewsStoryViewPagination
    permission_classes = [IsAdminOrReadOnly]
    serializer_action_classes = {
        'list': serializers.NewsStoryListSerializer,
    }

    def list(self, *args, **kwargs):
        return super().list(*args, **kwargs)

    def rename_image(self, request, story):
        image = request.data.pop('image')
        name = str(story.id) + '.png'
        story.image.save('original/' + name, image[0], save=True)

        path = os.path.join(settings.MEDIA_ROOT, story.image.name)
        image = Image.open(path)

        image_copy = image.copy()
        image_copy.thumbnail((300, 300), Image.ANTIALIAS)

        thumbnails_directory = os.path.join(
            settings.MEDIA_ROOT, 'news_stories/300')

        if not os.path.isdir(thumbnails_directory):
            os.mkdir(thumbnails_directory)

        image_copy.save(os.path.join(thumbnails_directory, name))

        image_copy = image.copy()

        medium_images_directory = os.path.join(
            settings.MEDIA_ROOT, 'news_stories/600')

        if not os.path.isdir(medium_images_directory):
            os.mkdir(medium_images_directory)

        image_copy.thumbnail((600, 600), Image.ANTIALIAS)
        image_copy.save(os.path.join(medium_images_directory, name))

    def create(self, request, *args, **kwargs):

        story = self.queryset.create(
            name=request.data['name'],
            image=request.data['image'],
            body=request.data['body']
        )
        self.rename_image(request, story)

        serializer = self.get_serializer(story)
        return Response(serializer.data)
        # return super().update(self, request, pk=story.id, *args, **kwargs)

    def update(self, request, pk=None, *args, **kwargs):
        self.rename_image(request, self.queryset.get(pk=pk))

        return super().update(request, *args, pk=pk, **kwargs)


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.order_by('-created_at')
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class LikesViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = serializers.LikeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        topic = Topic.objects.get(pk=request.data['topic'])
        queryset = self.queryset.filter(topic=topic, user=request.user)

        like = None

        if not queryset.count():
            like = self.queryset.create(topic=topic, user=request.user)
        else:
            like = queryset[0]

        serializer = self.get_serializer(like)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        like = get_object_or_404(request.user.likes, topic=pk)
        serializer = self.get_serializer(like)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None, *args, **kwargs):
        topic = Topic.objects.get(pk=pk)
        like = get_object_or_404(request.user.likes.all(), topic=topic)
        like.delete()
        return Response(status=status.HTTP_200_OK)
