#!/bin/bash
sudo dnf upgrade -y
sudo dnf install webkit2gtk3-devel.x86_64 openssl-devel curl wget libappindicator-gtk3 librsvg2-devel librsvg2-devel -y
sudo dnf group install "C Development Tools and Libraries" -y

sudo dnf install cargo rust nodejs -y

corepack enable
corepack prepare pnpm@latest --activate

cd /src

pnpm install

pnpm buildt

gh auth --with-token < $GITHUB_TOKEN

mv target/release/bundle/deb/*.deb flatpak-file-do-not-use.deb

gh release upload -R mrquantumoff/MinecraftModpackManager $(git describe --tags --abbrev=0) flatpak-file-do-not-use.deb

sha256sum flatpak-file-do-not-use.deb >> flatpak-file-do-not-use.sha256sum
gh release upload -R mrquantumoff/MinecraftModpackManager $(git describe --tags --abbrev=0) flatpak-file-do-not-use.sha256sum

