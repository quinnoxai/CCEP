from django import forms

class NameForm(forms.Form):
    user_name = forms.CharField(label='User name', max_length=100)
    user_password = forms.CharField(label = 'User Password', max_length=100)
