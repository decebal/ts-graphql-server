FROM phusion/baseimage:0.10.1

RUN set -x \
    && apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y \
    binutils-gold \
    curl \
    g++ \
    gcc \
    gnupg \
    make \
    python

# Install NodeJS
RUN echo "Install NodeJS"
RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# gpg keys listed at https://github.com/nodejs/node#release-team
RUN set -ex \
  && for key in \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    56730D5401028683275BD23C23EFEFE93C4CFFFE \
    77984A986EBC2AA786BC0F66B01FBB92821C587A \
    8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
  ; do \
    gpg --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$key" || \
    gpg --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$key" || \
    gpg --keyserver hkp://pgp.mit.edu:80 --recv-keys "$key" ; \
  done

ENV NODE_VERSION 10.7.0

RUN buildDeps='xz-utils' \
    && ARCH= && dpkgArch="$(dpkg --print-architecture)" \
    && case "${dpkgArch##*-}" in \
      amd64) ARCH='x64';; \
      ppc64el) ARCH='ppc64le';; \
      s390x) ARCH='s390x';; \
      arm64) ARCH='arm64';; \
      armhf) ARCH='armv7l';; \
      i386) ARCH='x86';; \
      *) echo "unsupported architecture"; exit 1 ;; \
    esac \
    && set -x \
    && apt-get update && apt-get install -y ca-certificates curl wget $buildDeps --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
    && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
    && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
    && grep " node-v$NODE_VERSION-linux-$ARCH.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
    && tar -xJf "node-v$NODE_VERSION-linux-$ARCH.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
    && rm "node-v$NODE_VERSION-linux-$ARCH.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
    && apt-get purge -y --auto-remove $buildDeps \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN echo "Finish Installing NodeJs"
# Finish Installing NodeJS

# Install NGINX
RUN echo "Install NGINX"
ENV NGINX_VERSION 1.15.2

RUN apt-get update -qq && apt-get install -yqq --no-install-recommends ca-certificates build-essential wget libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev

RUN wget http://www.openssl.org/source/openssl-1.0.2d.tar.gz \
  && tar -xvzf openssl-1.0.2d.tar.gz \
  && cd openssl-1.0.2d \
  && ./config \
    --prefix=/usr \
    --openssldir=/usr/ssl \
  && make && make install \
  && ./config shared \
    --prefix=/usr/local \
    --openssldir=/usr/local/ssl \
  && make clean \
  && make && make install

RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
  && tar -xzvf nginx-${NGINX_VERSION}.tar.gz

COPY docker/nginx/conf /nginx-${NGINX_VERSION}/auto/lib/openssl/

RUN cd nginx-${NGINX_VERSION} \
  && ./configure \
    --prefix=/usr/local/nginx \
    --sbin-path=/usr/sbin/nginx \
    --conf-path=/etc/nginx/nginx.conf \
    --pid-path=/var/run/nginx.pid \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --with-http_ssl_module \
    --with-http_v2_module \
    --with-openssl=/usr \
    --with-http_realip_module \
    --with-http_stub_status_module \
    --with-threads \
    --with-ipv6 \
  && make \
  && make install

RUN apt-get purge build-essential -yqq \
  && apt-get autoremove -yqq

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN rm -rf /nginx-${NGINX_VERSION}.tar.gz /openssl-1.0.2d.tar.gz

RUN echo "FINISH Installing NGINX with HTTP2 support"
# FINISH Installing NGINX with HTTP2 support

# Install OS Services
ADD ./services/ /etc/service/
RUN chmod -v +x /etc/service/*/run && chmod -v +x /etc/service/*/finish && chmod -v +x /etc/service/*/*/run

# Setting the directory
RUN mkdir -p /var/www/api
WORKDIR /var/www/api

# Install Dependencies
RUN npm install pm2 -g
COPY ./package*.json /var/www/api/
RUN npm i

# Copying the source.
COPY ./src/ /var/www/api/src/
COPY ./tsconfig.json /var/www/api/tsconfig.json
COPY ./tslint.json /var/www/api/tslint.json

ENV NODE_ENV=production \
    LOGGER_LEVEL=info

COPY ./pm2*.json /var/www/api/

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf.d/api.conf /etc/nginx/conf.d/api.conf

