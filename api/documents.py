from elasticsearch_dsl import analyzer

from django_elasticsearch_dsl import Document, Index, fields

from .models import Title

title_index = Index('titles')
title_index.settings(
    number_of_shards=1,
    number_of_replicas=0
)

html_strip = analyzer(
    'html_strip',
    tokenizer="standard",
    filter=["standard", "lowercase", "stop", "snowball"],
    char_filter=["html_strip"]
)

class TitleDocument(Document):
    """Article elasticsearch document"""

    id = fields.IntegerField(attr='id')
    name = fields.TextField(
        analyzer=html_strip,
        fields={
            'raw': fields.TextField(analyzer='keyword'),
        }
    )
    type = fields.TextField()
    plot = fields.TextField(
        analyzer=html_strip,
        fields={
            'raw': fields.TextField(analyzer='keyword'),
        }
    )
    released_at = fields.DateField()

    class Meta:
        model = Title
