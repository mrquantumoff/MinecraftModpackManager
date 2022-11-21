# Since Fedora uses the latest version of GNOME, the build will be compatible with the latest SDK
FROM fedora:latest

ARG PRIVATE_KEY

ARG TAURI_PASSWORD

ARG GITHUB_TOKEN


ENV TAURI_PRIVATE_KEY ${PRIVATE_KEY}

ENV GITHUB_TOKEN ${GITHUB_TOKEN} 

ENV TAURI_KEY_PASSWORD ${TAURI_PASSWORD}


ADD . /src



ENTRYPOINT ["./entry.sh"]
