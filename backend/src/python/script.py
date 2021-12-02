import os
import sys
from glob import glob
import pickle
import itertools
import numpy as np
from scipy.stats import zscore
from sklearn.model_selection import train_test_split

### Graph imports ###
import matplotlib.pyplot as plt
from PIL import Image
import pandas as pd

### Audio import ###
import librosa
import IPython
from IPython.display import Audio

### Plot imports ###
from IPython.display import Image
import matplotlib.pyplot as plt

### Time Distributed ConvNet imports ###
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Input, Dense, Dropout, Activation, TimeDistributed, concatenate
from tensorflow.keras.layers import Conv2D, MaxPooling2D, AveragePooling2D, BatchNormalization, LeakyReLU, Flatten
from tensorflow.keras.layers import LSTM
from tensorflow.keras.optimizers import Adam, SGD
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras import backend as K
from keras.utils import np_utils
from sklearn.preprocessing import LabelEncoder

### Warning ###
import warnings
warnings.filterwarnings('ignore')

from tensorflow.keras.models import load_model
model=load_model("src/python/Emotion_Model (1).h5")

path_ = 'uploads/' + sys.argv[1] + ".wav"

s = []

# Sample rate (16.0 kHz)
sample_rate = 16000     

# Max pad lenght (3.0 sec)
max_pad_len = 49100

X, sample_rate = librosa.load(path_,duration=3,offset=0.5)
sample_rate = np.array(sample_rate)

y = zscore(X)
    
# Padding or truncated signal 
if len(y) < max_pad_len:    
    y_padded = np.zeros(max_pad_len)
    y_padded[:len(y)] = y
    y = y_padded
elif len(y) > max_pad_len:
    y = np.asarray(y[:max_pad_len])

# Add to signal list
s.append(y)



def mel_spectrogram(y, sr=16000, n_fft=512, win_length=256, hop_length=128, window='hamming', n_mels=128, fmax=4000):
    
    # Compute spectogram
    mel_spect = np.abs(librosa.stft(y, n_fft=n_fft, window=window, win_length=win_length, hop_length=hop_length)) ** 2
    
    # Compute mel spectrogram
    mel_spect = librosa.feature.melspectrogram(S=mel_spect, sr=sr, n_mels=n_mels, fmax=fmax)
    
    # Compute log-mel spectrogram
    mel_spect = librosa.power_to_db(mel_spect, ref=np.max)
    
    return mel_spect

mel_spect = np.asarray(list(map(mel_spectrogram, s)))

win_ts = 128
hop_ts = 64

# Split spectrogram into frames
def frame(x, win_step=128, win_size=64):
    nb_frames = 1 + int((x.shape[2] - win_size) / win_step)
    frames = np.zeros((x.shape[0], nb_frames, x.shape[1], win_size)).astype(np.float32)
    for t in range(nb_frames):
        frames[:,t,:,:] = np.copy(x[:,:,(t * win_step):(t * win_step + win_size)]).astype(np.float32)
    return frames

# Frame for TimeDistributed model
x = frame(mel_spect, hop_ts, win_ts)

x = x.reshape(x.shape[0], x.shape[1] , x.shape[2], x.shape[3], 1)

preds = model.predict(x)

preds=preds.argmax(axis=1)

print(preds[0])


import librosa
import numpy as np

audio_path = path_
x , sr = librosa.load(audio_path)

mfccs = librosa.feature.mfcc(x, sr=sr)

mfccs_means = np.mean(mfccs, axis = 1)
print(",".join(str(e) for e in mfccs_means))