FROM ubuntu:20.04
# Disable Prompt During Packages Installation
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y  \
    && apt-get -y upgrade

RUN apt-get install -y python3-pip python-dev build-essential libsndfile1-dev wget software-properties-common nodejs npm
RUN npm install --global yarn
#RUN wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-ubuntu1804.pin
#RUN mv cuda-ubuntu1804.pin /etc/apt/preferences.d/cuda-repository-pin-600
#RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
#RUN add-apt-repository "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/ /"
#RUN sudo apt-get update
#RUN apt-get -y install cuda
RUN pip3 install -U llvmlite scikit-learn scipy matplotlib pandas scipy numpy==1.21 librosa ipython Pillow
RUN pip3 install --upgrade tensorflow-cpu

WORKDIR /app/

RUN mkdir uploads

ADD package.json yarn.lock ./
RUN yarn

ADD . /app/

CMD ["yarn", "prod"]