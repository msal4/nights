from rest_framework.pagination import PageNumberPagination


class TitleGenreRowViewPagination(PageNumberPagination):
    page_size = 3


class NewsStoryViewPagination(PageNumberPagination):
    page_size = 10


class TitleViewPagination(PageNumberPagination):
    page_size = 36


class MyListViewPagination(PageNumberPagination):
    page_size = 50
