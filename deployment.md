# Deployment

App deployment is done with a Cloudflare Tunnel and a Docker container. This requires that you have Docker installed on your host machine and you have a valid Cloudflare domain name with a configured tunnel. See their [docs](https://developers.cloudflare.com/tunnel/) for help setting this up.

## Environment 
The `.env` file must be located at `MixMover/server/`. It must contain all fields or the Docker container will refuse to start. A `.env.example` file is provided to get you started, and defines all fields needed.

A `MixMover/server/data` directory must exist and have `764` (octal) permissions so that the container's SQLite can write to it.

A valid deployment's file structure looks like:
```bash
MixMover/
├── compose.prod.yml
└── server
    ├── data
    │   ├── database.db     # created automatically on first run
    │   ├── database.db-shm # created automatically on first run
    │   └── database.db-wal # created automatically on first run
    └── .env
```

## Docker 

Docker images are built automatically using a GitHub workflow and hosted on the GHCR, but can alternatively be built locally. To build and run the image locally:
```bash
sudo docker compose -f compose.repo-build.yml
```
To pull and run the latest built image from the GHCR (recommended):
```bash
sudo docker compose -f compose.prod.yml
```
> [!NOTE]
> The build workflow must be triggered manually via the Actions menu in the repository. This is to mitigate problems when rapidly committing to `main`, keeps images uncluttered and reduces wasteful compute time.

## Cloudflare Tunnel

The Cloudflare tunnel daemon must be run on the machine that hosts the container. Wherever the compose file for the tunnel exists, there must also be a `.env` file that provides the compose file with the CLOUDFLARE_TUNNEL_TOKEN. Here is the standard `docker compose` entry used to run the tunnel daemon:
```yaml
cloudflared:
    container_name: cloudflared-mixmover-tunnel
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    command: tunnel -no-autoupdate run
    # TUNNEL_TOKEN is automatically searched for when running the Cloudflare tunnel
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
```
You may elect to add this to your existing `compose.prod.yml` file to run both the mixmover container and the tunnel simultaneously, or create separate directories for both.