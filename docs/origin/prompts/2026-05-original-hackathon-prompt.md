# **„Mega-Prompt“ für Replit**

Version: 26-05-03  
Time: 11:50

Kontext:  
Ich bin Software Engineer und möchte demonstrieren, dass BitcoinSV (BSV) Turing-vollständig ist.  
Erstelle eine Web-App, die eine Wolfram (2,3) Turing Machine simuliert und deren Zustandsübergänge als BSV-Transaktionskette modelliert (Simulation \+ optional echte Integration).

Sprache:

* Sprache für Prompting: Deutsch und Englisch  
* Sprache für Code und Tool:   
  * UI-Sprache: English, übersetze meine deutschen Beispiele auf Englisch  
  * Code, Kommentare, Logs: Englisch

Do not ask clarifying questions.  
Do not simplify the requirements.  
Implement exactly as specified until the simulation is working and Script Documentation is running. (phase 1 and 2, as described at the end)

Projektname:  
23-Chain

README.md:  
"This project demonstrates that BitcoinSV is a Universal Turing Machine. Using the Wolfram (2,3) ruleset, we show how any computable function can be executed as a chain of transactions, limited only by transaction size and available funding."

---

## **Architektur (wichtig)**

Erstelle eine modulare Struktur:

* /core/turing.ts → reine Turing-Logik (kein BSV)  
* /core/tape.ts → dynamisches Tape  
* /core/encoder.ts → State → Hex Encoding (für OP\_RETURN)  
* /bsv/api.ts → WhatsOnChain Integration  
* /bsv/txSimulator.ts → Simulierte Transaktionen  
* /ui → React oder Vanilla JS UI

Die Turing-Logik MUSS komplett unabhängig von BSV sein.

---

## **Wolfram (2,3) Transition Table**

const wolfram23Lookup \= {  
  0: {  
    0: \[1, 1, 1\],  
    1: \[1, 2, \-1\],  
    2: \[0, 1, \-1\]  
  },  
  1: {  
    0: \[1, 2, 1\],  
    1: \[0, 2, 1\],  
    2: \[0, 0, \-1\]  
  }  
};

---

## **Algorithmus**

Für jeden Schritt:

1. Read symbol at current tape position  
2. Lookup: wolfram23Lookup\[currentState\]\[symbol\]  
3. Write new symbol to tape  
4. Update state  
5. Move head (-1 or \+1)  
6. Encode full state  
7. Create simulated or real transaction

---

## **Tape Anforderungen**

* Dynamisches Array (auto-expand links/rechts)  
* Unterstützt große Eingaben (mehrere tausend Zeichen)  
* Default-Wert außerhalb: 0  
* Head darf niemals „out of bounds“ sein

### **Tape Edge Handling (strict)**

* If head moves left beyond index 0:  
  * prepend a 0 to tape  
  * keep head at position 0  
* If head moves right beyond tape length:  
  * append a 0  
* Tape must behave as infinite in both directions

### **Execution Model**

* Step execution must be sequential and deterministic  
* Do NOT run multiple steps in parallel  
* Use async loop with await between steps  
* Prevent double execution if user clicks multiple times

---

## **State Encoding (sehr wichtig)**

Implementiere eine Funktion:

encodeState(tape, headPosition, state) → hex string

Anforderungen:

* Head Position als Integer  
* State als 0/1  
* Ergebnis muss theoretisch in OP\_RETURN passen

### **Encoding Specification (strict)**

* Encode tape as a base-3 string (characters: 0,1,2 only)  
* Do NOT use JSON for tape encoding  
* Concatenate:  
  \[state\]\[separator\]\[headPosition\]\[separator\]\[tape\]

Example:  
"1|42|000120201"

* Convert to hex string before OP\_RETURN  
* Keep encoding deterministic and minimal

---

## **Blockchain Layer**

Implementiere zwei Modi:

### **1\. Simulation Mode (Default)**

* Generiert Fake TXIDs (hash der encoded state)  
* Kein echtes Broadcasting  
* Voll funktionsfähig offline

### **TXID Simulation**

* TXID must be deterministic  
* Use SHA256(encodedState)  
* Same state must always produce same TXID  
* Do NOT use random values

### **2\. Live Mode (optional)**

Nutze:  
WhatsOnChain API

Features:

* Optionaler API-Key  
* Rate limit handling:  
  * Ohne Key: max 1 req/sec  
  * Bei HTTP 429 → exponential backoff

---

## **Funding Mechanismus**

* Jeder Schritt kostet „Fees“  
* Implementiere:  
  satoshiBalance: BigInt  
* Pro Step:  
  balance \-= fee  
* Wenn balance \== 0:  
  → Maschine stoppt  
  → UI zeigt „Out of funds“  
* Button:  
  "Fund Machine" → erhöht Balance

---

## **UI Anforderungen**

* Horizontales Tape (scrollend)  
* Aktuelle Position klar markiert  
* Anzeige:  
  * Current State (0 / 1\)  
  * Step Count (Transactions)  
  * Balance  
* Buttons:  
  * Start  
  * Step  
  * Stop  
  * Reset  
  * Load Demo  
  * Fund Machine

### **UI Performance Constraint**

* Never block the main thread with large loops  
* Use:  
  * requestAnimationFrame OR  
  * async step execution with delay  
* UI must update after each step

---

## **Demo Preset**

Button "Load Demo":

* Tape: 0000001101000000  
* State: 0  
* Head: 6

---

## **Log Panel (sehr wichtig)**

Rechtsseitiges Log:

Format per step:  
TX-ID: \[SHA256(encodedState)\] | Input: (State 0, Color 1\) \-\> Output: (State 1, Color 2, Move Right)

Speichere alle TXIDs persistent (Array / Export-Funktion für CSV)

---

## **OP\_RETURN Design**

* Speichere NUR encoded state  
* Kein UTXO-Bloat  
* Klar getrennt von Script-Logik

---

## **Erweiterbarkeit**

Architektur MUSS erlauben:

* Austausch von wolfram23Lookup  
* z.B. Rule 110 später möglich

---

## **Technische Anforderungen**

* Verwende BigInt für Satoshis  
* Kein Number für Geldbeträge  
* Sauberes Error Handling

---

## **Bitcoin Script / Chronicle Requirements**

The project must target the post-Chronicle BSV protocol.

Requirements:

* Use original Bitcoin Script semantics as restored by the BSV Chronicle upgrade.  
* Do not assume BTC Core Script limitations.  
* Do not use BTC-specific covenant libraries.  
* Use BSV-compatible Script construction only.  
* Prefer official BSV SDK tooling for script assembly, transaction construction, signing, and broadcasting.  
* Clearly document which opcodes are used.  
* Add a file `/docs/script-design.md` explaining:  
  * locking script structure  
  * unlocking script structure  
  * used opcodes  
  * state transition validation idea  
  * OP\_RETURN state encoding  
  * Chronicle-related assumptions

If Live Mode is implemented:

* Support Chronicle-compatible transaction construction.  
* Support or document the required SIGHASH mode.  
* If using OTDA, document the CHRONICLE `0x20` sighash flag.  
* If the SDK does not support Chronicle features directly, implement only Simulation Mode and clearly mark Live Mode as TODO.

Do not fake Live Mode.  
If real broadcasting is not implemented safely, keep the system in Simulation Mode.

---

## **Hard Constraint**

Before implementing Live Mode, verify that the selected BSV SDK supports the required post-Chronicle Script features.  
If support is incomplete, build a correct simulation and expose the Script template as documentation instead of broadcasting invalid transactions.

---

## **Wallet / Official BSV Stack Requirements**

Use the official BSV Blockchain stack wherever possible.

Preferred libraries:

* @bsv/sdk  
* @bsv/wallet-toolbox  
* @bsv/wallet-helper, if useful

Do NOT use deprecated or BTC-focused libraries unless explicitly justified.

Wallet architecture:

* Implement wallet access through an adapter interface.  
* Support BRC-100-compatible wallet interaction.  
* The app must not directly manage private keys in the frontend.  
* Signing and funding should be delegated to the wallet layer.  
* Simulation Mode must work without a wallet.

Required abstraction:

interface WalletAdapter {

  isAvailable(): Promise\<boolean\>;

  getBalance(): Promise\<bigint\>;

  createAction(params: CreateActionParams): Promise\<WalletActionResult\>;

  signAction?(params: SignActionParams): Promise\<SignedActionResult\>;

}

Define placeholder types if not implemented:

type CreateActionParams \= any;  
type WalletActionResult \= any;  
type SignActionParams \= any;  
type SignedActionResult \= any;

Official-stack validation:

* Add a README section called “BSV Stack Compliance”.  
* List all BSV-related packages used.  
* Explain why each package belongs to the official BSV stack.  
* Prefer packages from the `bsv-blockchain` GitHub organization or official BSV Association documentation.  
* Do not use generic BTC libraries for transaction construction unless they are explicitly BSV-compatible.

Broadcasting:

* Prefer ARC / official BSV broadcasting infrastructure if available.  
* WhatsOnChain may be used for lookup and fallback broadcasting only.  
* Handle API rate limits and HTTP 429 errors with exponential backoff.

Security:

* Never expose private keys in browser code.  
* Never hardcode seed phrases, WIF keys, mnemonics, or funding keys.  
* Live Mode must require explicit user confirmation before broadcasting.

---

## **Failure Handling**

* API Fehler (429, network)  
* Invalid tape input  
* Head overflow  
* Encoding errors

---

## **Performance**

* Muss \>1000 Steps ohne UI Freeze können  
* Nutze requestAnimationFrame oder async loops

---

## **Optional (wenn Zeit bleibt)**

* Export State als JSON  
* Import State  
* Geschwindigkeit (steps/sec Regler)

---

## **Priorisierung (wichtig wegen Zeitlimit)**

1. Turing Engine korrekt  
2. Tape Rendering  
3. Simulation Mode  
4. Log System  
5. Funding Mechanik  
6. Optional: echte BSV Integration

Wenn Zeit knapp:  
→ Live Mode weglassen  
→ Simulation perfekt machen

Make reasonable assumptions and proceed with implementation.

---

## **Zusatz UI Text**

Füge ein Info-Feld hinzu (Übersetze auf Englisch\!):

"Dieser Startzustand repräsentiert das zu lösende Problem. Da die Wolfram (2,3)-Maschine universell ist, kann jede berechenbare Funktion durch geeignete Initialisierung des Bandes dargestellt werden."

---

Ziel (auf Englisch\!):  
Eine visuell nachvollziehbare, deterministische Simulation einer Turing Machine, deren Schritte als Blockchain-Transitions interpretiert werden können.

---

Act in 3 phases  
**Phase 1:** korrekte Turing-Simulation

**Phase 2:** Script-Design-Dokumentation

**Phase 3:** optionaler Live-Broadcast nur, wenn SDK-Unterstützung vorhanden ist

Important correction:

OP\_CAT was already restored on BSV with the Genesis upgrade in 2020\. Do not claim that OP\_CAT requires Chronicle.

Chronicle-specific assumptions should focus on:

* Original Transaction Digest Algorithm (OTDA)  
* CHRONICLE 0x20 sighash flag  
* remaining restored original-protocol behavior  
* any opcodes or limits that were not already restored by Genesis

The implementation must distinguish between:

* Genesis-restored Script features, such as OP\_CAT  
* Chronicle-specific features, such as OTDA / CHRONICLE sighash

Add a Script Mode Selector to the UI with three modes:

1. Record-only Mode  
* P2PKH \+ OP\_RETURN  
* Records encoded state on-chain  
* Does not verify the Turing transition in Script

2. Genesis Covenant Mode  
* Uses the OP\_PUSH\_TX / transaction-preimage covenant technique  
* Uses Genesis-compatible Script features only  
* Intended to verify the Turing transition on-chain  
* If full Live Mode is too complex, implement script generation and documentation first

3. Chronicle OTDA Covenant Mode  
* Uses SIGHASH\_OTDA \= 0x20  
* Intended as the cleaner post-Chronicle construction  
* If SDK support is incomplete, implement this as documented TODO and script template only

Important:  
Do not fake Live Mode.  
For each mode, clearly show:

* whether it records state only  
* whether it verifies state transition on-chain  
* whether it is implemented, partially implemented, or TODO  
* which protocol features it requires

First Implement Record-Only Live Mode end-to-end.

Constraints:

* Use @bsv/sdk if possible.  
* Do not hardcode private keys, WIFs, seed phrases, or mnemonics.  
* Require explicit user confirmation before broadcasting.  
* Show raw transaction hex before broadcast.  
* Show estimated fee and OP\_RETURN payload size.  
* Store returned TXID in the transaction log.  
* If wallet signing is not available, implement unsigned transaction construction and mark signing as TODO.  
* Do not implement Genesis Covenant Live Mode yet.  
* Do not implement Chronicle OTDA Live Mode yet.  
* Do not fake successful broadcasting.

Do not implement Genesis Covenant Live Mode yet.

Use the remaining time to harden the current Record-Only Live Mode.

Tasks:

1. Add a clear “Dry Run” mode:  
* build transaction  
* show signed hex  
* do not broadcast  
2. Add validation:  
* WIF network must match selected network  
* UTXO satoshis must be greater than estimated fee  
* OP\_RETURN payload size must be displayed  
* reject invalid tape symbols  
* reject empty or malformed TXID/vout  
3. Add export:  
* export transaction log as CSV  
* include timestamp, mode, txid, stateBefore, stateAfter, encodedStateHex, payloadSize  
4. Add README section:  
* explain that Record-Only Live Mode records state on-chain but does not enforce transition validity on-chain  
* explain that Genesis Covenant and Chronicle OTDA are documented next milestones  
5. Add docs/testing.md:  
* manual test checklist  
* demo preset test  
* live mode dry-run test  
* failure cases  
6. Add TODO section:  
* Genesis Covenant Live Mode  
* Chronicle OTDA Live Mode  
* WalletAdapter / BRC-100 integration  
* multi-UTXO funding

Do not fake success.  
Do not add new covenant live code in this iteration.  
Focus on making the current implementation reliable and reviewable.

## **What this project shows**

This project demonstrates how a universal (2,3) Wolfram Turing Machine can be represented as a sequence of Bitcoin SV transactions.

It includes three execution models:

* Simulation Mode (pure computation)  
* Record-Only Live Mode (real on-chain state recording)  
* Covenant Modes (documented future work)

This illustrates the boundary between:

* recording computation on-chain  
* enforcing computation on-chain via Script

—---  
[https://file-executer--wolfganglohmann.replit.app](https://file-executer--wolfganglohmann.replit.app)

[https://file-executer--wolfganglohmann.replit.app](https://file-executer--wolfganglohmann.replit.app)

[https://buildathons.replit.app/projects/4d4de204-921a-485c-8162-31f620b0a84f](https://buildathons.replit.app/projects/4d4de204-921a-485c-8162-31f620b0a84f)

[https://x.com/WolfgangLohmann/status/2050921391508132350](https://x.com/WolfgangLohmann/status/2050921391508132350) 