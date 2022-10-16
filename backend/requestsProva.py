import requests

url3 = "http://127.0.0.1:5000/account"

usuari1 = {
    'username': 'faf',
    'password': 'jifiaf',
    'nom': 'Jav',
    'email': 'ad',
    'cognom': 'Gonzalez',
    'birthdate': '2002-01-10',
    'is_admin': 0
}

response3 = requests.post(url3, json=usuari1)
print(response3.text)
