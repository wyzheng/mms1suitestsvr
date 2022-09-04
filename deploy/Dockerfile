FROM mirrors.tencent.com/mms1stest/mms1snoderun:latest

USER root

ENV PATH="/root/.nvm/versions/node/v16.16.0/bin:$PATH"

RUN mkdir -p /home/qspace/log/mms1suitestsvr/error

RUN mkdir /app

WORKDIR /app

COPY ./mms1suitestsvr /app
RUN chmod 755 ./mms1suitestsvr


COPY ./jest-puppeteer-ui-test /app/jest-puppeteer-ui-test


WORKDIR /app/jest-puppeteer-ui-test

RUN npm config set registry https://mirrors.tencent.com/npm/ \
    && npm install \
    && npm install jest

WORKDIR /app

CMD ["bash", "-c", "./mms1suitestsvr"]

