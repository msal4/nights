from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import FileUploadView

router = DefaultRouter()
router.register(r'cast', views.CastViewSet)
router.register(r'titles', views.TitleViewSet)
router.register(r'seasons', views.SeasonViewSet)
router.register(r'episodes', views.EpisodeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth', include('rest_framework.urls')),
    path('upload/<str:directory>/<str:filename>/', FileUploadView.as_view(), name='fileupload'),
    # url('^upload/(?P<directory>[^/]+)/(?P<filename>[^/]+)$', FileUploadView.as_view(), name='fileupload'),
]
