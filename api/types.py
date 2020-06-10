from .models import Video, Subtitle, Image, Trailer

media_types = {
    2: Video,
    3: Trailer,
    4: Image,
    7: Subtitle
}

media_types_model = {
    Video: 2,
    Trailer: 3,
    Image: 4,
    Subtitle: 7
}
