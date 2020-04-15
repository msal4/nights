from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

_urls = [
    path('api/', include('api.urls')),
    path('', include('frontend.urls')),
]

urlpatterns = _urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
