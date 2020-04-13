from rest_framework.pagination import PageNumberPagination


class HomeViewPagination(PageNumberPagination):
    page_size = 3
