import requests
from bs4 import BeautifulSoup
import sqlite3

# Define the base URL for a Google search query
base_url = "https://www.google.com/search?q="

# Search query
query = "陳彥竹 情趣夢天堂"

# Custom headers to simulate a real user visit
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
}

# Connect to the database and create a table to store the data
conn = sqlite3.connect('search_results.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS google_search_results
             (title text, link text PRIMARY KEY, snippet text)''')
conn.commit()

# Perform the search request
response = requests.get(base_url + query, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Find all search result elements
search_results = soup.find_all("div", class_="tF2Cxc")

for result in search_results:
    title = result.find("h3").text
    link = result.find("a")["href"]
    snippet_div = result.find("div", class_="VwiC3b")  # Adjusted class name for snippet
    snippet = snippet_div.get_text(separator=" ", strip=True) if snippet_div else "No snippet available"
    
    # Insert the search result into the database
    try:
        c.execute("INSERT INTO google_search_results VALUES (?, ?, ?)", (title, link, snippet))
    except sqlite3.IntegrityError:
        print(f"Duplicate entry for {link}, skipping.")
        continue

conn.commit()

# Close the database connection
conn.close()

print("Search results have been saved to the database.")
