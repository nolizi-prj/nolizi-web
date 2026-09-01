---
title: "Pumasi Tunnel"
description: "Localhost tunnels over one outbound connection: HTTP by subdomain, raw TCP for RDP and databases, zero-install from stock ssh. Alpha: a public relay runs on pumasi.link, http only. Apache-2.0."
compareTo: [Ngrok, Pinggy, LocalXpose]
status: alpha
repo: "https://github.com/pumasi-ai/pumasi-tunnel"
productLicence: "Apache-2.0"
limitation: "there **is** a public relay — on `pumasi.link` — but it serves **`http` only**, and the relay running there still announces `https://<name>.pumasi.link` addresses with nothing listening on port 443 (checked 2026-09-01 19:12 UTC). The fix is merged and undeployed: since [`83fd9f7`](https://github.com/pumasi-ai/pumasi-tunnel/commit/83fd9f7) `main` takes `-public-scheme` and defaults to `http`, but `pumasi.link` runs an older build — deploying it needs `pumasi/DECISIONS.md` Q-014, which is open. `tunnel.pumasi.ai` does not resolve at all. One relay, one host, and nobody has promised it will be up. **On `pumasi.link` a name still belongs to nobody and a restart still drops every name, every port and every live tunnel.** Both are fixed on `main` and in the same merged-and-undeployed state as the scheme: a name and its port belong to a token holder since [`4489fbe`](https://github.com/pumasi-ai/pumasi-tunnel/commit/4489fbe), and a reservation outlives a relay restart since [`9cc9e65`](https://github.com/pumasi-ai/pumasi-tunnel/commit/9cc9e65) — when the operator passes `-reservations <path>`, which is off by default. Even deployed, no live connection survives a restart; what survives is the *address* the reconnect gets back. The local request inspector on port 4040 and wildcard TLS are `Beta` criteria with no implementation in the repository today."
order: 3
updated: 2026-09-01
---

## Where this actually is

`Alpha` — the current stage in the product's own
[`STAGE.md`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/roadmap/STAGE.md),
which is the file this page is not allowed to run ahead of. Its last evaluation
is at [`9e2de66`](https://github.com/pumasi-ai/pumasi-tunnel/commit/9e2de66);
`main` has moved on to
[`9cc9e65`](https://github.com/pumasi-ai/pumasi-tunnel/commit/9cc9e65) since,
and where this page reads the tree past that evaluation it says so. The stage
is the same at both. Its gates, as that file writes them:

| Stage | Criteria | Status |
| :--- | :--- | :--- |
| **0. Candidate** | Scored by 3 model families (40/60) and selected by steward | **COMPLETE** |
| **1. Alpha** | Pure-core suite passes 100%; both public landing surfaces live | **COMPLETE 2026-08-31**, re-measured at `9e2de66` — the run counts are in `STAGE.md` §2 and this page does not repeat them |
| **2. Beta** | Real end-to-end users complete workflows without engineer intervention | **IN PROGRESS** — §4 |
| **3. Launched** | Production hardening, cross-model regression, 7-day veto window | PENDING |

Read that table exactly as it is written. **`Alpha`'s exit gate is met and
`Beta` work has started — and the stage is still `alpha`.** `STAGE.md` puts it
in those words: *"the `beta` label is not claimed."* This page will not claim
it either.

**And read row 1 with the qualification its own file attaches to it**, because
this page quotes that table and must not quote it cleaner than it is. The gate
is `MET` and *qualified*: every figure behind it was taken on one machine by the
seat that wrote the file, and a green suite says the change broke nothing, not
that it is right — `STAGE.md` §2 says both in more words. An earlier version of
this page quoted a failure rate for that suite. It no longer does: the two
ordering defects behind that rate are closed on `main` — the TCP announce
before bind at
[`1d9505c`](https://github.com/pumasi-ai/pumasi-tunnel/commit/1d9505c), the
HTTP announce before serve at
[`fd523e8`](https://github.com/pumasi-ai/pumasi-tunnel/commit/fd523e8) — and
`pumasi/DECISIONS.md` **Q-024**, which asks whether `MET` may be read that way
at all, is still open. Until it is answered **no stage-promotion announcement
is published off that gate**, and nothing public quotes its figure. Nothing on
this page is a promotion; the product is `alpha` and is not asking to move.
Three verified facts hold it back, each one an entry in
[`BACKLOG.md`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/roadmap/BACKLOG.md)
rather than an opinion — and **two of the three are now fixed on `main` and
on `main` only**, which this page says in the same breath each time because
the difference is the whole point:

1. **Every tunnel the public relay opens is handed an address that does not
   answer.** `PublicURL` returned `https://<name>.pumasi.link` unconditionally,
   the console printed it, and nothing listens on 443. The unconditional
   `https://` is **fixed on `main`** at
   [`83fd9f7`](https://github.com/pumasi-ai/pumasi-tunnel/commit/83fd9f7) and
   **not deployed to `pumasi.link`**, which still announced it at 19:12 UTC on
   2026-09-01. The certificate half is not built. The next section is about
   nothing else.
2. **A name belongs to nobody — true of `pumasi.link`, false on `main` since
   [`4489fbe`](https://github.com/pumasi-ai/pumasi-tunnel/commit/4489fbe).**
   The relay this page used to describe computed `Tunnel.Reserved` from the
   shape of a request and read it nowhere; any anonymous agent could take any
   free name, including one somebody was using between reconnects. That is
   still exactly what `pumasi.link` serves: its status view carries no
   `"reserved"` key, which dates the running binary before the change. On
   `main`, across `4489fbe` ·
   [`c12d11a`](https://github.com/pumasi-ai/pumasi-tunnel/commit/c12d11a) ·
   [`20e9d57`](https://github.com/pumasi-ai/pumasi-tunnel/commit/20e9d57)
   (`spec/0004`, slice 1), `--subdomain myapi --token <16+ characters>`
   **claims** the name — and with `--tcp --tcp-port P`, that port — for whoever
   holds the token, holds both across a disconnect, and refuses them to every
   other caller including one presenting no token. `Reserved` is now set from
   the reservation record and read by the status view. The relay still has
   **no auth flag**: a token proves *continuity*, not identity, and decides
   which name you may have, not whether you are let in.
3. **Nothing survives a restart — true of `pumasi.link`, false on `main` since
   [`9cc9e65`](https://github.com/pumasi-ai/pumasi-tunnel/commit/9cc9e65).**
   The subdomain registry and the TCP port pool were, and on the running relay
   are, in-memory maps: a relay restart drops every name, every reserved port
   and every live tunnel. On `main` (`spec/0004` slice 2, specified at
   [`9dd067a`](https://github.com/pumasi-ai/pumasi-tunnel/commit/9dd067a)
   before any of its code existed) the relay takes a twelfth flag,
   `-reservations <path>`: one JSON document holding every claimed name and
   port, written whole to a temp file, fsynced, renamed, then the directory
   fsynced, with a lock on a sibling file so two relays cannot share it
   (`core/reservationstore.go`). The frozen case that says so builds a
   **second relay over the same file** and checks the stranger is refused and
   the owner is given both back —
   [`relay/reservation_test.go:640`](https://github.com/pumasi-ai/pumasi-tunnel/blob/main/relay/reservation_test.go),
   `TestAReservationOutlivesTheRelay`, which was specified and absent from the
   tree until this commit. **Read the commit's own limit with it:** this
   removes the *loss* a restart used to cause; it does not make one shorter. A
   live TCP connection cannot outlive the process at either end; the agent's
   reconnect gets the same address back. And with `-reservations` empty, which
   is the default, the relay is the old relay in every respect.

**Both of those merges are behind the same undeployed restart as the scheme
fix.** `pumasi.link` runs a build older than `83fd9f7`; who may restart it is
`pumasi/DECISIONS.md` **Q-014**, open; `STAGE.md`'s own table of what `main`
does against what `pumasi.link` serves reads **no** in the deployed column for
both facts. Q-014's stated retirement condition is *durable registry and port
reservations* — the thing `9cc9e65` builds. Whether that retires the entry is
the steward's reading, not this page's; until a deploy happens the answer for
any user of `pumasi.link` is unchanged.

**One more thing about `9cc9e65` that a reader depending on it should know.**
Its commit carries two spec-round review transcripts and no code-round one, and
no `Reviewed-By` trailer for the code: a 1 089-line change to `core/` and
`relay/` merged without a cross-family code review. Below `launched` the
charter makes that review advisory, so the merge is in order — but the
evidence that it is *correct* is the frozen cases it was written against, not a
second family having read it.

Two more gate the label from the commons'
[`PRODUCT-RULES.md`](https://github.com/pumasi-ai/pumasi/blob/main/PRODUCT-RULES.md)
(v1.0, on `pumasi` `main` since
[`23bbc64`](https://github.com/pumasi-ai/pumasi/commit/23bbc64)): **PR-1**, a
user-visible version number, binds always, and this product has **none
anywhere** — no version file, no `/version`, nothing on the console, which is
why the running binary's age is inferred from a missing JSON key rather than
read; **PR-2**, an in-app feedback path, binds at the `beta` promotion and is
unbuilt. `9cc9e65` touches `core/` and `relay/` only and changes neither.

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

Checked 2026-09-01 19:12 UTC, that status endpoint reported one tunnel open —
`sshsteward`, `pumasi.link:20000` → local port 22, opened 2026-08-31 06:18:13
UTC, **132 847 seconds** (36 h 54 m) unbroken. That is the relay carrying real
traffic, not a demo, and it is the strongest evidence this product has. It is
also the tunnel Q-014 is about: the remote-access route to the host the relay
runs on.

**And the `https://<name>.pumasi.link` address that same relay still prints to
every user does not work. Nothing is listening on port 443.** Both halves of
that sentence were re-checked against the live host at **2026-09-01 19:12 UTC**,
one command each:

```bash
curl -sS http://pumasi.link/_pumasi/status
# {"base_domain":"pumasi.link", … "url":"https://sshsteward.pumasi.link", …}
# — and no "reserved" key on the tunnel, which every build since 4489fbe emits

curl -sS -o /dev/null -w '%{http_code}\n' https://pumasi.link/
# curl: (7) Failed to connect to pumasi.link port 443 after 49 ms
```

The relay announces `https://`; port 443 refuses. Use the `http://` address it
also serves.

**The corrections are merged and they are not what you will meet.** Say both,
because they are different facts:

| | State |
| :--- | :--- |
| `pumasi.link` **today** | Still announces `https://`. Port 443 refused, 19:12 UTC 2026-09-01. No name is owned; nothing survives a restart |
| `pumasi-tunnel` `main` since [`83fd9f7`](https://github.com/pumasi-ai/pumasi-tunnel/commit/83fd9f7) | Takes `-public-scheme`, **defaults to `http`** — the truth about what the binary serves. An unknown scheme stops the relay rather than being coerced |
| `main` since [`4489fbe`](https://github.com/pumasi-ai/pumasi-tunnel/commit/4489fbe) | A name and its port belong to a `--token` holder and are held across a disconnect |
| `main` since [`9cc9e65`](https://github.com/pumasi-ai/pumasi-tunnel/commit/9cc9e65) | With `-reservations <path>`, that claim outlives a relay restart. Off by default |

`Registry.PublicURL` no longer hard-codes a scheme (`core/route.go:311`); the
CLI's first line, the console link and the zero-install ssh banner all read the
one string, so they cannot fork again. **The merge is not the deployment.**
`pumasi.link` runs an older build and will until someone restarts it — and who
may restart that relay is open as `pumasi/DECISIONS.md` **Q-014**, because its
one live tunnel is the remote-access route to the host it runs on. The scheme
fix has a release note, `Q-020` in
[`DECISIONS.md`](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
whose own status row records the same thing. The two later merges have none
yet; `pumasi/releases/` carries one tunnel note, for `83fd9f7`.

So: if you build from `main` and run your own relay, you get the truth by
default, a name you can hold, and — with one flag — a name that survives your
own restarts. If you use `pumasi.link`, **treat every `https://` URL it hands
you as `http://`, treat every name as borrowed, and expect a restart to cost it**
until it is redeployed. TLS termination is deliberately outside the relay
either way (see *Architecture* below), and outside it there is at present
nothing.

**Nobody has promised this relay will be up.** One process, one host, no
durable state on the build that is running, no status page and no support
commitment — `Launched` is `PENDING` and production hardening is what that
gate means. If a tunnel mattering to you goes away with the relay, that is the
documented behaviour, not an incident. The relay you run yourself is the same
binary from the same repository, and that remains the supported way to depend
on it.

## What a token buys on `main`, and what it does not

Because *"a name that is yours"* invites three readings the code does not
support, and `spec/0004` §3 and §8 spell each one out:

- **Continuity, not identity.** There are no accounts. A token narrows which
  name an accepted agent may have; `AllowAll` still accepts everyone. A
  stranger who claims your name before you do has it — trust is on first use.
- **A bearer secret on a plaintext wire.** Until there is TLS in front of the
  relay, the token travels readable and replayable between agent and relay.
  The relay stores a `sha256` of it, never the token, and refuses anything
  under 16 characters rather than downgrading it to anonymous.
- **The zero-install path cannot use it.** A stock `ssh -R` client has nowhere
  to put a token, so an ssh tunnel can be *refused* a name somebody else has
  claimed and can never claim or reclaim one. The command this page leads with
  gets you a tunnel, not a stable name.
- **A lost token is a lost name.** No recovery path, because recovery needs an
  identity to recover to. With `-reservations`, a claim nobody has used for
  30 days is swept at the next load; the file caps at 10 000 claims and refuses
  a *new* name at the cap, never an existing owner; a corrupt file starts the
  relay empty, logs at `ERROR` and is moved aside rather than overwritten
  (`spec/0004` §14).

None of that is true of `pumasi.link` today. It is what you get from a relay
you build at `9cc9e65` or later.

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
visitors on another. The last flag is what makes a claim survive your own
restarts; leave it off and you have the relay `pumasi.link` runs:

```bash
./pumasi-relay -domain example.test -agent-addr :7000 -http-addr :8000 \
               -ssh-addr :2222 -tcp-low 20000 -tcp-high 20100 \
               -reservations /var/lib/pumasi-relay/reservations.json
```

**The agent** — on the machine holding the thing you want reachable:

```bash
# an HTTP app, published at <name>.example.test
./pumasi-tunnel --relay relay.example:7000 8080

# ask for a particular name
./pumasi-tunnel --relay relay.example:7000 --subdomain myapi 8080

# hold that name: 16+ characters, and nobody else may have it while you are away
./pumasi-tunnel --relay relay.example:7000 --subdomain myapi --token "$(cat token)" 8080

# raw TCP: RDP, SSH, PostgreSQL. --tcp-port keeps the address across reconnects
./pumasi-tunnel --relay relay.example:7000 --tcp --tcp-port 20001 3389
```

## What works today, and what does not

Written against the code tree at
[`9cc9e65`](https://github.com/pumasi-ai/pumasi-tunnel/commit/9cc9e65) and the
running relay, not against the plan. Where the two columns of the truth differ,
the row says so.

| | State |
|---|---|
| Multiplexed transport — many streams over one outbound connection | **Built** (`mux/`, `core/frame.go`) |
| HTTP routing by subdomain, with a reserved-name list | **Built** (`core/route.go`, `core/subdomain.go`) |
| Raw TCP port pool, with a port that survives reconnects | **Built** (`relay/tcp.go`, `core/portpool.go`) |
| Zero-install ingress from a stock `ssh -R` client | **Built** (`relay/sshingress.go`) — and since `4489fbe` it can be refused a claimed name and cannot claim one |
| Relay console at the relay's own apex | **Built** (`relay/dashboard.go`, one embedded file) |
| **Public relay anyone can use** | **Running** at `pumasi.link` — `http` only, **no uptime promise**, on a build older than every row below |
| **`https://` on the address the relay prints** | **Not served.** Port 443 refused. The scheme half is merged (`83fd9f7`) and undeployed; the certificate half is not built |
| Ownership of a subdomain name and its port | **Built on `main`** (`4489fbe`, `core/reservation.go`) — **not on `pumasi.link`** |
| A claim that survives a relay restart | **Built on `main`** (`9cc9e65`, `core/reservationstore.go`, `-reservations`, off by default) — **not on `pumasi.link`**. A live connection never survives one |
| Announce only what is bound and served | **Fixed on `main`** (`1d9505c` TCP, `fd523e8` HTTP) — **not on `pumasi.link`** |
| A version number, anywhere | **Not built** — `PRODUCT-RULES.md` PR-1 |
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

A second one this page used to carry is closed on `main` and open on the host:
the relay wrote the auth response carrying a tunnel's public TCP address
**before** it bound the listener, so the address was announced before anything
answered on it. Since `1d9505c` the bind comes first and a bind failure is the
answer to the handshake; since `fd523e8` the mux session exists before the URL
leaves. Both are frozen cases that fail without the fix. `pumasi.link` has
neither.

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
| **Stable hostname** | free domain is ngrok-branded; custom at **$0.01/active hour** on PAYG | random on free; custom sold on Pro | excluded from Starter | free, on any relay — **held for a token holder on `main` since `4489fbe`, held for nobody on `pumasi.link`** |
| **Interstitial warning page** | not printed | not printed | **printed on Starter** | **✅ none** — the relay proxies, it does not inject |
| **HTTPS on the public URL** | ✅ | ✅ | ✅ | ❌ **`http` only** — 443 refused on `pumasi.link`. The *scheme* half is merged (`83fd9f7`, undeployed); the certificate half is not built |
| **Self-hostable relay** | not offered publicly | on-premise on **Enterprise** | not offered publicly | **✅ Apache-2.0, same repository** |
| **Local request inspector** | port 4040 | web dashboard | — | ❌ **not built** (`Beta` criterion) |
| **Uptime commitment** | paid SLA | none on free | not printed | ❌ **none, stated** — one host |

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
- **They have accounts and ownership; we have neither on the relay you can
  reach.** A paid stable hostname is only a wedge if ours is *owned*. On
  `pumasi.link` it is not: `AllowAll` is the only authenticator and every name
  is unclaimed, so "free stable name" there means "free unclaimed name", which
  is a weaker product, not a cheaper one. On `main` a token holds a name — and
  the section above says the three ways that is still less than an account.
- **One relay, one host.** Every vendor above runs an edge. This runs on one
  $5–6/month machine in Chicago. Nothing above is an availability claim.

**The one that will decide it for many readers:** if your use is a webhook
sender that requires an `https://` destination, this cannot serve you today, on
the public relay or on your own, until a certificate sits in front of a relay
started with `-public-scheme=https`.

## Architecture

A single outbound connection from your machine to the relay, carrying every
inbound visitor request back down it as a separate stream. No port forwarding
and no inbound firewall rule.

- **Core (`core/`)** — pure: the wire frame protocol, host routing, subdomain
  validation, the TCP port pool, the reservation set and, since `9cc9e65`, the
  file it can be written to. No network I/O, so it is unit-testable on its own.
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

**No database.** Routing is in-memory for the lifetime of a session, and a live
tunnel is a connection, which nothing persists. What `main` persists since
`9cc9e65` — only when `-reservations` names a file — is the *claim*: name,
port, a hash of the token and a last-seen time, one JSON document rewritten
whole on every change. The public relay does not run that build, so on
`pumasi.link` there is still no reservation that survives a relay restart.
