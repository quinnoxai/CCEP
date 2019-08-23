# things we need for NLP
import nltk
import os

# print(cfs.BASE_DIR)
# Just disables the warning, doesn't enable AVX/FMA
# import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()
# from entity import entity_recognition as er
# things we need for Tensorflow
import numpy as np
import tflearn
import tensorflow as tf
import random
# restore all of our data structures
import pickle
from hrhelpdesk.settings import BASE_DIR

#unpickling intent data
# hrhelpdesk/master_model/training_data_master
# print(os.path.join(BASE_DIR,r'training_data'))
data = pickle.load( open(os.path.join(BASE_DIR,r'hr/small_talk_model/training_data_smalltalk'),"rb" ))
# data = pickle.load(open("training_data_smalltalk","rb" ))
words = data['words']
classes = data['classes']
train_x = data['train_x']
train_y = data['train_y']
# smalltalk
#unpiclking entity data
# data_entity = pickle.load( open( "training_data_entity", "rb" ) )
# words_en= data_entity['words']
# classes_en= data_entity['classes']
# train_x_en = data_entity['train_x_en']
# train_y_en = data_entity['train_y_en']



# import our chat-bot intents file
import json
# with open('intent_new.json')as json_data:
with open(os.path.join(BASE_DIR,r'hr/small_talk_model/intent_new.json'),encoding="utf-8")as json_data:
     intents = json.load(json_data)




#importing entity data
# with open('entities_new.json') as json_data_en:
#     entites = json.load(json_data_en)


check_in = "./checkpoints_smalltalk/master_smalltalk.ckpt"
# check_en="./checkpoints_en/entitymodel.ckpt"

g1 = tf.Graph()
# g2 = tf.Graph()

with g1.as_default():
    # Build neural network
    net = tflearn.input_data(shape=[None, len(train_x[0])])
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, len(train_y[0]), activation='softmax')
    net = tflearn.regression(net)
    # Define model and setup tensorboard
    model = tflearn.DNN(net, tensorboard_dir='tflearn_smalltalk_logs', checkpoint_path=check_in)

# with g2.as_default():
#     net_entity = tflearn.input_data(shape=[None, len(train_x_en[0])])
#     net_entity = tflearn.fully_connected(net_entity, 8)
#     net_entity = tflearn.fully_connected(net_entity, 8)
#     net_entity = tflearn.fully_connected(net_entity, len(train_y_en[0]), activation='softmax')
#     net_entity = tflearn.regression(net_entity)
#     entitymodel = tflearn.DNN(net_entity, tensorboard_dir='tflearn_logs_en', checkpoint_path=check_en)
def clean_up_sentence(sentence):
    # tokenize the pattern
    sentence_words = nltk.word_tokenize(sentence)
    # stem each word
    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
    return sentence_words

# return bag of words array: 0 or 1 for each word in the bag that exists in the sentence
def bow(sentence, words, show_details=False):
    # tokenize the pattern
    sentence_words = clean_up_sentence(sentence)
    # bag of words
    bag = [0]*len(words)
    for s in sentence_words:
        for i,w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print ("found in bag: %s" % w)

    return(np.array(bag))
#en_bow

# def bow_en(sentence, words_en, show_details=False):
#     # tokenize the pattern
#     sentence_words = clean_up_sentence(sentence)
#     # bag of words
#     bag = [0]*len(words_en)
#     # print(words_en)
#     for s in sentence_words:
#         for i,w in enumerate(words_en):
#             if w == s:
#                 bag[i] = 1
#                 if show_details:
#                     print ("found in bag: %s" % w)

    return np.array(bag)

with g1.as_default():
    model.load(os.path.join(BASE_DIR,r'hr/small_talk_model/master_smalltalk.tflearn'))
    # model.load('master_smalltalk.tflearn')

# with g2.as_default():
#     entitymodel.load('./entitymodel.tflearn')
# load our saved model

# entity/entitymodel.tflearn.meta
# create a data structure to hold user context
ERROR_THRESHOLD =0.85 #0.85
list_for_response={}
return_list = []
def classify(sentence):
    # generate probabilities from the model
    results = model.predict([bow(sentence, words)])[0]
    # print(results)
    # filter out predictions below a threshold
    results = [[i,r] for i,r in enumerate(results) if r > ERROR_THRESHOLD]
    # print(results)
    # sort by strength of probability
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append((classes[r[0]]))
        context = return_list[0] #setting the context name as the intent
    # return tuple of intent and probability
    return return_list

