from django_elasticsearch_dsl import Document, Index
from django_elasticsearch_dsl.registries import registry

from .models import Title


@registry.register_document
class TitleDocument(Document):
    """Title elasticsearch document"""
    class Index:
        name = 'titles'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
        }

    class Django:
        model = Title

        fields = [
            'id',
            'name',
            'type',
            'released_at'
        ]
