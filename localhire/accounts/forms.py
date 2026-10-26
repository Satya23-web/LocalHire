from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User  # This is your custom User model

class LocalHireSignupForm(UserCreationForm):
    # Mapping the HTML names to what Django expects
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'auth-input', 'placeholder': 'Username'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'auth-input', 'placeholder': 'Email'}))
    
    # We rename the internal Django fields to match your HTML 'name' attributes
    password1 = forms.CharField(
        label="Password", 
        widget=forms.PasswordInput(attrs={'placeholder': 'Create password'})
    )
    password2 = forms.CharField(
        label="Confirm Password", 
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm password'})
    )


    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email") # Just the basics, no role or phone

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Advanced: Loop through fields to add the CSS class 'auth-input' automatically
        for field in self.fields.values():
            field.widget.attrs.setdefault('class', 'auth-input')