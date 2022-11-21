#!/bin/bash
sudo dnf upgrade -y
sudo dnf install git webkit2gtk3-devel.x86_64 openssl-devel curl wget libappindicator-gtk3 librsvg2-devel glib2-devel -y
sudo dnf group install "C Development Tools and Libraries" -y

sudo dnf install cargo rust nodejs gh -y

curl -fsSL https://get.pnpm.io/install.sh | sh -



cd /src && ~/.local/share/pnpm/pnpm install

cd /src && ~/.local/share/pnpm/pnpm buildt

cd /src && /bin/gh auth --with-token < $GITHUB_TOKEN

mv/src/target/release/bundle/deb/*.deb flatpak-file-do-not-use.deb

cd /src && /bin/gh release upload -R mrquantumoff/MinecraftModpackManager $(git describe --tags --abbrev=0) flatpak-file-do-not-use.deb

cd /src && sha256sum flatpak-file-do-not-use.deb >> flatpak-file-do-not-use.sha256sum
cd /src && /bin/gh release upload -R mrquantumoff/MinecraftModpackManager $(git describe --tags --abbrev=0) flatpak-file-do-not-use.sha256sum

