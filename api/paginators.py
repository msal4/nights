from rest_framework.pagination import PageNumberPagination


class TitleGenreRowViewPagination(PageNumberPagination):
    page_size = 3


class TitleViewPagination(PageNumberPagination):
    page_size = 30
