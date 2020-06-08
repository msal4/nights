import random

from rest_framework.serializers import Serializer
from django.utils import timezone
from django.db.models import Count, Q
from .serializers import TitleSerializer
from .models import Genre


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


def get_or_create(queryset, **attributes):
    try:
        instance, created = queryset.get_or_create(**attributes)
    except queryset.model.MultipleObjectsReturned:
        instance = queryset.filter(**attributes)[0]

    return instance

