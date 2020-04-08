from django.db import models


class Cast(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.name


class Title(models.Model):
    cast = models.ManyToManyField(Cast, blank=True)

    name = models.CharField(max_length=200)
    plot = models.TextField(null=True)
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
    runtime = models.IntegerField(null=True, blank=True, help_text='In minutes')
    released_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.name


class Season(models.Model):
    series = models.ForeignKey(Title, limit_choices_to={'type': 's'}, on_delete=models.CASCADE)

    name = models.CharField(max_length=200)
    index = models.IntegerField(blank=True, default=0, help_text='Season number')
    released_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.name


class Episode(models.Model):
    series = models.ForeignKey(Title, on_delete=models.CASCADE)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)

    name = models.CharField(blank=True, max_length=200)
    index = models.IntegerField(blank=True, default=0, help_text='Episode number')
    runtime = models.IntegerField(null=True, blank=True, help_text='In minutes')
    plot = models.TextField(null=True)
    released_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    def clean(self):
        if not self.name:
            self.name = str(self)

    def __str__(self):
        return '%s S%02dE%02d' % (self.season.series.name, self.season.index, self.index)
