from django.urls import path
from .views import home
from . import views


urlpatterns = [
    path('', home, name='home'),
    path('service/<int:id>/', views.service_detail, name='service_detail'),
    path('book/<int:id>/', views.book_service, name='book_service'),


]
