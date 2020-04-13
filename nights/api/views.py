from django.core.files.storage import default_storage
from django.utils import timezone
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
    filterset_fields = ('type',)
    ordering_fields = ('name', 'type', 'created_at')
    ordering = ('-created_at',)

    def get_queryset(self):
        return Genre.objects.order_by('-name')

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            for genre in page:
                genre.title_list = self.filter_queryset(genre.titles.all())[:10]
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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


class MyListView(mixins.ListModelMixin, generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.TitleListSerializer

    def get_queryset(self):
        user = self.request.user
        return user.my_list.order_by('-mylist__date_added')

    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

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
        try:
            position = int(float(request.data['playback_position']))
            runtime = int(float(request.data['runtime']))
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

            # Update `hit_date` for ordering titles
            hit.hit_date = timezone.now()
            hit.save()

        except ViewHit.DoesNotExist:
            # Otherwise add a new hit
            user.viewhit_set.create(topic=title, playback_position=position, runtime=runtime)

        return Response(status=status.HTTP_204_NO_CONTENT)
