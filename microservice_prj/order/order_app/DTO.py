class OrderDTO:
    def __init__(self, order_id, order_date, order_status, order_total, order_address, order_shipment, order_payment, order_cart):
        self.order_id = order_id
        self.order_date = order_date
        self.order_status = order_status
        self.order_total = order_total
        self.order_address = order_address
        self.order_shipment = order_shipment
        self.order_payment = order_payment
        self.order_cart = order_cart  # List of CartDTO

    def to_dict(self):
        return {
            "order_id": self.order_id,
            "order_date": self.order_date,
            "order_status": self.order_status,
            "order_total": self.order_total,
            "order_address": self.order_address,
            "order_shipment": self.order_shipment,
            "order_payment": self.order_payment,
            "order_cart": [cart.to_dict() for cart in self.order_cart]
        }


class CartDTO:
    def __init__(self, cart_id, cart_item_image, cart_item_name, cart_item_price, cart_quantity):
        self.cart_id = cart_id
        self.cart_item_image = cart_item_image
        self.cart_item_name = cart_item_name
        self.cart_item_price = cart_item_price
        self.cart_quantity = cart_quantity

    def to_dict(self):
        return {
            "cart_id": self.cart_id,
            "cart_item_image": self.cart_item_image,
            "cart_item_name": self.cart_item_name,
            "cart_item_price": self.cart_item_price,
            "cart_quantity": self.cart_quantity
        }
