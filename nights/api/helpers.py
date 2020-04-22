import random

from django.db.models import Model
from rest_framework.serializers import Serializer


def get_random_object(queryset):
    count = queryset.count()
    if count > 0:
        index = random.randint(0, count - 1)
        return queryset[index]
