import os
import re
import requests
from flask import Flask, jsonify, request
import psycopg2
from bs4 import BeautifulSoup

app = Flask(__name__)
DATABASE_URL = os.environ['DATABASE_URL']

def parse_wildberries(query):
    url = f"https://www.wildberries.ru/catalog/0/search.aspx?search={query}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    products = []
    for item in soup.select('.product-card'):
        name = item.select_one('.product-card__name').text.strip()
        price = int(re.sub(r'\D', '', item.select_one('.price__lower-price').text))
        sale_price = int(re.sub(r'\D', '', item.select_one('.price__lower-price').text))
        rating = float(item.select_one('.product-card__rating').text.strip()) if item.select_one('.product-card__rating') else 0.0
        reviews = int(re.sub(r'\D', '', item.select_one('.product-card__count').text)) if item.select_one('.product-card__count') else 0
        
        products.append({
            'name': name,
            'price': price,
            'sale_price': sale_price,
            'rating': rating,
            'reviews': reviews
        })
    
    return products

@app.route('/parse', methods=['POST'])
def parse():
    data = request.json
    products = parse_wildberries(data['query'])
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    for product in products:
        cur.execute("""
            INSERT INTO products_product 
            (name, price, sale_price, rating, reviews)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            product['name'],
            product['price'],
            product['sale_price'],
            product['rating'],
            product['reviews']
        ))
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"status": "success", "count": len(products)})

if __name__ == '__main__':
    app.run(host='0.0.0.0')