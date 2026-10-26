from django.db import models
from django.conf import settings

class Booking(models.Model):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="customer_bookings")
    professional = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="professional_bookings")
    service = models.ForeignKey('services.Service', on_delete=models.CASCADE)
    
    # Adding null=True makes the migration easy!
    date = models.DateField(null=True, blank=True) 
    time_slot = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default="pending")

    def __str__(self):
        return f"{self.customer} booked {self.service}"