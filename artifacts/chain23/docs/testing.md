# 23-Chain Manual Test Checklist

All tests are manual — run them against the live dev server at `http://localhost:80/`.

---

## 1. Simulation Mode (no network required)

### 1.1 Basic operation
- [ ] Page loads without console errors
- [ ] Tape shows a single `0` cell with head at position 0
- [ ] State counter shows `0`, balance shows `100000 sat`, step count shows `0`
- [ ] Click **Step** → tape updates, step count increments to 1, a transaction appears in the log
- [ ] Click **Step** again → second transaction appears, TXID is different
- [ ] Click **Start** → machine runs continuously, tape and log update on each step
- [ ] Click **Stop** → machine halts, `running` badge disappears
- [ ] Click **Reset** → tape resets to single `0`, step count returns to 0, log is empty

### 1.2 Demo preset
- [ ] Click **Load Demo** → tape loads `0000001101000000`, head is at position 6, state is 0
- [ ] Click **Step** several times → transitions follow the Wolfram (2,3) table
- [ ] Verify transition table by expanding **Wolfram (2,3) Transition Table**

### 1.3 Custom tape
- [ ] Enter `102010` in the Custom Tape field, head `3`, State 1 → click **Load** → tape loads correctly
- [ ] Enter `999` in the Custom Tape field → error message appears: `Invalid symbol(s): '9'`
- [ ] Enter `` (empty) → error appears: `Tape cannot be empty`
- [ ] Enter `abc` → error appears listing invalid characters
- [ ] Enter `0120` with head `-1` → head is clamped to 0
- [ ] Enter `01` with head `5` → head is clamped to 1 (last valid index)
- [ ] Enter valid tape, click Load → step count resets to 0

### 1.4 Funding
- [ ] Run machine until balance reaches 0 → "Out of Funds" banner appears
- [ ] Click **Fund Machine** → balance increases by 50000 sat, banner disappears
- [ ] Machine can continue stepping after funding

### 1.5 Speed slider
- [ ] Move speed slider to 500ms → auto-run slows visibly
- [ ] Move to 0ms → auto-run runs as fast as possible
- [ ] Speed change mid-run takes effect on the next iteration (no restart required)

### 1.6 CSV Export
- [ ] Run 5 steps → click **Export CSV** → file `23chain-log.csv` downloads
- [ ] Open CSV — verify columns: `Step,Timestamp,Mode,TXID,StateBefore,StateAfter,EncodedStateHex,PayloadBytes,Description`
- [ ] `Mode` column shows `simulation` for all rows
- [ ] `StateBefore` for row 2 matches `StateAfter` of row 1
- [ ] `TXID` is a 64-character hex string (SHA256 of encoded state)
- [ ] `PayloadBytes` is a positive integer

### 1.7 Transaction log
- [ ] Log shows `0 tx` when empty with "No transactions yet" placeholder
- [ ] After steps: each entry shows step number, shortened TXID, and description
- [ ] Log scrolls to the latest entry automatically
- [ ] Export button appears in log footer when transactions exist

---

## 2. Script Mode Selector

- [ ] Three cards visible: Record-Only, Genesis Covenant, Chronicle OTDA
- [ ] Record-Only: badges show `Sim: active` and `Live: active`
- [ ] Genesis Covenant: badges show `Sim: active` and `Live: template`
- [ ] Chronicle OTDA: badges show `Sim: active` and `Live: todo`
- [ ] Clicking a non-active card selects it (radio button fills)
- [ ] Switching modes does not reset the machine state
- [ ] **OPCODES** section expands and shows correct opcode count for each mode
- [ ] **SCRIPT TEMPLATE** section expands and shows template with current tape encoded
- [ ] Live Mode panel only appears below the Record-Only card (not for other modes)

---

## 3. Live Mode Panel — Validation

Open the Live Mode panel (Record-Only mode must be selected).

### 3.1 TXID validation
- [ ] Leave TXID empty and tab away → no error shown yet (deferred until submit attempt)
- [ ] Enter `abc` (3 chars) → `TXID must be exactly 64 hex characters (got 3)` error
- [ ] Enter 64 `g` characters → `TXID must contain only hex characters` error
- [ ] Enter 64 `0` characters → no error (valid hex)
- [ ] Enter 63 hex chars → length error shown

### 3.2 vout validation
- [ ] Enter `-1` → `Output index must be 0 or greater` error
- [ ] Enter `1.5` → `Output index must be a whole number` error
- [ ] Enter `abc` → `Output index must be a number` error
- [ ] Enter `0` or `1` → no error

### 3.3 Satoshis validation
- [ ] Enter `100` → `Must be at least 600 sat` error
- [ ] Enter `0` → error
- [ ] Enter `600` → no error, estimated fee note appears
- [ ] Enter `abc` → `Satoshis must be a number` error

### 3.4 WIF network validation
- [ ] Select **Mainnet**, enter a WIF starting with `c` (testnet prefix) → network mismatch error appears
- [ ] Select **Testnet**, enter a WIF starting with `K` (mainnet prefix) → network mismatch error appears
- [ ] Enter a WIF of fewer than 50 characters → no network error (too short to determine)
- [ ] Enter a structurally correct testnet WIF on Testnet → address derives and appears

### 3.5 Enable button
- [ ] **Enable Live Mode** button is disabled when any field has an error
- [ ] Button becomes enabled only when all fields are valid
- [ ] After enabling: panel collapses and shows "Live Mode Active" with UTXO info

---

## 4. Live Mode — Dry Run

### 4.1 Setup
- [ ] Enable Dry Run checkbox in the Live Mode panel
- [ ] Enable button reads "Enable Live Mode (Dry Run)"
- [ ] After enabling: Step button changes to **Live Step** with radio icon

### 4.2 Dry run flow
- [ ] Click **Live Step** → BroadcastDialog opens with `Dry Run — Step #1` in header
- [ ] Header badge shows `Dry Run`
- [ ] A notice reads "the transaction will be built and signed but NOT broadcast"
- [ ] OP_RETURN payload section shows decoded state, hex, and byte count
- [ ] Fee and Change values are populated
- [ ] Broadcast button reads **Dry Run** (flask icon)
- [ ] Click **Dry Run** → dialog advances to "Dry Run Complete" phase
- [ ] "Dry Run Complete" banner is muted (not green) — clearly distinct from a real broadcast
- [ ] Signed hex is shown in a collapsible block with would-be fee
- [ ] No WhatsOnChain link is shown
- [ ] Click **Continue** → machine state advances (tape, head, state, step count all update)
- [ ] Transaction log entry appears with `DRY-RUN |` prefix in description
- [ ] UTXO satoshis shown in header do NOT decrease (no real tx was sent)

### 4.3 CSV with dry run entries
- [ ] After a dry run step, export CSV
- [ ] The row `Mode` column shows `live-dry-run`
- [ ] `TXID` starts with `DRY-RUN:`

### 4.4 Cancel
- [ ] Open dialog, click Cancel → dialog closes, machine state does not advance
- [ ] Click X button → same result

---

## 5. Live Mode — Real Broadcast (requires funded BSV testnet UTXO)

> Only run this on **testnet** with a small amount. Real satoshis are spent.

### 5.1 Pre-broadcast review
- [ ] Configure with a real testnet UTXO (txid, vout, satoshis) and testnet WIF
- [ ] Derived address shown matches the UTXO owner address
- [ ] Click **Live Step** → BroadcastDialog opens with `Broadcast Step #1`
- [ ] OP_RETURN payload decoded matches `{state}|{head}|{tape}` format
- [ ] Payload hex is the UTF-8 hex of the decoded string
- [ ] Fee and Change sum equals the UTXO satoshis
- [ ] Signed Transaction Hex section expands and shows valid hex
- [ ] Hex byte count is a reasonable size (~250–350 bytes)
- [ ] Warning text mentions the fee is non-refundable

### 5.2 Broadcast
- [ ] Click **Broadcast** → button becomes `Broadcasting…` with spinner
- [ ] Spinner is visible for the duration of the network call
- [ ] On success: "Transaction Confirmed" with green banner and real TXID
- [ ] WhatsOnChain link points to correct network (`test.whatsonchain.com`)
- [ ] Click **Continue** → machine state advances
- [ ] Transaction log entry has `LIVE |` prefix in description
- [ ] Header UTXO satoshis update to the change amount

### 5.3 Consecutive steps
- [ ] Click **Live Step** again → UTXO TXID and vout are the change output from the previous step
- [ ] Machine continues from where it left off

### 5.4 Failure cases
- [ ] Configure with an already-spent UTXO → broadcast returns error, machine state does not advance
- [ ] Error message is shown in the dialog (descriptive, not a generic crash)
- [ ] Click **Try Again** → returns to confirm phase with same tx details
- [ ] Click **Cancel** → dialog closes, machine state unchanged

---

## 6. Failure / Edge Cases

- [ ] Enter a WIF that passes prefix check but fails cryptographic decode → "Invalid WIF key" error in panel
- [ ] UTXO with exactly 600 sat → fee is ~1 sat → change is ~599 sat — dialog shows correct values
- [ ] UTXO with fewer satoshis than the computed fee → dialog shows change ≤ 0 and a destructive warning; Broadcast button is disabled
- [ ] Reload page mid-dry-run → WIF is cleared (not persisted), machine resets
- [ ] Change speed to 0ms while running in simulation → no crash, steps continue
- [ ] Run 100+ steps, export CSV → file is valid and all rows have the expected columns

---

## 7. UI / Visual

- [ ] Dark terminal theme throughout — no light mode flash
- [ ] Tape head highlighted with pulsing orange cell
- [ ] Head arrow `▲` scrolls into view as tape extends
- [ ] Live tag in TX log: entries from live mode have radio icon and left border accent
- [ ] Footer shows correct mode: "Live Mode — BSV Mainnet/Testnet" vs "Simulation Mode"
- [ ] Footer shows correct TXID note: "WhatsOnChain broadcast" vs "SHA256(encodedState)"
- [ ] "Fund Machine" button hidden in live mode
- [ ] "Start" button disabled in live mode (auto-run not available)
