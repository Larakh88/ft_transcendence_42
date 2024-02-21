FROM python:slim-bullseye

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip

COPY ./requirements.txt .

RUN pip install -r requirements.txt

EXPOSE 8000

COPY . /code/
