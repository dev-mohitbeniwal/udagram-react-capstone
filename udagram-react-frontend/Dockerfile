FROM node:12.18.3

LABEL version="1.0"
LABEL description="This is image of udagram frontend capstone project by mohit"
LABEL maintainer = ["dev.mohitbeniwal@gmail.com"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]