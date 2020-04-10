from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from polymorphic.models import PolymorphicModel


class Topic(PolymorphicModel):
    name = models.CharField(max_length=200, blank=True)
    released_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    @property
    def is_new(self):
        return self.updated_at >= timezone.now() - timezone.timedelta(5)

    def __str__(self):
        return self.name


class Genre(Topic):
    pass


class Cast(Topic):
    pass


class Title(Topic):
    genres = models.ManyToManyField(Genre, blank=True)
    cast = models.ManyToManyField(Cast, blank=True)
    users = models.ManyToManyField(User, blank=True, related_name='my_list')

    plot = models.TextField(null=True)
    runtime = models.IntegerField(null=True, blank=True, help_text='In minutes')
    imdb = models.CharField(max_length=50, null=True)
    rating = models.FloatField(null=True)
    type = models.CharField(
        max_length=10,
        choices=(('m', 'Movie'), ('s', 'Series')),
        default='m'
    )
    rated = models.CharField(
        max_length=10,
        choices=[
            ('G', 'G - General Audiences'),
            ('PG', 'PG - Parental Guidance Suggested'),
            ('PG-13', 'PG-13 - Parents Strongly Cautioned'),
            ('R', 'R - Restricted'),
            ('NC-17', 'NC-17 - Adults Only')
        ],
        default='G'
    )


class Season(Topic):
    series = models.ForeignKey(Title, limit_choices_to={'type': 's'}, on_delete=models.CASCADE)
    index = models.IntegerField(blank=True, default=0, help_text='Season number')

    def save(self, **kwargs):
        if not self.name:
            self.name = '%s S%02d' % (self.series.name, self.index)


class Episode(Topic):
    episode_series = models.ForeignKey(Title, blank=True, null=True, on_delete=models.CASCADE)
    episode_season = models.ForeignKey(Season, on_delete=models.CASCADE)

    plot = models.TextField(null=True)
    runtime = models.IntegerField(null=True, blank=True, help_text='In minutes')
    index = models.IntegerField(blank=True, default=0, help_text='Episode number')

    def save(self, **kwargs):
        if not self.episode_series:
            self.episode_series = self.episode_season.series

        if not self.name:
            self.name = '%s S%02dE%02d' % (self.episode_series.name, self.episode_season.index, self.index)


class ViewHit(models.Model):
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    playback_position = models.IntegerField(blank=True, default=0)
    runtime = models.IntegerField(blank=True, null=True)
    hit_message = models.CharField(blank=True, null=True, max_length=100)

    def __str__(self):
        if self.user and self.topic:
            return '(%s) -> (%s) [%d]' % (self.user.username, self.topic.name, self.playback_position)
        return str(self.playback_position)
