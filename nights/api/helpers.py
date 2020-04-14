import random


def get_random_object(queryset):
    count = queryset.count()
    if count > 0:
        index = random.randint(0, count - 1)
        return queryset[index]
