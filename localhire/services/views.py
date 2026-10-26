from django.shortcuts import render, get_object_or_404
from .models import Service
from bookings.models import Booking
from django.shortcuts import redirect

def home(request):
    category = request.GET.get('category')

    if category:
        services = Service.objects.filter(category=category)
    else:
        services = Service.objects.all()

    return render(request, "index.html", {"services": services})


def service_detail(request, id):
    service = get_object_or_404(Service, id=id)
    return render(request, "service_detail.html", {"service": service})

def book_service(request, id):
    service = get_object_or_404(Service, id=id)

    if request.method == "POST":
        name = request.POST.get("name")
        date = request.POST.get("date")

        Booking.objects.create(
            service=service,
            customer_name=name,
            booking_date=date
        )

        return redirect("home")

    return render(request, "booking.html", {"service": service})
