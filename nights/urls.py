from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import path, include
# TODO: remove from here
from frontend import views

urlpatterns = [
    path('api/', include('api.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += url(r'^(?:.*)/?', include('frontend.urls')),
urlpatterns += url(r'^', views.FrontendAppView.as_view()),

urlpatterns += [
    path('django-rq/', include('django_rq.urls'))
]
