from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import logout, login,authenticate
from django.shortcuts import render, redirect
from .forms import LocalHireSignupForm 

def signup_view(request):
    if request.method == 'POST':
        form = LocalHireSignupForm(request.POST)
        if form.is_valid():
            # This saves the user to your 'accounts_user' table in MySQL
            user = form.save()
            # ✅ authenticate the user properly
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)

            messages.success(request, "Registration successful! Welcome to LocalHire.")
            return redirect('/')
    else:    
        form = LocalHireSignupForm()
    return render(request, "registration/signup.html", {'form': form})

def logout_view(request):
    logout(request)
    return redirect('/')

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Welcome back, {user.username}!")
            return redirect('/') # Go to Homepage
        else:
            messages.error(request, "Account not found or invalid credentials.")
    else:
        form = AuthenticationForm()
    return render(request, "registration/login.html", {'form': form})