Source de la note Lab « Pourquoi Go et gRPC pour piloter les serveurs VPN » (go-grpc-plateforme-vpn).
Réponses du propriétaire, 21/11/2026. Ne rien ajouter qui ne soit pas ici ou dans vpn.md.

Pourquoi Go (API centrale et agent) :
- binaire unique, sans runtime, simple à mettre dans un paquet .deb/.rpm
- écosystème WireGuard en Go (wgctrl, wireguard-go)
- concurrence : goroutines pour piloter plusieurs serveurs VPN en parallèle
- même langage partout : code et types protobuf partagés entre API et agent

Pourquoi gRPC (API <-> agents) :
- contrat typé (.proto), écarts de format vus à la compilation
- streaming, pour la synchronisation des configurations
- TLS intégré au transport, complété par HMAC
- HTTP/2 et protobuf, plus léger et rapide que REST/JSON

Alternatives étudiées : aucune (ne pas en parler).

Ce que ça a changé :
- agent léger sur les VPS
- cross-compilation simple : amd64 et arm64 depuis la même CI
