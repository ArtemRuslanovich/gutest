FROM python:3.13.3

WORKDIR /app

RUN pip install --no-cache-dir flask requests beautifulsoup4 psycopg2-binary

COPY . .

CMD ["flask", "run"]
