from BingTranslator import Translator
client_id = "BookAboutPyQt5"
client_secret = "RWfmb4O7eO3zbnlTqZaPu8cBmMthaXkonxQA9sQnQ+0="

translator = Translator(client_id, client_secret)
phrase_translated = translator.translate("Hello World", "pt") #translating phrase
print (phrase_translated)
