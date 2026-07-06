# Local PocketBase instance used for testing.
# Build/run it through the docker-compose.yml at the root of the repo.
FROM alpine:3.21

ARG PB_VERSION=0.39.5
# Automatically provided by BuildKit ("arm64" on Apple Silicon, "amd64" on x86).
ARG TARGETARCH

ENV TZ=Europe/Paris \
    PB_SUPERUSER_EMAIL=thomas@gysemans.dev \
    PB_SUPERUSER_PASSWORD=thomasgysemans

RUN apk add --no-cache ca-certificates tzdata unzip

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb && rm /tmp/pb.zip && chmod +x /pb/pocketbase

EXPOSE 8090

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s \
    CMD wget -q --spider http://127.0.0.1:8090/api/health || exit 1

# `superuser upsert` is idempotent and creates the database on first run,
# so the credentials stay valid even with a pre-existing data volume.
CMD /pb/pocketbase superuser upsert "$PB_SUPERUSER_EMAIL" "$PB_SUPERUSER_PASSWORD" --dir /pb_data --migrationsDir /pb_migrations \
 && /pb/pocketbase serve --http 0.0.0.0:8090 --dir /pb_data --migrationsDir /pb_migrations
