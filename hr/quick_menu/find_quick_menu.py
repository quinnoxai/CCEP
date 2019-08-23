from ..keyword_search import find_word

def get_quick_menus(sentence):
    sentence=sentence.lower()
    print("Line no 5 find quick menu",sentence)
    quick_menu_guide={
        "faq": {"response": "Here are some frequently asked questions", "response_complete":"yes", "category_required": "yes","output":"quick_menu","master_intent":["FAQ"],
                "data": {"data": [{"name": "Reset Password"}, {"name": "Unlock Account"}]}}

    }
    return quick_menu_guide.get('faq')



def check_word_with_list(sentence,list_words):
    value=list(x for x in list_words if find_word(sentence,x))
    if value:
        return True
    else:
        return False
