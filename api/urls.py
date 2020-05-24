from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import FileUploadView

router = DefaultRouter()
router.register(r'cast', views.CastViewSet)
router.register(r'genres', views.GenreViewSet)
router.register(r'titles', views.TitleViewSet)
router.register(r'seasons', views.SeasonViewSet)
router.register(r'episodes', views.EpisodeViewSet)
router.register(r'my_list', views.MyListViewSet, basename='MyList')
router.register(r'history', views.WatchHistoryViewSet, basename='History')

urlpatterns = [
    path('', include(router.urls)),
    path('auth', include('rest_framework.urls')),
    path('test/', views.test_end),
    path('home/', views.HomeView.as_view(), name='home'),
    path('upload/<str:directory>/<str:filename>/',
         FileUploadView.as_view(), name='fileupload'),
    url(r'^auth/', include('djoser.urls')),
    url(r'^auth/', include('djoser.urls.authtoken')),
]
