class CartItemDTO:
    def __init__(self, id, item_id, item_name, item_price, item_image, quantity, customer_id):
        self.id = id
        self.item_id = item_id
        self.item_name = item_name
        self.item_image = item_image
        self.item_price = item_price
        self.quantity = quantity
        self.customer_id = customer_id

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "item_name": self.item_name,
            "item_image": self.item_image,
            "item_price": self.item_price,
            "quantity": self.quantity,
            "customer_id": self.customer_id,
        }
