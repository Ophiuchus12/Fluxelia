import sqlite3
import feedparser
import json
from bs4 import BeautifulSoup
import os
import email.utils
from datetime import datetime, timezone

def rfc2822_to_iso8601(rfc2822_date):
    """Convertit une date RFC2822 en ISO8601"""
    if not rfc2822_date:
        return None
    
    parsed_time = email.utils.parsedate_tz(rfc2822_date)
    if parsed_time is None:
        return None

    timestamp = email.utils.mktime_tz(parsed_time)
    dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    return dt.isoformat().replace('+00:00', 'Z')


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, '..', 'rss_feed.db')

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


def create_table():
    """Crée la table articles avec support multilingue"""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        short_description TEXT,
        published_at TEXT,
        category TEXT,
        category_slug TEXT,
        lang TEXT DEFAULT 'fr'
    )
    """)
    
    # Index pour les performances
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_articles_lang 
    ON articles(lang)
    """)
    
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_articles_category_lang 
    ON articles(category_slug, lang)
    """)
    
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_articles_published 
    ON articles(published_at DESC)
    """)
    
    conn.commit()
    print("✅ Table 'articles' créée avec index")


def rss_flux():
    """Parse le fichier flux.json et récupère tous les feeds par langue"""
    flux_path = os.path.join(BASE_DIR, 'flux.json')
    
    with open(flux_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    total_articles = {'fr': 0, 'en': 0}

    for item in data:
        slug = item['slug']
        categories = item['category']  # {"fr": "Technologie", "en": "Technology"}
        feeds_by_lang = item['feeds']  # {"fr": [...], "en": [...]}

        # Traiter chaque langue
        for lang, feeds in feeds_by_lang.items():
            category_name = categories.get(lang, categories.get('fr'))
            
            for feed_url in feeds:
                print(f"📡 [{lang.upper()}] Fetching: {feed_url[:50]}...")
                try:
                    feed_data = feedparser.parse(feed_url)
                    count = json_to_sqlite(feed_data, category_name, slug, lang)
                    total_articles[lang] += count
                except Exception as e:
                    print(f"   ❌ Erreur: {e}")

    print(f"\n📊 Résumé:")
    print(f"   🇫🇷 FR: {total_articles['fr']} nouveaux articles")
    print(f"   🇬🇧 EN: {total_articles['en']} nouveaux articles")


def json_to_sqlite(feed_data, category, category_slug, lang):
    """Insère les articles du feed dans la DB"""
    count = 0
    
    for entry in feed_data.entries:
        title = entry.get('title', '')
        url = entry.get('link', '')
        
        if not title or not url:
            continue

        # Nettoyage de la description
        description_raw = entry.get('description', entry.get('summary', ''))
        soup = BeautifulSoup(description_raw, 'html.parser')
        
        # Supprimer les images
        for img in soup.find_all('img'):
            img.decompose()
        
        short_description = str(soup)
        
        # Limiter la longueur
        if len(short_description) > 500:
            short_description = short_description[:497] + '...'

        # Date de publication
        published_raw = entry.get('published', entry.get('updated', ''))
        published_at_iso = rfc2822_to_iso8601(published_raw)
        
        # Si pas de date, utiliser maintenant
        if not published_at_iso:
            published_at_iso = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')

        try:
            cursor.execute("""
                INSERT OR IGNORE INTO articles 
                (title, url, short_description, published_at, category, category_slug, lang)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (title, url, short_description, published_at_iso, category, category_slug, lang))
            
            if cursor.rowcount > 0:
                count += 1
        except Exception as e:
            print(f"   ⚠️ Erreur insertion: {e}")

    conn.commit()
    return count


def read_articles_from_db(limit=10, lang=None):
    """Affiche les derniers articles (debug)"""
    query = """
        SELECT title, category, lang, published_at
        FROM articles
    """
    params = []
    
    if lang:
        query += " WHERE lang = ?"
        params.append(lang)
    
    query += " ORDER BY published_at DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()

    print(f"\n📰 Derniers {limit} articles" + (f" ({lang})" if lang else "") + ":")
    for row in rows:
        title, category, article_lang, published_at = row
        flag = "🇫🇷" if article_lang == 'fr' else "🇬🇧"
        print(f"  {flag} [{category}] {title[:60]}...")


def delete_old_articles(older_than_days=30):
    """Supprime les articles de plus de X jours"""
    cursor.execute("""
        DELETE FROM articles
        WHERE published_at < datetime('now', ? || ' days')
    """, (-older_than_days,))
    
    deleted = cursor.rowcount
    conn.commit()
    
    if deleted > 0:
        print(f"🗑️  {deleted} anciens articles supprimés (>{older_than_days} jours)")


def get_stats():
    """Affiche les statistiques de la DB"""
    cursor.execute("""
        SELECT lang, COUNT(*) as count 
        FROM articles 
        GROUP BY lang
    """)
    stats_lang = cursor.fetchall()
    
    cursor.execute("""
        SELECT category_slug, lang, COUNT(*) as count 
        FROM articles 
        GROUP BY category_slug, lang
        ORDER BY category_slug, lang
    """)
    stats_cat = cursor.fetchall()
    
    print("\n📊 Statistiques DB:")
    print("   Par langue:")
    for lang, count in stats_lang:
        flag = "🇫🇷" if lang == 'fr' else "🇬🇧"
        print(f"      {flag} {lang.upper()}: {count} articles")
    
    print("   Par catégorie:")
    current_cat = None
    for cat, lang, count in stats_cat:
        if cat != current_cat:
            print(f"      {cat}:")
            current_cat = cat
        flag = "🇫🇷" if lang == 'fr' else "🇬🇧"
        print(f"         {flag} {count}")


# ============================================
# EXÉCUTION PRINCIPALE
# ============================================
if __name__ == "__main__":
    print("🚀 Fluxelia RSS Scraper (i18n)")
    print("=" * 40)
    
    create_table()
    rss_flux()
    delete_old_articles(30)
    get_stats()
    
    conn.close()
    print("\n✅ Terminé!")