def get_or_create(queryset, **kwargs):
    try:
        instance, created = queryset.get_or_create(**kwargs)
        print('created new instance:', created, '- instance:', instance)
    except queryset.model.MultipleObjectsReturned:
        instance = queryset.filter(**kwargs)[0]

    return instance


def update_object(obj, **kwargs):
    for (key, value) in kwargs.items():
        print('---------key:', key, '-------value:', value, '\n\n\n')
        setattr(obj, key, value)
    obj.save()
    return obj
