import sqlite3
import feedparser
import json
from bs4 import BeautifulSoup
import os
import email.utils
from datetime import datetime, timezone
import time
import random
import gzip
from io import BytesIO

# Pour les requêtes HTTP robustes
try:
    import requests
    USE_REQUESTS = True
except ImportError:
    import urllib.request
    import urllib.error
    USE_REQUESTS = False
    print("⚠️ Module 'requests' non installé, utilisation de urllib (moins fiable)")
    print("   Installez-le avec: pip install requests")

# ============================================
# CONFIGURATION
# ============================================

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
]

REQUEST_DELAY_MIN = 0.5
REQUEST_DELAY_MAX = 1.5
REQUEST_TIMEOUT = 20

# ============================================
# HELPERS
# ============================================

def rfc2822_to_iso8601(rfc2822_date):
    if not rfc2822_date:
        return None
    parsed_time = email.utils.parsedate_tz(rfc2822_date)
    if parsed_time is None:
        return None
    timestamp = email.utils.mktime_tz(parsed_time)
    dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    return dt.isoformat().replace('+00:00', 'Z')


def get_random_user_agent():
    return random.choice(USER_AGENTS)


def get_headers():
    return {
        'User-Agent': get_random_user_agent(),
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/html, */*',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    }


def fetch_feed_with_requests(url):
    try:
        response = requests.get(url, headers=get_headers(), timeout=REQUEST_TIMEOUT, allow_redirects=True)
        response.raise_for_status()
        return feedparser.parse(response.content)
    except requests.exceptions.HTTPError as e:
        print(f"   ❌ HTTP Error {e.response.status_code}")
        return None
    except requests.exceptions.Timeout:
        print(f"   ❌ Timeout après {REQUEST_TIMEOUT}s")
        return None
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection Error")
        return None
    except Exception as e:
        print(f"   ❌ Error: {type(e).__name__}: {e}")
        return None


def fetch_feed_with_urllib(url):
    try:
        request = urllib.request.Request(url, headers=get_headers())
        response = urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT)
        content = response.read()
        if response.info().get('Content-Encoding') == 'gzip':
            try:
                content = gzip.decompress(content)
            except:
                pass
        return feedparser.parse(content)
    except urllib.error.HTTPError as e:
        print(f"   ❌ HTTP Error {e.code}: {e.reason}")
        return None
    except urllib.error.URLError as e:
        print(f"   ❌ URL Error: {e.reason}")
        return None
    except Exception as e:
        print(f"   ❌ Error: {type(e).__name__}: {e}")
        return None


def fetch_feed(url):
    if USE_REQUESTS:
        return fetch_feed_with_requests(url)
    else:
        return fetch_feed_with_urllib(url)


# ============================================
# DATABASE
# ============================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
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
        category TEXT,
        category_slug TEXT,
        lang TEXT DEFAULT 'fr'
    )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_articles_lang ON articles(lang)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_articles_category_lang ON articles(category_slug, lang)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC)")
    conn.commit()
    print("✅ Table 'articles' prête")


def rss_flux():
    flux_path = os.path.join(BASE_DIR, 'flux.json')
    
    with open(flux_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    total_articles = {'fr': 0, 'en': 0}
    failed_feeds = []
    success_feeds = []

    for item in data:
        slug = item['slug']
        categories = item['category']
        feeds_by_lang = item['feeds']

        for lang, feeds in feeds_by_lang.items():
            category_name = categories.get(lang, categories.get('fr'))
            
            for feed_url in feeds:
                short_url = feed_url[:55] + "..." if len(feed_url) > 55 else feed_url
                print(f"📡 [{lang.upper()}] {short_url}")
                
                time.sleep(random.uniform(REQUEST_DELAY_MIN, REQUEST_DELAY_MAX))
                
                try:
                    feed_data = fetch_feed(feed_url)
                    
                    if feed_data is None:
                        failed_feeds.append({'url': feed_url, 'lang': lang, 'error': 'Fetch failed'})
                        continue
                    
                    if not feed_data.entries:
                        if feed_data.bozo:
                            error_msg = str(feed_data.bozo_exception)[:50] if feed_data.bozo_exception else "Unknown"
                            print(f"   ⚠️ Feed erreur: {error_msg}")
                        else:
                            print(f"   ⚠️ Feed vide (0 articles)")
                        failed_feeds.append({'url': feed_url, 'lang': lang, 'error': 'Empty/Error'})
                        continue
                    
                    count = json_to_sqlite(feed_data, category_name, slug, lang)
                    total_articles[lang] += count
                    print(f"   ✅ {count} nouveaux / {len(feed_data.entries)} total")
                    success_feeds.append(feed_url)
                    
                except Exception as e:
                    print(f"   ❌ Exception: {type(e).__name__}: {e}")
                    failed_feeds.append({'url': feed_url, 'lang': lang, 'error': str(e)})

    print(f"\n{'='*40}")
    print(f"📊 RÉSUMÉ")
    print(f"{'='*40}")
    print(f"   ✅ Feeds OK: {len(success_feeds)}")
    print(f"   ❌ Feeds KO: {len(failed_feeds)}")
    print(f"   🇫🇷 FR: {total_articles['fr']} nouveaux articles")
    print(f"   🇬🇧 EN: {total_articles['en']} nouveaux articles")
    
    if failed_feeds:
        print(f"\n⚠️ Feeds en échec:")
        for f in failed_feeds:
            short_url = f['url'][:45] + "..." if len(f['url']) > 45 else f['url']
            print(f"   [{f['lang'].upper()}] {short_url}")
    
    return failed_feeds


def json_to_sqlite(feed_data, category, category_slug, lang):
    count = 0
    
    for entry in feed_data.entries:
        title = entry.get('title', '')
        url = entry.get('link', '')
        
        if not title or not url:
            continue

        description_raw = entry.get('description', entry.get('summary', ''))
        soup = BeautifulSoup(description_raw, 'html.parser')
        
        for tag in soup.find_all(['img', 'script', 'style', 'iframe']):
            tag.decompose()
        
        short_description = soup.get_text(separator=' ', strip=True)
        
        if len(short_description) > 500:
            short_description = short_description[:497] + '...'

        published_raw = entry.get('published', entry.get('updated', ''))
        published_at_iso = rfc2822_to_iso8601(published_raw)
        
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
        except:
            pass

    conn.commit()
    return count


def delete_old_articles(older_than_days=30):
    cursor.execute("""
        DELETE FROM articles
        WHERE published_at < datetime('now', ? || ' days')
    """, (-older_than_days,))
    
    deleted = cursor.rowcount
    conn.commit()
    
    if deleted > 0:
        print(f"\n🗑️  {deleted} anciens articles supprimés (>{older_than_days} jours)")


def get_stats():
    cursor.execute("SELECT lang, COUNT(*) FROM articles GROUP BY lang")
    stats_lang = cursor.fetchall()
    
    print(f"\n{'='*40}")
    print(f"📊 STATISTIQUES DB")
    print(f"{'='*40}")
    
    total = 0
    for lang, count in stats_lang:
        flag = "🇫🇷" if lang == 'fr' else "🇬🇧"
        print(f"   {flag} {lang.upper()}: {count} articles")
        total += count
    print(f"   📰 Total: {total} articles")


# ============================================
# MAIN
# ============================================
if __name__ == "__main__":
    print("🚀 Fluxelia RSS Scraper (i18n)")
    print("=" * 40)
    print(f"📁 DB: {DB_PATH}")
    print(f"🔧 Méthode: {'requests' if USE_REQUESTS else 'urllib'}")
    print()
    
    create_table()
    failed = rss_flux()
    delete_old_articles(30)
    get_stats()
    
    conn.close()
    
    print("\n✅ Terminé!")