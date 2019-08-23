import re
def find_word(text, search):
    result = re.findall('\\b' + search + '\\b', text, flags=re.IGNORECASE)
    if len(result) > 0:
        return True
    else:
        return False