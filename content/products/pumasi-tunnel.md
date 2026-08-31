---
title: "Pumasi Tunnel"
description: "Localhost tunnels over a single outbound connection: HTTP by subdomain, raw TCP for RDP and databases, and zero-install access from a stock ssh client. Alpha — you run the relay. Apache-2.0."
compareTo: [Ngrok, Pinggy, Playit.gg]
status: alpha
repo: "https://github.com/pumasi-ai/pumasi-tunnel"
limitation: "there is no hosted relay yet — `tunnel.pumasi.ai` does not resolve, so every command on this page runs against a relay you start yourself. The local request inspector on port 4040, wildcard TLS termination, and reserved custom subdomains are roadmap items with no implementation in the repository today."
order: 3
updated: 2026-08-31
---

## Where this actually is

`Alpha`, set 2026-08-30 by the product's own
[`STAGE.md`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/roadmap/STAGE.md),
which is the file this page is not allowed to run ahead of. Its gates, verbatim:

| Stage | Criteria | Status |
|---|---|---|
| Candidate | Scored by 3 model families, selected by steward | **COMPLETE** |
| **Alpha** | Pure core stream router, SSH jump server, single-binary relay prototype | **IN PROGRESS** |
| Beta | Multi-protocol TCP/HTTP forwarding, local web inspector (port 4040), wildcard SSL | PENDING |
| Launched | Production edge deployment, unmetered public access, cross-model verification | PENDING |

Two consequences a reader should have before anything else on this page.
**There is no hosted relay.** `tunnel.pumasi.ai` does not resolve; production
edge deployment is the `Launched` gate and it is pending. Everything here runs
against a relay you start. And **the port-4040 inspector and wildcard TLS are
`Beta` criteria, not features** — there is no code for either in the repository.

## Run it

Two binaries, one Go module, no dependencies outside the standard library and
`golang.org/x/crypto`.

```bash
git clone https://github.com/pumasi-ai/pumasi-tunnel
cd pumasi-tunnel && go test ./...
go build ./cmd/pumasi-relay ./cmd/pumasi-tunnel
```

**The relay** — the public side. It accepts agents on one port and visitors on
another:

```bash
./pumasi-relay -domain example.test -agent-addr :7000 -http-addr :8000 \
               -ssh-addr :2222 -tcp-low 20000 -tcp-high 20100
```

**The agent** — on the machine holding the thing you want reachable:

```bash
# an HTTP app, published at <name>.example.test
./pumasi-tunnel --relay relay.example:7000 8080

# ask for a particular name
./pumasi-tunnel --relay relay.example:7000 --subdomain myapi 8080

# raw TCP: RDP, SSH, PostgreSQL. --tcp-port keeps the address across reconnects
./pumasi-tunnel --relay relay.example:7000 --tcp --tcp-port 20001 3389
```

**Or no binary at all**, from any machine with a stock `ssh` client:

```bash
ssh -R 80:localhost:3000 -p 2222 relay.example
```

That last one is the point of the SSH ingress: no download, no account, and it
works from a machine you are not allowed to install software on.

## What works today, and what does not

Written against the tree at
[`3652e15`](https://github.com/pumasi-ai/pumasi-tunnel), not against the plan.

| | State |
|---|---|
| Multiplexed transport — many streams over one outbound connection | **Built** (`mux/`, `core/frame.go`) |
| HTTP routing by subdomain, with a reserved-name list | **Built** (`core/route.go`, `core/subdomain.go`) |
| Raw TCP port pool, with a port that survives reconnects | **Built** (`relay/tcp.go`, `core/portpool.go`) |
| Zero-install ingress from a stock `ssh -R` client | **Built** (`relay/sshingress.go`) |
| Relay console at the relay's own apex | **Built** (`relay/dashboard.go`, one embedded file) |
| Local request inspector on `127.0.0.1:4040` | **Not built.** No code; `Beta` criterion |
| Wildcard TLS / ACME certificate management | **Not built, and deliberately out of the relay** — see below |
| Reserved custom subdomains backed by a store | **Not built.** `--token` exists on the agent; nothing persists |
| Hosted public relay | **Not built.** `Launched` criterion |

### One known weakness in the part that is built

The multiplexer's flow control is per-stream buffering, not a credit window. A
reader that stops reading stalls its own stream and, once the read loop blocks,
the connection behind it. That is honest backpressure rather than unbounded
memory, **but one stalled stream can hold up its siblings.** A credit window is
the fix and is deferred; the code says so at
[`mux/session.go`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/mux/session.go)
rather than leaving it to be discovered under load.

## Why the incumbents cost what they cost

The comparison that motivated building this. The right-hand column is what the
Apache-2.0 relay does **when you run it yourself** — it is not a claim about a
hosted service, because there is not one yet.

| Feature | Ngrok | Pinggy.io | Cloudflare Tunnel | **Pumasi Tunnel (self-run)** |
| :--- | :--- | :--- | :--- | :--- |
| **License** | Proprietary | Proprietary | Proprietary Cloud | **Apache-2.0** |
| **Pricing** | $10 – $18/seat/mo | $2.50 – $12/mo | Free (Web only) | **No licence cost; you pay for the host** |
| **Custom Subdomains** | Paywalled ($10+/mo) | Paywalled ($2.50+/mo) | Free | Any name your relay serves; **no reservation store yet** |
| **Raw TCP Forwarding** | Paywalled ($18+/mo) | Paywalled | ❌ Requires Client Helper | **✅ Native, from a port pool you set** |
| **Session Disconnect Timers** | None | 60-Minute Hard Cutoff | None | **✅ None — nothing in the code expires a session** |
| **Bandwidth Limits** | 1GB – 15GB/mo (+$0.10/GB) | Metered | Unlimited | **✅ Nothing meters bytes** |
| **HTML Warning Interstitial** | ❌ Breaks API/Webhooks | ❌ Interstitial Screen | None | **✅ None — the relay proxies, it does not inject** |
| **Local Webhook Inspector** | Port 4040 | Web dashboard | None | ❌ **Not built** (`Beta` criterion) |
| **Zero-Client SSH Tunneling** | ❌ (Client required) | ✅ | ❌ (Client required) | **✅ Standard `ssh -R`** |

The unmetered and no-timeout rows are true for a reason worth stating plainly:
they are not a generous tier, they are the absence of the code that would
enforce a tier. Nothing in this repository counts bytes or clocks a session, so
there is nothing to lift when you self-host.

## Architecture

A single outbound connection from your machine to the relay, carrying every
inbound visitor request back down it as a separate stream. No port forwarding
and no inbound firewall rule.

- **Core (`core/`)** — pure: the wire frame protocol, host routing, subdomain
  validation and the TCP port pool. No I/O, so it is unit-testable on its own.
- **Mux (`mux/`)** — the I/O shell that moves those frames. A hand-written
  frame protocol over a plain connection; **not QUIC, and not Yamux.** The
  split from core is deliberate: core decides what bytes mean, `mux` moves them.
- **Relay (`relay/`)** — HTTP host router, raw TCP port allocator, SSH ingress
  gateway, and the embedded console. One static binary, droppable on a host.
- **Agent (`agent/`)** — holds the outbound connection and forwards frames to
  the local port.

**TLS is deliberately not terminated in the relay.** Run it behind a TLS
listener or a reverse proxy holding the certificate; keeping certificate
handling out means an operator can choose ACME, a purchased certificate, or
none at all on a private network. The relay entrypoint says exactly this at
[`cmd/pumasi-relay/main.go`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/cmd/pumasi-relay/main.go).
It is a design decision, not a missing feature — but it does mean **wildcard
TLS is something you bring**, and this page previously implied the relay
provisioned it.

**No database.** Routing is in-memory for the lifetime of a session. There is
no SQLite store, and therefore no subdomain reservation that survives a relay
restart.
