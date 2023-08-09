FROM mirrors.tencent.com/mms1stest/mms1snoderun:base
#FROM mirrors.tencent.com/mms1stest/mms1snoderun:latest

USER root

ENV PATH="/root/.nvm/versions/node/v16.16.0/bin:$PATH"

RUN mkdir -p /home/qspace/mms1suitestsvr/log
RUN mkdir -p /home/qspace/mms1suitestsvr/etc
RUN mkdir -p /home/qspace/mms1suitestsvr/bin

RUN mkdir -p /home/qspace/mms1suitestsvr/bin/jest-puppeteer-ui-test/static/res
RUN mkdir -p /home/qspace/mms1suitestsvr/bin/jest-puppeteer-ui-test/static/pic
RUN mkdir -p /home/qspace/mms1suitestsvr/bin/jest-puppeteer-ui-test/static/pic_diff

WORKDIR /app

COPY ./mms1suitestsvr /home/qspace/mms1suitestsvr/bin
RUN chmod 777 /home/qspace/mms1suitestsvr/bin/mms1suitestsvr


COPY ./jest-puppeteer-ui-test /home/qspace/mms1suitestsvr/bin/jest-puppeteer-ui-test


WORKDIR /home/qspace/mms1suitestsvr/bin/jest-puppeteer-ui-test



RUN npm config set registry https://mirrors.tencent.com/npm/ \
    && npm install --force\
    && npm install jest

WORKDIR /home/qspace/mms1suitestsvr/bin

#CMD ["bash", "-c", "./mms1suitestsvr"]
CMD ["/bin/bash"]
