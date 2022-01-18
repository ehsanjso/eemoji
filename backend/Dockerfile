FROM node:latest

RUN apt-get update -y  \
    && apt-get -y upgrade

WORKDIR /app/

RUN mkdir uploads
RUN apt-get update -y
RUN apt-get install -y python3-pip python-dev build-essential libsndfile1-dev
RUN pip3 install -U llvmlite==0.31.0 scikit-learn scipy matplotlib pandas scipy numpy librosa ipython
RUN pip3 install tensorflow


ADD package.json yarn.lock ./
RUN yarn

ADD . /app/

CMD ["yarn", "prod"]