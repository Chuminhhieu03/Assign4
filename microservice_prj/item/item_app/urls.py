from django.urls import path
from .views import get_all_items, create_book, create_mobile, create_clothes, get_item_by_id

urlpatterns = [
    path('getAllItems/', get_all_items, name='get_all_items'),
    path('getItemById/', get_item_by_id, name='get_item_by_id'),
    path('createBook/', create_book, name='create_book'),
    path('createMobile/', create_mobile, name='create_mobile'),
    path('createClothes/', create_clothes, name='create_clothes'),
]
