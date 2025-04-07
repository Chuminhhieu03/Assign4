from django.urls import path
from . import views

urlpatterns = [
    path('get-all-customers/', views.get_all_customers),
    path('get-customer-by-id/<int:id>/', views.get_customer_by_id),
    path('create-customer/', views.create_customer),
    path('update-customer/<int:id>/', views.update_customer),
    path('delete-customer/<int:id>/', views.delete_customer),
    path('login/', views.login, name='login'),
    path('decode_token/', views.DecodeTokenView.as_view(), name="decode_token")
]
