# Idee

## 1. YouGame — piattaforma per minigiochi

Sito dinamico che offre spazio di archiviazione a minigiochi come "La Principessa dei Pesci Rossi". Chi si iscrive lo fa una sola volta e con lo stesso account può giocare ai giochi presenti e caricare i propri.

### Utenti
- Registrazione unica (nome utente fisso, password, personaggio/avatar), valida su tutta la piattaforma.
- Ogni utente può essere giocatore, sviluppatore o entrambi.
- Salvataggi e classifiche legati all'account, disponibili su qualsiasi dispositivo.

### Giochi
- Ogni sviluppatore può caricare i propri minigiochi (ad esempio singolo file HTML5 o piccolo pacchetto).
- Ogni gioco ha una scheda con titolo, descrizione, immagini, categoria e tipo di offerta.

### Modello economico
- **Gratuiti:** giocabili da tutti, con inserzioni pubblicitarie.
- **A pagamento (canone mensile):** senza inserzioni; l'incasso del canone è ripartito tra sviluppatore e piattaforma.
- Alla piattaforma va una percentuale sugli incassi (da definire, ad esempio 20–30%).
- I ricavi pubblicitari dei giochi gratuiti vanno divisi tra sviluppatore e piattaforma con una percentuale da stabilire.

### Da definire
- Come accedere ai giochi a pagamento: un abbonamento per singolo gioco o un abbonamento unico a tutto il catalogo.
- Ripartizione tra sviluppatore e piattaforma, soglia minima e frequenza dei pagamenti agli sviluppatori.
- Circuito dei pagamenti e delle inserzioni, obblighi fiscali.
- Verifica dei giochi caricati (sicurezza, contenuti adatti a tutti) e isolamento del codice caricato.
- Infrastruttura: server con database per account e salvataggi; i giochi possono restare su archiviazione statica.
- Funzioni multigiocatore condivise, come partite con alias e classifiche, offerte come servizio agli sviluppatori.

## Branch 3d
Prova grafica in 3D (Three.js, stile cartoon, vista dall'alto): per ora solo la hall. `r3.js` disegna la hall, i personaggi e gli oggetti in 3D sopra la stessa logica di gioco; il tasto "3D" in alto passa alla grafica 2D. Gli altri livelli restano in 2D.
