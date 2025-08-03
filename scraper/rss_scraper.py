import sqlite3
import feedparser
import json
from bs4 import BeautifulSoup
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # dossier du script actuel
DB_PATH = os.path.join(BASE_DIR, '..', 'rss_feed.db')

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def create_table():
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        short_description TEXT,
        published_at TEXT,
        category TEXT
    )
    """)
    conn.commit()
   

def rss_flux():
    with open('flux.json', 'r') as file:
        data = json.load(file)

    for item in data:
        category = item['category']
        for feed in item['feeds']:
            feed_data = feedparser.parse(feed)
            json_to_sqlite(feed_data, category)
            


def json_to_sqlite(feed_data, category):
    for entry in feed_data.entries:
        print(f"Processing entry: {entry.title}")
        title = entry.title
        url = entry.link

        # Nettoyage de la description
        soup = BeautifulSoup(entry.description, 'html.parser')
        for img in soup.find_all('img'):
            img.decompose()
        short_description = str(soup)

        published_at = entry.published 
        cursor.execute("""
        INSERT OR IGNORE INTO articles (title, url, short_description, published_at, category)
        VALUES (?, ?, ?, ?, ?)
        """, (title, url, short_description, published_at, category))
    conn.commit()


def read_articles_from_db(limit=10):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT title, url, published_at, category, short_description
        FROM articles
        ORDER BY published_at DESC
        LIMIT ?
    """, (limit,))

    rows = cursor.fetchall()

    for row in rows:
        title, url, published_at, category, short_description = row
        print(f"📰 {title}")
        print(f"🔗 {url}")
        print(f"📅 {published_at}")
        print(f"🏷️ Catégorie: {category}")
        print(f"description: {short_description}")
        print("-" * 60)

    conn.close()



create_table()
rss_flux()
read_articles_from_db(20)
