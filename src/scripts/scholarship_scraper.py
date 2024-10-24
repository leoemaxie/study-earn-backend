#!/usr/bin/env python

from unicodedata import category
import requests
from bs4 import BeautifulSoup
import json
import re
import html
import os

base_url = os.getenv('BASE_URL', 'https://www.scholarshipair.com')

def clean_json_ld(json_ld_string):
    # Remove control characters and other unwanted characters
    json_ld_string = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', json_ld_string)
    # Remove unwanted Unicode escape sequences
    json_ld_string = re.sub(r'\\u[0-9a-fA-F]{4}', '', json_ld_string)
    return json_ld_string

def sanitize_description(description):
    # Unescape HTML entities
    description = html.unescape(description)
    # Parse the description with BeautifulSoup to remove HTML tags
    soup = BeautifulSoup(description, 'html.parser')
    return soup.get_text(separator=' ', strip=True)

def extract_details(description):
    # Unescape HTML entities
    description = html.unescape(description)
    # Parse the description with BeautifulSoup
    soup = BeautifulSoup(description, 'html.parser')
    
    # Extract application deadline
    deadline_tag = soup.find('h2', string=re.compile(r'Application Deadline', re.I))
    if deadline_tag:
        deadline_date_tag = deadline_tag.find_next('b')
        application_deadline = deadline_date_tag.get_text(strip=True) if deadline_date_tag else 'No deadline available'
    else:
        application_deadline = 'No deadline available'

    # Extract apply link
    apply_link_tag = deadline_tag.find_next('a')
    apply_link = apply_link_tag['href'] if apply_link_tag else 'No apply link available'

    # Extract category
    category_tag = soup.find('td').find_next('a')
    print(category_tag)
    category = [category_tag.get_text(strip=True) if category_tag else "Scholarship"]

    return apply_link, application_deadline, category

def get_scholarship_details(link):
    try:
        response = requests.get(base_url + link)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract JSON-LD data
        json_ld_script = soup.find('script', type='application/ld+json')
        if json_ld_script:
            json_ld_string = json_ld_script.string
            cleaned_json_ld_string = clean_json_ld(json_ld_string)
            json_ld_data = json.loads(cleaned_json_ld_string)
            url = json_ld_data.get('mainEntityOfPage', {}).get('@id', 'No URL available')
            title = json_ld_data.get('headline', 'No title available')
            date_published = json_ld_data.get('datePublished', 'No date published available')
            articleBody = json_ld_data.get('articleBody', 'No description available')
            description = sanitize_description(articleBody.split('div')[0])
            apply_link, application_deadline, category = extract_details(articleBody)
        
        return {
            'title': title,
            'description': description.rstrip('<"'),
            'datePublished': date_published,
            'url': url,
            'applyLink': apply_link,
            'applicationDeadline': application_deadline,
            'category': category
        }
    except (TypeError, json.JSONDecodeError) as e:
        print(f"Error fetching details for {link}: {e}")
        return {
            'title': 'Error fetching title',
            'description': 'Error fetching description',
            'datePublished': 'Error fetching date published',
            'url': 'Error fetching URL',
            'applyLink': 'Error fetching apply link',
            'applicationDeadline': 'Error fetching application deadline'
        }

def scrape_scholarships():
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        scholarships = []
        
        for item in soup.select('.item-list-li'):
            link = item.select_one('.item-h2 a')['href']
            details = get_scholarship_details(link)
            scholarships.append(details)
        
        return scholarships
    except Exception as e:
        print(f"Error scraping scholarships: {e}")
        return []

def main():
    scholarships = scrape_scholarships()
    if scholarships:
        with open('scholarships.json', 'w') as f:
            json.dump(scholarships, f, indent=2)
    else:
        print("No scholarships found.")

if __name__ == '__main__':
    main()