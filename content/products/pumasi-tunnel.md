---
title: "Pumasi Tunnel"
description: "Localhost tunnels over one outbound connection: HTTP by subdomain, raw TCP for RDP and databases, zero-install from stock ssh. Alpha: a public relay runs on pumasi.link, http only. Apache-2.0."
compareTo: [Ngrok, Pinggy, Playit.gg]
status: alpha
repo: "https://github.com/pumasi-ai/pumasi-tunnel"
limitation: "there **is** a public relay — on `pumasi.link` — but it serves **`http` only**. The `https://<name>.pumasi.link` address it prints to every user has nothing listening on port 443, and `tunnel.pumasi.ai` does not resolve at all. One relay, one host, all state in memory: a restart drops every live tunnel and every name, any anonymous agent may claim any free name, and nobody has promised it will be up. The local request inspector on port 4040 and wildcard TLS are `Beta` criteria with no implementation in the repository today."
order: 3
updated: 2026-08-31
---

## Where this actually is

`Alpha` — the current stage in the product's own
[`STAGE.md`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/roadmap/STAGE.md)
at [`e29dc0e`](https://github.com/pumasi-ai/pumasi-tunnel/commit/e29dc0e),
which is the file this page is not allowed to run ahead of. Its gates, verbatim:

| Stage | Criteria | Status |
| :--- | :--- | :--- |
| **0. Candidate** | Scored by 3 model families (40/60) and selected by steward | **COMPLETE** |
| **1. Alpha** | Pure-core suite passes 100%; both public landing surfaces live | **COMPLETE 2026-08-31** |
| **2. Beta** | Real end-to-end users complete workflows without engineer intervention | **IN PROGRESS** |
| **3. Launched** | Production hardening, cross-model regression, 7-day veto window | PENDING |

Read that table exactly as it is written. **`Alpha`'s exit gate is met and
`Beta` work has started — and the stage is still `alpha`.** `STAGE.md` puts it
in those words: *"the `beta` label is not claimed yet."* This page will not
claim it either. Three verified facts hold it back, each one a
[`BACKLOG.md`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/roadmap/BACKLOG.md)
entry rather than an opinion:

1. **Every tunnel is handed an address that does not answer.** `PublicURL`
   (`core/route.go:255`) returns `https://<name>.pumasi.link` unconditionally,
   the console prints it, and nothing listens on 443. This is backlog item 1
   and the next section is about nothing else.
2. **A name belongs to nobody.** `Tunnel.Reserved` is computed at
   `relay/relay.go:236` and never read anywhere in the tree; the relay binary
   exposes no auth flag, so `AllowAll` is the only authenticator it can run.
   Any anonymous agent may take any free name.
3. **Nothing survives a restart.** The subdomain registry and the TCP port pool
   are in-memory maps. A relay restart drops every name, every reserved port
   and every live tunnel. `--tcp-port` keeps an address across an *agent*
   reconnect, not across a relay one.

Two more gate the label from the commons' `PRODUCT-RULES.md`: this product has
**no version number anywhere** — no version file, no `/version`, nothing on the
console — and no in-app feedback path.

## There is a public relay, and this page used to deny it

An earlier version of this page said, in its second paragraph, **"There is no
hosted relay."** That was false, and it was the expensive kind of false: it
told visitors not to try the one thing this product does that its competitors
charge for. What that sentence got right was the domain, and only the domain.
Every claim below is one command you can run yourself.

**There is a public relay and it is on `pumasi.link`. `tunnel.pumasi.ai` does
not resolve and never did.** The apex serves the relay console, the ssh ingress
answers on port 2222, and `/_pumasi/status` returns the live tunnel list:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://pumasi.link/_pumasi/status  # 200
host tunnel.pumasi.ai                                                       # NXDOMAIN
```

Checked 2026-08-31 15:35 UTC, that status endpoint reported one tunnel open —
`sshsteward`, `pumasi.link:20000` → local port 22, opened 06:18:13 UTC, **33 465
seconds** (9 h 17 m) unbroken. That is the relay carrying real traffic, not a
demo, and it is the strongest evidence this product has.

**And the `https://<name>.pumasi.link` address that same relay prints to every
user does not work. Nothing is listening on port 443.** Use the `http://`
address it also serves:

```bash
curl -sS https://sshsteward.pumasi.link/   # Failed to connect ... port 443: Connection refused
curl -sS -o /dev/null -w '%{http_code}\n' http://pumasi.link/   # 200
```

TLS termination is deliberately outside the relay (see *Architecture* below),
and outside it there is at present nothing. The relay announcing a scheme it
does not serve is the product printing something untrue about itself; it is
backlog item 1 and it is being worked on. Until it lands, **treat every
`https://` URL this software hands you as `http://`.**

**Nobody has promised this relay will be up.** One process, one host, no
durable state, no status page and no support commitment — `Launched` is
`PENDING` and production hardening is what that gate means. If a tunnel
mattering to you goes away with the relay, that is the documented behaviour,
not an incident. The relay you run yourself is the same binary from the same
repository, and that remains the supported way to depend on it.

## Run it

Two binaries, one Go module, no dependencies outside the standard library and
`golang.org/x/crypto`.

```bash
git clone https://github.com/pumasi-ai/pumasi-tunnel
cd pumasi-tunnel && go test ./...
go build ./cmd/pumasi-relay ./cmd/pumasi-tunnel
```

**Against the public relay**, with no binary at all, from any machine with a
stock `ssh` client — the fastest way to see whether this is useful to you:

```bash
ssh -R 80:localhost:3000 -p 2222 pumasi.link
```

No download, no account, and it works from a machine you are not allowed to
install software on. The relay prints an `https://…` URL; open the `http://`
one instead, for the reason above.

**Your own relay** — the public side. It accepts agents on one port and
visitors on another:

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

## What works today, and what does not

Written against the code tree at
[`3652e15`](https://github.com/pumasi-ai/pumasi-tunnel/commit/3652e15) and the
running relay, not against the plan.

| | State |
|---|---|
| Multiplexed transport — many streams over one outbound connection | **Built** (`mux/`, `core/frame.go`) |
| HTTP routing by subdomain, with a reserved-name list | **Built** (`core/route.go`, `core/subdomain.go`) |
| Raw TCP port pool, with a port that survives reconnects | **Built** (`relay/tcp.go`, `core/portpool.go`) |
| Zero-install ingress from a stock `ssh -R` client | **Built** (`relay/sshingress.go`) |
| Relay console at the relay's own apex | **Built** (`relay/dashboard.go`, one embedded file) |
| **Public relay anyone can use** | **Running** at `pumasi.link` — `http` only, **no uptime promise** |
| **`https://` on the address the relay prints** | **Not served.** Port 443 refused; backlog item 1 |
| Ownership of a subdomain name | **Not enforced.** `Reserved` is computed and never read |
| State that survives a relay restart | **Not built.** Registry and port pool are in memory |
| Local request inspector on `127.0.0.1:4040` | **Not built.** No code; `Beta` criterion |
| Wildcard TLS / ACME certificate management | **Not built, and deliberately out of the relay** — see below |

### One known weakness in the part that is built

The multiplexer's flow control is per-stream buffering, not a credit window. A
reader that stops reading stalls its own stream and, once the read loop blocks,
the connection behind it. That is honest backpressure rather than unbounded
memory, **but one stalled stream can hold up its siblings.** A credit window is
the fix and is deferred; the code says so at
[`mux/session.go`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/mux/session.go)
rather than leaving it to be discovered under load.

A second one, found by the product-manager evaluation rather than by a user:
the relay writes the auth response carrying a tunnel's public TCP address
(`relay/relay.go` ~line 162) **before** it binds the listener (~line 181), so
the address is announced before anything answers on it. Under `go test -cover`
that window widened enough to fail 2 runs in 12. It is backlog item 2.

## Why the incumbents cost what they cost

The comparison that motivated building this. The right-hand column is the
Apache-2.0 relay — the same binary whether you run it yourself or use the
public one at `pumasi.link`. Where the two differ, the cell says so.

| Feature | Ngrok | Pinggy.io | Cloudflare Tunnel | **Pumasi Tunnel** |
| :--- | :--- | :--- | :--- | :--- |
| **License** | Proprietary | Proprietary | Proprietary Cloud | **Apache-2.0** |
| **Pricing** | $10 – $18/seat/mo | $2.50 – $12/mo | Free (Web only) | **No licence cost. `pumasi.link` is free; self-run, you pay for the host** |
| **HTTPS on the public URL** | ✅ Free, automatic | ✅ | ✅ | ❌ **`http` only today** — port 443 refused; backlog item 1 |
| **Uptime commitment** | Paid SLA | None on free | Cloudflare's | ❌ **None, stated** — one host, in-memory state |
| **Custom Subdomains** | Paywalled ($10+/mo) | Paywalled ($2.50+/mo) | Free | Any free name, on any relay; **nothing reserves it for you** |
| **Raw TCP Forwarding** | Paywalled ($18+/mo) | Paywalled | ❌ Requires Client Helper | **✅ Native.** `pumasi.link` serves ports 20000–20099 |
| **Session Disconnect Timers** | None | 60-Minute Hard Cutoff | None | **✅ None — nothing in the code expires a session** |
| **Bandwidth Limits** | 1GB – 15GB/mo (+$0.10/GB) | Metered | Unlimited | **✅ Nothing meters bytes** |
| **HTML Warning Interstitial** | ❌ Breaks API/Webhooks | ❌ Interstitial Screen | None | **✅ None — the relay proxies, it does not inject** |
| **Local Webhook Inspector** | Port 4040 | Web dashboard | None | ❌ **Not built** (`Beta` criterion) |
| **Zero-Client SSH Tunneling** | ❌ (Client required) | ✅ | ❌ (Client required) | **✅ Standard `ssh -R`, on `pumasi.link:2222`** |

The unmetered and no-timeout rows are true for a reason worth stating plainly:
they are not a generous tier, they are the absence of the code that would
enforce a tier. Nothing in this repository counts bytes or clocks a session, so
there is nothing to lift when you self-host. The two ❌ rows at the top are the
same coin's other face — nothing enforces a limit, and nothing guarantees a
service either.

**The one that will decide it for many readers:** if your use is a webhook
sender that requires an `https://` destination, this cannot serve you today, on
the public relay or on your own, until backlog item 1 lands or you put your own
TLS terminator in front.

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
It is a design decision, not a missing feature — **but the relay still prints
`https://` URLs regardless, and on `pumasi.link` nothing is standing in that
place.** The design decision is defensible; announcing a scheme you do not
serve is the defect, and it is the one being fixed first.

**No database.** Routing is in-memory for the lifetime of a session. There is
no SQLite store, and therefore no subdomain reservation that survives a relay
restart — including on the public relay.
