Je développe une plateforme VPN basée sur WireGuard. Sur chaque serveur VPN tourne un agent, qui gère l'interface WireGuard pour le compte de l'API. Jusqu'ici, l'agent était déployé dans un conteneur Docker. Ça marchait, mais il fallait installer Docker, écrire un compose, régler les droits réseau du conteneur… pour un simple binaire Go.

J'ai donc changé d'approche : l'agent est maintenant un vrai paquet Linux, installé par apt (ou dnf).

𝗖𝗲 𝗾𝘂𝗲 𝗷'𝗮𝗶 𝗺𝗶𝘀 𝗲𝗻 𝗽𝗹𝗮𝗰𝗲

→ Des paquets .deb et .rpm, en amd64 et arm64, construits avec nfpm. Chaque paquet contient le binaire de l'agent, son service systemd et un script de configuration.
→ Les dépendances sont déclarées dans le paquet (wireguard-tools, iptables, iproute2) : apt les installe tout seul.
→ Les paquets sont construits pendant le build de l'image de l'API, donc l'agent et l'API viennent toujours du même commit.
→ L'API sert les paquets en HTTPS, avec un fichier SHA256SUMS.

𝗟'𝗶𝗻𝘀𝘁𝗮𝗹𝗹𝗮𝘁𝗶𝗼𝗻, 𝗰ô𝘁é 𝗮𝗱𝗺𝗶𝗻

Dans le backoffice, on crée le serveur et on copie la commande affichée. Sur le VPS, elle :
1. détecte la distribution (apt ou dnf) et l'architecture ;
2. télécharge le bon paquet et vérifie son empreinte SHA-256 ;
3. l'installe avec le gestionnaire de paquets du système ;
4. configure l'interface wg0 et démarre le service systemd.

Ensuite, l'API se connecte à l'agent et l'enrôle toute seule. Le serveur apparaît alors dans l'application.

Pour ceux qui préfèrent tout faire à la main, le backoffice donne aussi les commandes une par une, pour Debian/Ubuntu et RHEL/Fedora, en amd64 comme en arm64.

𝗖𝗲 𝗾𝘂𝗲 ç𝗮 𝗰𝗵𝗮𝗻𝗴𝗲

✅ Plus besoin de Docker sur les serveurs VPN
✅ systemd redémarre l'agent en cas de crash, et ses logs sont dans journalctl
✅ Relancer la commande met l'agent à jour
✅ Ajouter un serveur prend quelques minutes