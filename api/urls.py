from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'cast', views.CastViewSet)
router.register(r'genres', views.GenreViewSet)
router.register(r'titles', views.TitleViewSet)
router.register(r'seasons', views.SeasonViewSet)
router.register(r'episodes', views.EpisodeViewSet)
router.register(r'my_list', views.MyListViewSet, basename='MyList')
router.register(r'history', views.WatchHistoryViewSet, basename='History')
router.register(r'landing_promos', views.LandingPromoViewSet,
                basename='LandingPromos')
router.register(r'likes', views.LikesViewSet,
                basename='Likes')
router.register(r'comments', views.CommentsViewSet,
                basename='Comments')
router.register(r'news_stories', views.NewsStoryViewSet,
                basename='NewsStories')

urlpatterns = [
    path('', include(router.urls)),
    path('fuzzytitles/', views.delete_title),
    path('fuzzyepisodes/', views.retrieve_episode),
    path('cache/', views.forget_cache),
    path('auth', include('rest_framework.urls')),
    path('promos/', views.list_promos),
    path('forward_images/', views.forward_images),
    path('recently_added/', views.RecentlyAddedView.as_view(), name='recently_added'),
    path('trending/', views.TrendingView.as_view(), name='trending'),
    path('genre_rows/', views.TitleGenreRowView.as_view(), name='genre_rows'),
    path('upload/<str:directory>/<str:filename>/',
         views.FileUploadView.as_view(), name='fileupload'),
    url(r'^auth/', include('djoser.urls')),
    url(r'^auth/', include('djoser.urls.authtoken')),
]
