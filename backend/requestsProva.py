import requests

# url3 = "http://127.0.0.1:5000/account"
url4 = "http://127.0.0.1:5000/account/asfasfafafsa"

usuari1 = {
    "username": "asfasfafafsa",
    "password": "jifiaf",
    "nom": "Jav",
    "email": "piopiuoyuoyo",
    "cognom": "Gonzalez",
    "birthdate": "2002-01-10",
    "is_admin": 0,
}

# response3 = requests.post(url3, json=usuari1)
response = requests.delete(url4)
print(response.text)
# print(response3.text)
