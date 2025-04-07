from django.db import models
import requests  # Để gọi API từ Customer và Book service

class Cart(models.Model):
    customer_id = models.IntegerField()  # ID của customer từ service khác
    book_id = models.IntegerField()  # ID của book từ service khác
    quantity = models.IntegerField(default=1)

    def get_customer_info(self):
        response = requests.get(f"http://127.0.0.1:8001/customers/{self.customer_id}/")
        return response.json() if response.status_code == 200 else None

    def get_book_info(self):
        response = requests.get(f"http://127.0.0.1:8002/books/{self.book_id}/")
        return response.json() if response.status_code == 200 else None