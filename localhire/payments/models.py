from django.db import models

class Payment(models.Model):
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.CASCADE
    )

    amount = models.FloatField()
    status = models.CharField(max_length=20, default="successful")

    def __str__(self):
        return f"Payment for Booking {self.booking.id}"
