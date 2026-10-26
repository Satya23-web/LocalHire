# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# This makes "Users" appear in your sidebar
admin.site.register(User, UserAdmin)