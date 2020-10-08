import os

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from polymorphic.models import PolymorphicModel
from datetime import datetime
from django.conf import settings
from django.core.files.storage import FileSystemStorage


def get_year():
    return str(datetime.now().year)


class Topic(PolymorphicModel):
    views = models.ManyToManyField(User, blank=True, related_name='watched', through='ViewHit',
                                   through_fields=('topic', 'user'))

    name = models.CharField(max_length=200, blank=True)
    released_at = models.CharField(max_length=4, default=get_year, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    @property
    def is_new(self):
        return self.updated_at >= timezone.now() - timezone.timedelta(1)

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = 'Untitled'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Genre(Topic):
    pass


class Cast(Topic):
    pass


class Language(Topic):
    pass


class Title(Topic):
    genres = models.ManyToManyField(Genre, related_name='titles', blank=True)
    cast = models.ManyToManyField(Cast, related_name='titles', blank=True)
    languages = models.ManyToManyField(
        Language, blank=True, related_name='titles')
    users = models.ManyToManyField(User, blank=True, related_name='my_list',
                                   through='MyList', through_fields=('title', 'user'))

    promoted_at = models.DateTimeField(null=True, blank=True)
    featured_at = models.DateTimeField(null=True, blank=True)
    is_coming_soon = models.BooleanField(default=False, blank=True)
    plot = models.TextField(null=True)
    runtime = models.IntegerField(
        null=True, blank=True, help_text='In minutes')
    imdb = models.CharField(max_length=50, null=True)
    rating = models.FloatField(null=True)
    type = models.CharField(
        max_length=10,
        choices=(('m', 'Movie'), ('s', 'Series')),
        default='m'
    )
    rated = models.IntegerField(null=True, blank=True)


class Season(Topic):
    series = models.ForeignKey(Title, limit_choices_to={
        'type': 's'}, related_name='seasons', on_delete=models.CASCADE)
    index = models.IntegerField(
        blank=True, default=0, help_text='Season number')

    def save(self, *args, **kwargs):
        try:
            if not self.name:
                self.name = '%s S%02d' % (self.series.name, self.index)
        except:
            self.name = ""

        super().save(*args, **kwargs)


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, *args, **kwargs):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


class Episode(Topic):
    episode_season = models.ForeignKey(
        Season, related_name='episodes', on_delete=models.CASCADE)

    plot = models.TextField(null=True)
    runtime = models.IntegerField(
        null=True, blank=True, help_text='In minutes')
    index = models.IntegerField(
        blank=True, default=0, help_text='Episode number')
    image = models.ImageField(
        upload_to='episodes_images', storage=OverwriteStorage(), blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = '%s S%02dE%02d' % (
                self.episode_season.series.name, self.episode_season.index, self.index)
        super().save(*args, **kwargs)


class ViewHit(models.Model):
    user = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.CASCADE)
    topic = models.ForeignKey(
        Topic, related_name='hits', on_delete=models.CASCADE)
    season = models.ForeignKey(
        Season, blank=True, null=True, related_name='viewhits', on_delete=models.CASCADE)
    episode = models.ForeignKey(
        Episode, blank=True, null=True, related_name='viewhits', on_delete=models.CASCADE)

    type = models.CharField(max_length=10, blank=True, default='title')
    playback_position = models.IntegerField(blank=True, default=0)
    runtime = models.IntegerField(blank=True, null=True)
    hit_message = models.CharField(blank=True, null=True, max_length=100)
    hit_date = models.DateTimeField(blank=True, auto_now_add=True)

    def __str__(self):
        if self.user and self.topic:
            return '(%s) -> (%s) [%d]' % (self.user.username, self.topic.name, self.playback_position)
        return str(self.playback_position)


class MyList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.ForeignKey(Title, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True, blank=True)


class Provider(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()


class Availability(models.Model):
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)


class Media(models.Model):
    topic = models.ForeignKey(
        Topic, related_name='media', on_delete=models.CASCADE)
    parent = models.ForeignKey(
        'self', related_name="children", blank=True, null=True, on_delete=models.CASCADE)
    provider = models.ForeignKey(
        Provider, blank=True, null=True, on_delete=models.SET_NULL)
    availability = models.ForeignKey(
        Availability, null=True, on_delete=models.SET_NULL)

    language = models.CharField(max_length=10, blank=True, null=True)
    url = models.TextField()
    formats = models.CharField(max_length=255)
    qualities = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=20)

    def __str__(self):
        return self.url


class LandingPromo(models.Model):
    title = models.CharField(max_length=60)
    title_ar = models.CharField(max_length=60)
    body = models.CharField(max_length=250)
    body_ar = models.CharField(max_length=250)
    image = models.ImageField(
        upload_to='landing_promos', storage=OverwriteStorage())

    def __str__(self):
        return self.title


class NewsStory(Topic):
    body = models.TextField()
    image = models.ImageField(upload_to='news_stories')

    def save(self, *args, **kwargs):
        print(self.image)
        super().save(*args, **kwargs)


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True, blank=True)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    body = models.TextField()
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
