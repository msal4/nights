media_types = {
    2: 'video',
    3: 'trailer',
    4: 'image',
    7: 'subtitle'
}


def media_types_model(type):
    types = {
        'video': 2,
        'trailer': 3,
        'image': 4,
        'subtitle': 7
    }

    if type in types:
        return types[type]

    return 'media'
