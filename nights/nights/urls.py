from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
                  path('api/', include('api.urls')),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
