
from . import models
import factory


class TitleFactory(factory.Factory):
    class Meta:
        model = models.Title

    name = factory.Faker('name')
