#!/usr/bin/env python3
"""
This script scrapes the staff details of a department from the LAUTECH staff directory
"""

import requests
from bs4 import BeautifulSoup
import uuid
import random
import re
import json
import sys

def generate_uuid():
    return str(uuid.uuid4())

def generate_phone_number():
    return f"+234{random.choice([7, 8, 9])}0{random.randint(10000000, 99999999)}"

def generate_password():
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
    password = ''.join(random.choice(chars) for _ in range(10))
    while not (re.search(r'[A-Z]', password) and re.search(r'[a-z]', password) and re.search(r'[0-9]', password) and re.search(r'[!@#$%^&*()]', password)):
        password = ''.join(random.choice(chars) for _ in range(10))
    return password

def parse_name(name):
    name_parts = name.split()
    if len(name_parts) == 4:
        return name_parts[1], name_parts[3]
    elif ',' in name:
        last_name, first_name = name.split(', ')
        return first_name.split()[0], last_name
    else:
        return name_parts[0], name_parts[-1]
    
def safe_list_get(l, idx, default=''):
    try:
        return l[idx]
    except IndexError:
        return default

def generate_email(first_name, third_name, last_name):
    return f"{first_name[0].lower()}{safe_list_get(third_name, 0).lower()}{last_name.lower()}@lautech.edu.ng"

def get_page_count(search_key):
    base_url = "https://staff.lautech.edu.ng/index.php/search/node"
    search_url = f"{base_url}?keys={search_key}"
    response = requests.get(search_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    last_page = soup.find('li', class_='pager__item--last').find('a').get('href').split('=')[-1]
    return int(last_page)

def scrape_staff_details(search_key="Mechanical", page=0):
    base_url = "https://staff.lautech.edu.ng/index.php/search/node"
    search_url = f"{base_url}?keys={search_key}&page={page}"
    response = requests.get(search_url)
    soup = BeautifulSoup(response.content, 'html.parser')

    staff_list = []
    staff_update_list = []

    for li in soup.find_all('h3'):
        name_tag = li.find('a')
        name = name_tag.text.strip()
        profile_url = name_tag['href']

        first_name, last_name = parse_name(name)
        third_name = name.split()[2] if len(name.split()) > 2 else ""
        email = generate_email(first_name, third_name, last_name)
        staff_id = generate_uuid()
        phone_number = generate_phone_number()
        password = generate_password()

        profile_response = requests.get(profile_url)
        profile_soup = BeautifulSoup(profile_response.content, 'html.parser')
        description = profile_soup.find_all('div', class_='team-description')

        department = safe_list_get(description[1].text.split(':'), 1).strip()
        picture = profile_soup.find('article').find('img').get('src')
        position = profile_soup.find('div', class_='job').text.strip()
        directorate = description[2].text.split(':')[1].strip()

        staff = {
            "id": staff_id,
            "email": email,
            "password": password,
            "role": "staff",
            "firstName": first_name.title(),
            "lastName": last_name.title(),
            "department": department.replace('Department of ', '') if department else None,
            "phoneNumber": phone_number,
            "picture": f"https://staff.lautech.edu.ng{picture}"
        }

        staff_update = {
            "id": staff_id,
            "position": position,
            "directorate": directorate if directorate else None
        }

        staff_list.append(staff)
        staff_update_list.append(staff_update)

    return staff_list, staff_update_list

def save_data(staff_list, staff_update_list):
    with open('staff.json', 'w') as staff_file:
        json.dump(staff_list, staff_file, indent=4)

    with open('staff.update.json', 'w') as staff_update_file:
        json.dump(staff_update_list, staff_update_file, indent=4)

if __name__ == "__main__":
    try:
        print("Scraping staff details...")
        name = sys.argv[1] if len(sys.argv) > 1 else "Mechanical"
        last_page = get_page_count(name)
        staff_list = []
        staff_update_list = []

        for page in range(0, last_page):
            new_staff_list, new_staff_update_list = scrape_staff_details(name, page)
            staff_list.extend(new_staff_list)
            staff_update_list.extend(new_staff_update_list)
            print(f"Scraped page {page + 1} of {last_page + 1}")

        save_data(staff_list, staff_update_list)
        print("Staff details scraped successfully")
    except Exception as e:
        print(f"An error occurred: {e}")
        raise e