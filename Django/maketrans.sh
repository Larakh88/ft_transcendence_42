#!/bin/bash
python3 manage.py makemessages -d djangojs -l en
python3 manage.py makemessages -d djangojs -l es
python3 manage.py makemessages -d djangojs -l id
python3 manage.py makemessages -l en
python3 manage.py makemessages -l es
python3 manage.py makemessages -l id
sleep 2
django-admin compilemessages