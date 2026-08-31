---
title: "Pumasi Tunnel"
description: "Localhost tunnels over one outbound connection: HTTP by subdomain, raw TCP for RDP and databases, zero-install from stock ssh. Alpha: a public relay runs on pumasi.link, http only. Apache-2.0."
compareTo: [Ngrok, Pinggy, LocalXpose]
status: alpha
repo: "https://github.com/pumasi-ai/pumasi-tunnel"
productLicence: "Apache-2.0"
limitation: "there **is** a public relay — on `pumasi.link` — but it serves **`http` only**, and the relay running there still announces `https://<name>.pumasi.link` addresses with nothing listening on port 443 (checked 2026-08-31 16:22 UTC). The fix is merged and undeployed: since [`83fd9f7`](https://github.com/pumasi-ai/pumasi-tunnel/commit/83fd9f7) `main` takes `-public-scheme` and defaults to `http`, but `pumasi.link` runs an older build — deploying it needs `pumasi/DECISIONS.md` Q-014, which is open. `tunnel.pumasi.ai` does not resolve at all. One relay, one host, all state in memory: a restart drops every live tunnel and every name, any anonymous agent may claim any free name, and nobody has promised it will be up. The local request inspector on port 4040 and wildcard TLS are `Beta` criteria with no implementation in the repository today."
order: 3
updated: 2026-08-31
---

## Where this actually is

`Alpha` — the current stage in the product's own
[`STAGE.md`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/roadmap/STAGE.md)
at [`01ef62b`](https://github.com/pumasi-ai/pumasi-tunnel/commit/01ef62b),
which is the file this page is not allowed to run ahead of. Its gates, verbatim:

| Stage | Criteria | Status |
| :--- | :--- | :--- |
| **0. Candidate** | Scored by 3 model families (40/60) and selected by steward | **COMPLETE** |
| **1. Alpha** | Pure-core suite passes 100%; both public landing surfaces live | **COMPLETE 2026-08-31**, re-measured at `83fd9f7` |
| **2. Beta** | Real end-to-end users complete workflows without engineer intervention | **IN PROGRESS** — §4 |
| **3. Launched** | Production hardening, cross-model regression, 7-day veto window | PENDING |

Read that table exactly as it is written. **`Alpha`'s exit gate is met and
`Beta` work has started — and the stage is still `alpha`.** `STAGE.md` puts it
in those words: *"the `beta` label is not claimed yet."* This page will not
claim it either.

**And read row 1 with the qualification its own file attaches to it**, because
this page quotes that table and must not quote it cleaner than it is. Stage 1
asks that the pure-core suite pass 100%. Re-measured at 40 runs of each
invocation, `go test -count=1 ./...` — the ordinary command, no coverage
instrumentation — **fails 3 in 40**, a 7.5% rate, on three different tests that
all fail the same way: a public TCP address is announced before anything is
listening on it (`relay/relay.go` writes the auth response at line 175 and
binds at line 194). `STAGE.md` §3.1 keeps the gate `MET` and records the honest
form as *"passes, 37 times in 40"*. Whether `MET` may be read that way at all is
escalated as `pumasi/DECISIONS.md` **Q-024**, and until it is answered **no
stage-promotion announcement is published off that gate** — `STAGE.md` §7 holds
the trigger deliberately. Nothing on this page is a promotion; the product is
`alpha` and is not asking to move. Three verified facts hold it back, each one a
[`BACKLOG.md`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/roadmap/BACKLOG.md)
entry rather than an opinion:

1. **Every tunnel the public relay opens is handed an address that does not
   answer.** `PublicURL` returned `https://<name>.pumasi.link` unconditionally,
   the console printed it, and nothing listens on 443. The unconditional
   `https://` is **fixed on `main`** at
   [`83fd9f7`](https://github.com/pumasi-ai/pumasi-tunnel/commit/83fd9f7) and
   **not deployed to `pumasi.link`**, which still announced it at 16:22 UTC
   today. This is backlog item 1 and the next section is about nothing else.
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

**And the `https://<name>.pumasi.link` address that same relay still prints to
every user does not work. Nothing is listening on port 443.** Both halves of
that sentence were re-checked against the live host at **2026-08-31 16:22 UTC**,
one command each:

```bash
curl -sS http://pumasi.link/_pumasi/status
# {"base_domain":"pumasi.link", … "url":"https://sshsteward.pumasi.link", …}

curl -sS -o /dev/null -w '%{http_code}\n' https://pumasi.link/
# curl: (7) Failed to connect to pumasi.link port 443 after 55 ms
```

The relay announces `https://`; port 443 refuses. Use the `http://` address it
also serves.

**The correction to this is merged and it is not what you will meet.** Say both,
because they are different facts:

| | State |
| :--- | :--- |
| `pumasi.link` **today** | Still announces `https://`. Port 443 refused, 16:22 UTC |
| `pumasi-tunnel` `main` since [`83fd9f7`](https://github.com/pumasi-ai/pumasi-tunnel/commit/83fd9f7) | Takes `-public-scheme`, **defaults to `http`** — the truth about what the binary serves. An unknown scheme stops the relay rather than being coerced |

`Registry.PublicURL` no longer hard-codes a scheme (`core/route.go:312`); the
CLI's first line, the console link and the zero-install ssh banner all read the
one string, so they cannot fork again. **The merge is not the deployment.**
`pumasi.link` runs an older build and will until someone restarts it — and who
may restart that relay is open as `pumasi/DECISIONS.md` **Q-014**, because its
one live tunnel is the remote-access route to the host it runs on. The release
note is [`Q-020`](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
whose own status row records the same thing.

So: if you build from `main` and run your own relay, you get the truth by
default. If you use `pumasi.link`, **treat every `https://` URL it hands you as
`http://`** until it is redeployed. TLS termination is deliberately outside the
relay either way (see *Architecture* below), and outside it there is at present
nothing.

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
install software on. **The relay on `pumasi.link` prints an `https://…` URL;
open the `http://` one instead**, for the reason above — the build running there
predates the fix. A relay you build from `main` today prints `http://` unless
you pass `-public-scheme=https`.

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

The comparison that motivated building this. **Every competitor cell below is
read from that vendor's own page on 2026-08-31** and recorded, with its source
URL and fetch date, in `pumasi-tunnel`
[`roadmap/MARKET.md` §1](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/roadmap/MARKET.md).
Where a vendor's page does not print something, the cell says *not printed*
rather than guessing — and the comparators are that file's three
([ngrok](https://ngrok.com/pricing), [Pinggy](https://pinggy.io/#pricing),
[LocalXpose](https://localxpose.io/pricing)), not a set chosen to flatter.

| | ngrok | Pinggy | LocalXpose | **Pumasi Tunnel** |
| :--- | :--- | :--- | :--- | :--- |
| **Entry price** | Free $0; Hobbyist **$10/mo**; Pay-as-you-go **$20/mo** + usage | Free $0; Pro **$3.00** (from Pinggy's own comparison page) | Starter $0; **PRO $8/mo** ($96/yr) | **$0.** `pumasi.link` is free; self-run, you pay for the host |
| **Account to start** | yes | **no**, on the free tier | yes | **no** |
| **Client to start** | own agent binary | **the OS `ssh` client** | own binary (CLI + GUI) | **stock `ssh`**, or one static binary |
| **Raw TCP on the free path** | with **credit-card verification**; a *reserved* address from $10/mo | **included** | **not included** — from $8/mo | **✅ included.** `pumasi.link` serves ports 20000–20099 |
| **Free-tier session ceiling** | **none printed** on the pricing page | **60 minutes** | **"Time limits"** | **✅ none** — nothing in the code expires a session |
| **Stable hostname** | free domain is ngrok-branded; custom at **$0.01/active hour** on PAYG | random on free; custom sold on Pro | excluded from Starter | free, on any relay — but **nothing reserves it for you** |
| **Interstitial warning page** | not printed | not printed | **printed on Starter** | **✅ none** — the relay proxies, it does not inject |
| **HTTPS on the public URL** | ✅ | ✅ | ✅ | ❌ **`http` only** — 443 refused on `pumasi.link`. Backlog item 1's *scheme* half is merged (`83fd9f7`, undeployed); the certificate half is not built |
| **Self-hostable relay** | not offered publicly | on-premise on **Enterprise** | not offered publicly | **✅ Apache-2.0, same repository** |
| **Local request inspector** | port 4040 | web dashboard | — | ❌ **not built** (`Beta` criterion) |
| **Uptime commitment** | paid SLA | none on free | not printed | ❌ **none, stated** — one host, in-memory state |

**What that table establishes, stated no wider than the citations allow.** Two
things are together free here and together free nowhere above: **raw TCP and a
session that does not end.** Pinggy gives free TCP and times you out at 60
minutes; LocalXpose sells both from $8/month; ngrok wants a card on file for
free TCP and $10/month for a reserved address. Nothing here is a claim about
reliability, performance, support or security posture — none of which was
measured — and nothing should be restated as "ngrok costs $10" without the plan
name attached.

The unmetered and no-timeout rows are true for a reason worth stating plainly:
they are not a generous tier, they are the absence of the code that would
enforce a tier. Nothing in this repository counts bytes or clocks a session, so
there is nothing to lift when you self-host.

### Where this comparison goes against us

A table that only flatters its own product is copy, not evidence.
`MARKET.md` §4 records three counts against, and they belong on this page too:

- **They have TLS and we do not.** All three sell `https://` URLs as the
  ordinary case. `pumasi.link` has never listened on 443. A webhook sender that
  requires `https://` can use all three of them and none of us.
- **They have accounts and ownership; we have neither.** A paid stable hostname
  is only a wedge if ours is *owned* — and it is not. `AllowAll` is the only
  authenticator this relay can run. Today "free stable name" means "free
  unclaimed name", which is a weaker product, not a cheaper one.
- **One relay, one host.** Every vendor above runs an edge. This runs on one
  $5–6/month machine in Chicago. Nothing above is an availability claim.

**The one that will decide it for many readers:** if your use is a webhook
sender that requires an `https://` destination, this cannot serve you today, on
the public relay or on your own, until backlog item 1 lands or you put your own
TLS terminator in front and start the relay with `-public-scheme=https`.

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
It is a design decision, not a missing feature. The defect was never that the
relay declines to terminate TLS — it was that it **announced** a scheme it
cannot see and does not serve. On `main` that is fixed: the operator states the
scheme with `-public-scheme` and the relay repeats it rather than guessing. On
`pumasi.link` it is not yet deployed, so nothing is standing in that place and
the relay still says otherwise.

**No database.** Routing is in-memory for the lifetime of a session. There is
no SQLite store, and therefore no subdomain reservation that survives a relay
restart — including on the public relay.
