# build environment
FROM node:14.15.5 as build

# https://stackoverflow.com/questions/44633419/no-access-permission-error-with-npm-global-install-on-docker-image
ENV USER=node
ENV PATH="/home/node/.npm-global/bin:${PATH}"
ENV NPM_CONFIG_PREFIX="/home/node/.npm-global"
# All subsequent commands are run as the `node` user.
USER node
WORKDIR /home/node
# make dir here to avoid permission error
RUN mkdir -p ./frontend/dist

COPY package*.json ./
RUN npm install

COPY snowpack.config.js snowpack-prod.config.js ./
COPY ./frontend/src ./frontend/src
RUN ./node_modules/.bin/snowpack build --config snowpack-prod.config.js

# prod environment
FROM python:3.8-slim-buster

COPY requirements.txt /tmp/

RUN useradd --create-home appuser
WORKDIR /home/appuser
USER appuser

RUN python -m venv venv && venv/bin/pip install --upgrade pip && venv/bin/pip install -r /tmp/requirements.txt

COPY backend ./backend
COPY frontend/static ./frontend/static
COPY frontend/templates ./frontend/templates
COPY --from=build /home/node/frontend/dist ./frontend/dist

CMD ["venv/bin/uvicorn", "backend.main:app"]
