import uuid
from django.db import models


class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,
                          editable=False)  # ID của cart là UUID
    # Chỉ lưu UUID của Customer (không có ForeignKey)
    customer_id = models.UUIDField(null=False)
    # Lưu ObjectId từ MongoDB dưới dạng string
    item_id = models.CharField(max_length=24, default="")
    quantity = models.IntegerField(default=1)
    order_id = models.UUIDField(null=True)  # ID của order tương ứng

    def __str__(self):
        return f"Cart {self.id} - Customer {self.customer_id} - Item {self.item_id} x {self.quantity}"
