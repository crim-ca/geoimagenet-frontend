from passlib.hash import pbkdf2_sha512
import base64
import os


def generate_session_id():
    return base64.b64encode(os.urandom(16))


class Session:
    def __init__(self, user_store: dict=None, session_store: dict=None):
        self.user_store = user_store or {}
        self.session_store = session_store or {}

    def validate_login(self, user_name, password):
        if self.user_store[user_name]:
            password_hash = self.user_store[user_name]
            return pbkdf2_sha512.verify(password, password_hash)
        return False

    def validate_session(self, cookie):
        if cookie in self.session_store and 'active' in self.session_store[cookie]:
            return self.session_store[cookie]['active'] is True
        return False

    def create_session_cookie(self, user_name):
        session_id = generate_session_id()
        session_hash = pbkdf2_sha512.hash(session_id)
        self.session_store[session_hash] = {
            'user_name': user_name,
            'active': True
        }
        return session_hash

    def end_session(self, session_id):
        if session_id in self.session_store:
            self.session_store[session_id]['active'] = False
