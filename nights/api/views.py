from nights.settings import MEDIA_ROOT, MEDIA_URL
from rest_framework import status
from rest_framework import viewsets, views, parsers, permissions
from rest_framework.response import Response
from django.core.files.storage import default_storage

from .models import Title, Cast, Episode, Season
from .permissions import IsAdminOrReadOnly
from .serializers import TitleSerializer, CastSerializer, EpisodeSerializer, SeasonSerializer


class CastViewSet(viewsets.ModelViewSet):
    queryset = Cast.objects.all()
    serializer_class = CastSerializer
    permission_classes = [IsAdminOrReadOnly]


class TitleViewSet(viewsets.ModelViewSet):
    queryset = Title.objects.all()
    serializer_class = TitleSerializer
    permission_classes = [IsAdminOrReadOnly]


class SeasonViewSet(viewsets.ModelViewSet):
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer
    permission_classes = [IsAdminOrReadOnly]


class EpisodeViewSet(viewsets.ModelViewSet):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer
    permission_classes = [IsAdminOrReadOnly]


class FileUploadView(views.APIView):
    parser_classes = [parsers.FileUploadParser]
    permission_classes = [permissions.IsAdminUser]

    @staticmethod
    def put(request, directory, filename, format=None):
        file_obj = request.data['file']

        path = '%s/%s/%s' % (MEDIA_ROOT, directory, filename)
        # Overwrite file if it exists
        if default_storage.exists(path):
            default_storage.delete(path)
        default_storage.save(path, file_obj.file)

        url = '%s%s/%s' % (MEDIA_URL, directory, filename)
        return Response(
            {'path': url, 'filename': filename},
            status=status.HTTP_201_CREATED
        )
