from textblob import TextBlob
translator= TextBlob("Give me your user ID")
translated = translator.translate(from_lang="en",to="es")
print(translated)
