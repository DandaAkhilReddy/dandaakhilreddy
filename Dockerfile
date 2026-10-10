FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY . /srv

# Don't ship server config as site content
RUN rm -f /srv/Caddyfile /srv/Dockerfile /srv/railway.json /srv/netlify.toml

EXPOSE 8080
