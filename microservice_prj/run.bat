@echo off
start cmd /k "cd api_gateway && python manage.py runserver 8080"
start cmd /k "cd item && python manage.py runserver 8001"
start cmd /k "cd customer && python manage.py runserver 8002"
start cmd /k "cd cart && python manage.py runserver 8003"
start cmd /k "cd order && python manage.py runserver 8004"
echo All services started!