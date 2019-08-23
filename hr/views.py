from translate import Translator
import goslate
from .form import NameForm
import json
from pymongo import MongoClient
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.contrib.auth import login,logout,authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .main_action_faq import get_response

from .models import CalypsoUser

# Create your views here.
def add_user_page(request):
    return render(request,"Register.html")

"""def login_user(request):
    return render(request,"login.html")"""


def add_user(request):
    if request.method=='POST':

        firstname=request.POST['firstname']
        print("First name",firstname)
        lastname=request.POST['lastname']
        username=request.POST['username']
        role=request.POST['Role']
        password=request.POST['password']
        user=CalypsoUser(firstname=firstname,lastname=lastname,username=username,role=role,password=password)
        print("User Info:",user)
        user.save()
    print("Here in add_user" )
    return render(request,"login.html")



def homepage(request):
    # print("user name",request.session["user"])
    request.session["pre_state"]={}
    return render(request, "home.html")

#----login over---

## logout view
# @api_view(['GET','POST'])

##function to get the userdata and welcome message

"""@api_view(["GET","POST"])
def get_welcome_message(request):
  #access_token = get_access_token(request, request.build_absolute_uri(reverse('gettoken')))
  # If there is no token in the session, redirect to home

    return HttpResponseRedirect(reverse('home'))"""




###chatview


@ensure_csrf_cookie
@api_view(['GET', 'POST'])
def chat(request):
    if request.method == 'GET':
        return Response(status=status.HTTP_403_FORBIDDEN,data={"message":"error"})
    elif request.method == 'POST':
        if "pre_state" not in request.session:
            request.session["pre_state"]={}
        input_dict = request.data
        print("here in post",input_dict)
        dict_rec=request.session["pre_state"]
        user_info=request.session["user_info"]
        dict_rec=get_response(input_dict["message"],dict_rec,user_info)
        request.session["pre_state"]=dict_rec
        if "response_complete" not in dict_rec:
            request.session["pre_state"]={}
        print("dc in views",dict_rec)
        print("my changed option",request.data)
        translated_dict_rec=translator(request,dict_rec)


        return Response(status=status.HTTP_200_OK, data=translated_dict_rec)



@api_view(['GET','POST'])
def refresh_view(request):
    # print("Here in refresh")
    if "dict_rec" in request.session:
        # print("Here in refresh view", request.session["dict_rec"])
        request.session["dict_rec"]={}
        # del request.session["dict_rec"]
        # print("Deleted")
    return Response(status=status.HTTP_200_OK)

@api_view(['GET','POST'])
def login_user(request):
    print("hey login")
    return render(request,"login.html")


def loginData(request):
    if request.method == 'POST':
        username=request.POST['username']
        print("Username",username)
        password=request.POST['password']
        print("password",password)
        if (len(request.POST['languageSelect']) == 0):
            lang = "english"
        else:
            lang = request.POST['languageSelect']
        conn = MongoClient()
        db = conn.calypso
        collection = db.calypso_user
        for db_username in collection.find({'username':username,'password':password}):
            database_user=(db_username["username"])
            database_first=(db_username["firstname"])
            database_password =(db_username["password"])
            print("password",password)
            role_user = db_username["role"]
            if password==database_password:
                print("Succesful")
                request.session["user_info"]={"username":database_user,"role":role_user,"firstname":db_username["firstname"],"language":lang}
                return render(request,"home.html",{'firstname' : database_first})
            else:
                return redirect("/helpdesk/login")
        return redirect("/helpdesk/login")

@api_view(['GET','POST'])
def welcome_msg(request):
    if request.method == 'POST':
        user_info=request.session["user_info"]
        request.session["pre_state"]={}
        print("user",user_info)
        user_info["response"]="Hi "+user_info["firstname"] + "<br>I am Fizzy. How can I help you?"
        return Response(status=status.HTTP_200_OK,data=user_info)
    else:
         return Response(status=status.HTTP_404_NOT_FOUND)



def logout(request):
    if request.method == 'POST':
        print("logged out")
        logout(request)
    return render(request,"login.html")


def translator(request,dict_rec):
    if request.method == 'POST':
        #print(request.POST['languageSelect'])
        user_info=request.session["user_info"]

        lang = user_info["language"]
        print("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",type(lang),lang)
        select_lang = lang.lower()
        print("llllllllllllllllllllllllllllllll",type(select_lang),select_lang)
        print(select_lang)
        translator= Translator(from_lang="english",to_lang=select_lang)
        print("Language>>>>>",select_lang)
        print("In translate")
        dict_rec["response"] = translator.translate(dict_rec["response"])
        print("Line no 150",dict_rec)
    return dict_rec
