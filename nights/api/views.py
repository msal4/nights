from django.core.files.storage import default_storage
from django.db.models import Q, Count
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from rest_framework import status, filters, mixins, generics
from rest_framework import viewsets, views, parsers, permissions
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .mixins import GetSerializerClassMixin
from .models import Title, Episode, Season, Genre, Cast, ViewHit
from .paginators import HomeViewPagination
from .permissions import IsAdminOrReadOnly
from . import serializers


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

    def _get_recommended(self, hit, titles):
        title = titles.filter(genres__in=hit.topic.genres.all())[0]
        return self._serialize(title, read_only=True)

    def _get_featured(self, titles):
        # Featured titles
        two_days_ago = timezone.now() - timezone.timedelta(2)
        trending = Count('hits', filter=Q(hits__hit_date__gt=two_days_ago))
        featured = titles.annotate(trending=trending).order_by('-trending')[:4]
        return self._serialize(featured, many=True, read_only=True)

    def _get_recently_added(self, titles):
        recent = titles.order_by('-updated_at')[:10]
        return self._serialize(recent, many=True, read_only=True)

    def get_queryset(self):
        return Genre.objects.order_by('-name')

    # Cache requested url for each user for 2 hours
    # @method_decorator(cache_page(60 * 60 * 2))
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

        data['featured'] = self._get_featured(titles)
        data['recently_added'] = self._get_recently_added(titles)

        # Recently watched
        if request.user and not request.user.is_anonymous:
            recently_watched = self._get_history(request.user.viewhit_set)
            if len(recently_watched):
                data['recently_watched'] = self._serialize_history(
                    recently_watched)
                data['recommended'] = self._get_recommended(
                    recently_watched[0], titles)

        return self.get_paginated_response(data)


# @method_decorator(cache_page(60 * 60 * 2))
class CastViewSet(viewsets.ModelViewSet):
    queryset = Cast.objects.all()
    serializer_class = serializers.CastSerializer
    permission_classes = [IsAdminOrReadOnly]


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = serializers.GenreSerializer
    permission_classes = [IsAdminOrReadOnly]


class TitleViewSet(GetSerializerClassMixin, viewsets.ModelViewSet):
    queryset = Title.objects.all()
    serializer_class = serializers.TitleSerializer
    permission_classes = [IsAdminOrReadOnly]
    serializer_action_classes = {
        'list': serializers.TitleListSerializer
    }
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend
    )
    filterset_fields = ('type', 'genres', 'cast')
    search_fields = ('name', 'plot')
    ordering_fields = ('name', 'type', 'created_at')
    ordering = ('-created_at',)

    @method_decorator(cache_page(60 * 60 * 2))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class SeasonViewSet(viewsets.ModelViewSet):
    queryset = Season.objects.all()
    serializer_class = serializers.SeasonSerializer
    permission_classes = [IsAdminOrReadOnly]


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


class WatchHistoryView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = serializers.ViewHitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.viewhit_set.order_by('-hit_date')

    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @staticmethod
    def put(request, pk, *args, **kwargs):
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

        title = get_object_or_404(Title, pk=pk)

        try:
            # Check if hit already exists
            hit = user.viewhit_set.get(topic_id=title.id)
            # Update the hit
            if hit.runtime != runtime:
                hit.runtime = runtime
            if hit.playback_position != position:
                hit.playback_position = position

            hit.episode = episode_id
            hit.season = season_id

            # Update `hit_date` for ordering titles
            hit.hit_date = timezone.now()
            hit.save()

        except ViewHit.DoesNotExist:
            # Otherwise add a new hit
            user.viewhit_set.create(
                topic=title, playback_position=position, runtime=runtime,
                type=topic_type, season=season_id, episode=episode_id)

        return Response(status=status.HTTP_204_NO_CONTENT)
