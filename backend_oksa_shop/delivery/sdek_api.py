from datetime import datetime, timedelta
import requests
from django.conf import settings




class SdekApiClient:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SdekApiClient, cls).__new__(cls)
            cls._instance.token = None
            cls._instance.expires_at = None
        return cls._instance
    def __init__(self):
        self.base_url = settings.SDEK_API_URL
        self.client_id = settings.SDEK_API_ID
        self.client_secret = settings.SDEK_API_SECRET
    def get_auth_token(self):
        if self.token and self.is_token_valid():
            return self.token
        url = f"{self.base_url}/v2/oauth/token"
        data = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = requests.post(url, params=data, headers=headers)


        if response.status_code == 200:
            self.token = response.json().get('access_token')
            expires_in = response.json().get('expires_in', 3600)
            self.expires_at = datetime.now() + timedelta(seconds=expires_in)
            return self.token
        else:
            return None
    def is_token_valid(self):
        return self.expires_at > datetime.now()

    def get_city(self, city_name):
        """Получение городов по названию"""
        token = self.get_auth_token()
        if not token:
            return None
        url = f"{self.base_url}/v2/location/suggest/cities"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        params = {
            "name": city_name  # Параметр для поиска города по названию
        }
        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            return response.json()  # Возвращаем список найденных городов
        else:
            return None  # Обработка ошибки

    def get_city_detail(self, city_code):
        token = self.get_auth_token()
        if not token:
            return None
        url = f"{self.base_url}/v2/location/cities"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        params = {
            "code": city_code  # Параметр для поиска города по названию
        }
        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            return response.json()  # Возвращаем список найденных городов
        else:
            return None  # Обработка ошибки
    def get_offices(self, city_code):
        """Получение пунктов СДЭК по коду города"""
        token = self.get_auth_token()
        if not token:
            return None
        url = f"{self.base_url}/v2/deliverypoints"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        params = {
            "city_code": city_code  # Параметр для поиска офисов по коду города
        }
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return response.json()  # Возвращаем список офисов
        else:
            return None  # Обработка ошибки

    def get_tarifflist(self, sity_code):
        """Расчет стоимости доставки"""
        token = self.get_auth_token()
        if not token:
            return None
        url = f"{self.base_url}/v2/calculator/tarifflist"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        data = {
            "type": 1,
            "from_location": {
                    "code": 44,
                    "postal_code": 109341,
                    "city": "Москва",
                    "address": "Братиславская д.6",
                    "contragent_type": "LEGAL_ENTITY"
            },
            "to_location": {
                    "code": sity_code,
                    "postal_code": "",
                    "country_code": "",
                    "city": "",
                    "address": "",
                    "contragent_type": "INDIVIDUAL"
            },
              "packages": [
            {
              "weight": 300,
              "length": 15,
              "width": 15,
              "height": 5
            }
            ]
            # Добавьте другие необходимые параметры для расчета тарифа
        }
        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 200:
            return response.json()  # Возвращаем информацию о тарифах
        else:
            return None  # Обработка ошибки

    def oreder(self, tariff_code, delivery_point=None, to_location=None):
        """Заказ доставки"""
        token = self.get_auth_token()
        if not token:
            return None
        url = f"{self.base_url}/v2/orders"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        main_data = {
            "type": 1,
            "tariff_code": tariff_code,  # Код тарифа
            "shipment_point": "MSK2336",
            "print": "WAYBILL",
        }

        if delivery_point :
            # код ПВЗ куда отправляем
            pvz = {
                "delivery_point": delivery_point,
            }

        # Обязательно адресс, можно city_uuid, город, fias, postal_code, longitude, latitude
        to = {"to_location": {
            "code": 0,
            "city_uuid": "061925d2-e3ae-4fc4-b824-0a1be89f77be",
            "city": "string",
            "country_code": "string",
            "country": "string",
            "region": "string",
            "region_code": 0,
            "sub_region": "string",
            "longitude": 0.1,
            "latitude": 0.1,
            "time_zone": "string",
            "address": "string",  # обязательное поле
            "postal_code": "string"
        }, }

        # ФИО, Емайл, телефон(можно несколько)
        recip = {"recipient": {
            "name": "string",
            "contragent_type": "INDIVIDUAL",
            "email": "string",
            "phones": [
                {
                    "number": "string",
                    "additional": "string"
                }
            ]
        }, }
        # Номер заказа, вес общ, длинна, ширина, высота, по товарам: Навание ,артикул, вес, сколько, стоимость
        pack = {"packages": [
            {
                "number": "string",
                # Номер упаковки (можно использовать порядковый номер упаковки заказа или номер заказа), уникален в пределах заказа. Идентификатор заказа в ИС Клиента
                "weight": 0,  # Общий вес (в граммах)
                "length": 0,
                "width": 0,
                "height": 0,
                "comment": "string",
                "items": [
                    {
                        "name": "string",  # Наименование товара
                        "ware_key": "string",  # Идентификатор/артикул товара.
                        "payment": {
                            "value": 0
                        },
                        "weight": 0,  # Вес
                        "amount": 0,  # колчество едениц
                        "cost": 0,  # Стоимость , С данного значения рассчитывается страховка.
                    }
                ]
            }
        ], }

        data = {**main_data, **pvz, **to, **recip, **pack}