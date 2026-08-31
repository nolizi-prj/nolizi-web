---
title: "Pumasi Tunnel"
description: "Unmetered, multi-protocol localhost tunnels with custom domains, raw TCP port exposure, and zero-client SSH access. Ngrok, Pinggy, and Playit.gg, copied. Apache-2.0."
compareTo: [Ngrok, Pinggy, Playit.gg]
status: seed
repo: "https://github.com/pumasi-ai/pumasi-tunnel"
limitation: "public tunnels provide unmetered HTTP and raw TCP forwarding; automated anti-phishing safeguards and rate-limits apply to public anonymous endpoints."
order: 3
updated: 2026-08-30
---

## Run it

### 1. Zero-Install SSH Tunnel
Expose any local port to the internet in one second using your computer's built-in SSH client:
```bash
ssh -R 80:localhost:3000 tunnel.pumasi.ai
```

### 2. Standalone CLI
```bash
# Forward a web app (HTTP/HTTPS)
pumasi tunnel 8080

# Forward raw TCP (Windows Remote Desktop, PostgreSQL, SSH)
pumasi tunnel tcp 3389

# Bind to a permanent custom subdomain
pumasi tunnel 8080 --subdomain myapi
```

## What it solves

Most developer tunnel tools restrict free users to random ephemeral URLs that break on reconnect, enforce 15-minute or 60-minute disconnect timers, inject HTML interstitial warning screens that break webhooks, or paywall raw TCP forwarding behind $10–$25/month subscriptions.

Pumasi Tunnel provides:
- **Zero-Client SSH Tunneling**: Works out of the box on any device with standard `ssh -R` without downloading software.
- **Permanent Free Subdomains**: Stable URLs (`myapi.pumasi.link`) that never break across restarts.
- **Native Raw TCP Forwarding**: Exposes Windows Remote Desktop (3389), SSH (22), and databases (5432) directly with zero client-side proxy software needed.
- **Zero Interstitial Screens**: Direct HTTP 200 OK responses with clean JSON payloads for webhook testing (Stripe, GitHub, Discord, Slack).
- **Built-in Local Webhook Inspector**: Interactive local web UI at `http://127.0.0.1:4040` with full request payload inspection and one-click webhook replay.
- **Unmetered Bandwidth**: No arbitrary data caps or per-gigabyte overage fees.

## Comparison vs. Incumbents

| Feature | Ngrok | Pinggy.io | Cloudflare Tunnel | **Pumasi Tunnel** |
| :--- | :--- | :--- | :--- | :--- |
| **License** | Proprietary | Proprietary | Proprietary Cloud | **Apache-2.0** |
| **Pricing** | $10 – $18/seat/mo | $2.50 – $12/mo | Free (Web only) | **100% Free** |
| **Custom Subdomains** | Paywalled ($10+/mo) | Paywalled ($2.50+/mo) | Free | **Free & Permanent** |
| **Raw TCP Forwarding** | Paywalled ($18+/mo) | Paywalled | ❌ Requires Client Helper | **✅ Native TCP Support** |
| **Session Disconnect Timers** | None | 60-Minute Hard Cutoff | None | **None (Unlimited)** |
| **Bandwidth Limits** | 1GB – 15GB/mo (+$0.10/GB) | Metered | Unlimited | **Unmetered** |
| **HTML Warning Interstitial** | ❌ Breaks API/Webhooks | ❌ Interstitial Screen | None | **None (Direct 200 OK)** |
| **Local Webhook Inspector** | Port 4040 | Web dashboard | None | **Built-in (Port 4040)** |
| **Zero-Client SSH Tunneling** | ❌ (Client required) | ✅ | ❌ (Client required) | **✅ (Standard `ssh -R`)** |

## Self-Hostable Architecture

Pumasi Tunnel runs as a single lightweight binary or Docker container on any cloud VPS or edge host:
- **Relay Core**: High-throughput multiplexed frame routing via QUIC and Yamux.
- **Edge Ingress**: Automatic Let's Encrypt wildcard TLS certificate management for `*.pumasi.link`.
- **Zero Database Dependency**: Pure in-memory routing for ephemeral sessions; SQLite for tokenized custom subdomain reservation.
