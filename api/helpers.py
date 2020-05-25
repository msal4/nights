import random

from django.db.models import Model
from rest_framework.serializers import Serializer
from django.utils import timezone
from django.db.models import Count, Q
from .serializers import  TitleSerializer


def get_random_object(queryset):
    count = queryset.count()
    if count > 0:
        index = random.randint(0, count - 1)
        return queryset[index]


def get_featured(titles, limit=4, index=None):
    """Get the most viewed titles the last two days."""
    two_days_ago = timezone.now() - timezone.timedelta(2)
    trending = Count('hits', filter=Q(hits__hit_date__gt=two_days_ago))
    featured = titles.annotate(trending=trending).order_by('-trending')[:limit]
    if index != None and index >= 0 and index < limit:
        return TitleSerializer(featured[index], read_only=True).data
        
    return TitleSerializer(featured, many=True, read_only=True).data
