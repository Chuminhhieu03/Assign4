from django.db import models
import uuid


class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,
                          editable=False)  # ID của cart là UUID
    customer_id = models.UUIDField(null=False)
    shipment = models.ForeignKey('Shipment', on_delete=models.SET_NULL, null=True, blank=True)
    payment = models.ForeignKey('Payment', on_delete=models.SET_NULL, null=True, blank=True)
    
    total = models.BigIntegerField()
    status = models.BooleanField(default=False)
    address = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

class Shipment(models.Model):
    name = models.CharField(max_length=255)
    price = models.BigIntegerField()

class Payment(models.Model):
    name = models.CharField(max_length=255)
