import uuid
from django.db import models
from django.utils.timezone import now

class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # UUID làm ID
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    password = models.CharField(max_length=255, default="123456", blank=True, null=False)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.name
