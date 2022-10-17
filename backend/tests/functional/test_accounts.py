def test_create_user(app_with_db):
    # when
    response = app_with_db.post(
        "/account",
        json={"username": "Alejandro19",
              "password": "_mypass1293_",
              "nom": "Alejandro",
              "email": "alex19@gmail.com",
              "cognom": "Torso",
              "birthdate": "2002-01-10",
              "is_admin": 0},
    )
    # then
    assert response.status_code == 201


def test_get_user_by_username(app_with_data):
    # given
    app_with_data.post(
        "/account",
        json={"username": "CarlesCJB",
              "password": "foewfeof213",
              "nom": "Carles",
              "email": "carletes@gmail.com",
              "cognom": "Duran",
              "birthdate": "1995-01-10",
              "is_admin": 0},
    )

    # when
    response = app_with_data.get(
        "/account/CarlesCJB",
    )

    # then
    assert response.status_code == 200
    data = response.json
    assert data["account"]["username"] == "CarlesCJB"


def test_delete_user(app_with_data):
    # given
    app_with_data.post(
        "/account",
        json={"username": "EmmaRadu",
              "password": "20o31fnka",
              "nom": "Emma",
              "email": "emmaradu@gmail.com",
              "cognom": "Raducanu",
              "birthdate": "1998-01-10",
              "is_admin": 0},
    )

    # when
    response = app_with_data.delete(
        "/account/EmmaRadu",
    )

    # then
    assert response.status_code == 200
