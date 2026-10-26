from django.db import models

class Service(models.Model):
    # Option 1: Allow the field to be empty in the database
    name = models.CharField(max_length=100, null=True, blank=True)
    
    # Option 2: Provide a sensible default value
    description = models.TextField(default="No description provided")
    category = models.CharField(max_length=100, default="General")
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)





    def __str__(self):
        return self.name