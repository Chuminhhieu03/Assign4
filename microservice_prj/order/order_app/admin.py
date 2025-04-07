from django.contrib import admin
from .models import Order, Payment, Shipment

admin.site.register(Order)
admin.site.register(Payment)
admin.site.register(Shipment)
