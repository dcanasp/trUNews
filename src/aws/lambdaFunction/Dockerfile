FROM public.ecr.aws/lambda/nodejs:18
#a donde va, no de donde viene
WORKDIR /var/task

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "lambdaPoblate.main" ]
