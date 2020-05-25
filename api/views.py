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

from django_elasticsearch_dsl_drf.constants import (
    LOOKUP_FILTER_RANGE,
    LOOKUP_QUERY_IN,
    LOOKUP_QUERY_GT,
    LOOKUP_QUERY_GTE,
    LOOKUP_QUERY_LT,
    LOOKUP_QUERY_LTE, LOOKUP_FILTER_TERMS,
)
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    OrderingFilterBackend,
    DefaultOrderingFilterBackend,
    CompoundSearchFilterBackend,
    MultiMatchSearchFilterBackend,
    SearchFilterBackend
)
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet, BaseDocumentViewSet


from .documents import TitleDocument
from .helpers import get_featured
from .mixins import GetSerializerClassMixin
from .models import Title, Episode, Season, Genre, Cast, ViewHit, LandingPromo
from .paginators import HomeViewPagination, TitleViewPagination
from .permissions import IsAdminOrReadOnly
from . import serializers
from . import documents


@cache_page(60 * 60 * 4)
@api_view(['GET'])
def list_promos(request, *args, **kwargs):
    queryset = Title.objects.all()
    params = request.query_params

    # Filters
    if 'type' in params and params['type']:
        queryset = queryset.filter(type=params['type'])
    if 'rated' in params and params['rated']:
        queryset = queryset.filter(rated=params['rated'])
    if 'limit' in params and params['limit']:
        return Response(get_featured(queryset, limit=int(params['limit'])))

    return Response(get_featured(queryset))


class HomeView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = serializers.HomeGenreSerializer
    pagination_class = HomeViewPagination
    filter_backends = (
        filters.OrderingFilter,
        DjangoFilterBackend
    )
    filterset_fields = ('type', 'rated')
    ordering_fields = ('name', 'type', 'created_at')
    ordering = ('-created_at',)

    @staticmethod
    def _serialize(obj, serializer=None, *args, **kwargs):
        serializer = serializer or serializers.TitleListSerializer
        return serializer(obj, *args, **kwargs).data

    @staticmethod
    def _serialize_history(hits):
        return serializers.HistorySerializer(hits, many=True, read_only=True).data

    @staticmethod
    def _get_history(hits):
        return hits.filter(type='title').order_by('-hit_date')[:5]

    @staticmethod
    def _get_recommended(hit, titles):
        return get_featured(titles.filter(genres__in=hit.topic.genres.all()), limit=5, index=4)
        # return serializers.TitleSerializer(title, read_only=True).data

    def _get_recently_added(self, titles):
        recent = titles.order_by('-updated_at')[:10]
        return self._serialize(recent, many=True, read_only=True)

    def get_queryset(self):
        return Genre.objects.order_by('-name')

    @method_decorator(cache_page(60 * 60 * 4))
    def get(self, request, *args, **kwargs):
        titles = self.filter_queryset(Title.objects.all())
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset) or queryset
        # Genre rows with titles
        for genre in page:
            genre.title_list = self.filter_queryset(genre.titles.all())[:10]

        data = {'rows': self.get_serializer(page, many=True).data}

        if 'just_rows' in request.query_params:
            return self.get_paginated_response(data)

        data['featured'] = get_featured(titles)
        data['recently_added'] = self._get_recently_added(titles)

        # Recently watched
        if not request.user.is_anonymous:
            recently_watched = self._get_history(request.user.viewhit_set)
            if len(recently_watched):
                data['recommended'] = self._get_recommended(
                    recently_watched[0], titles)

        return self.get_paginated_response(data)


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
        'list': serializers.TitleListSerializer
    }
    pagination_class = TitleViewPagination
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend
    )
    filterset_fields = ('type', 'genres', 'cast')
    search_fields = ('name',)
    ordering_fields = ('name', 'type', 'rating', 'views', 'created_at')
    ordering = ('-created_at',)

    def create(self, request, *args, **kwargs):
        print(request.data['name'])
        Title.objects.create(id="", name="Test Movie",
                             plot="Test Plot", type="s")
        return Response()

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


# Landing
class LandingPromoViewSet(viewsets.ModelViewSet):
#    parser_classes = (FileUploadParser,)
    queryset = LandingPromo.objects.all()
    serializer_class = serializers.LandingPromoSerializer
    permission_classes = [IsAdminOrReadOnly]

#    def post(self, request, *args, **kwargs):
#        serializer = serializers.LandingPromoSerializer(data=request.data)
#
#        if serializer.is_valid():
#            serializer.save()
#            return Response(serializer.data, status=status.HTTP_201_CREATED)
#        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def paginate_queryset(self, queryset, view=None):
        return None

    @method_decorator(cache_page(60 * 60 * 10))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

