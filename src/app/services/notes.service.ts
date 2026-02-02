//ISSUES BETWEEN EDITING IN UI AND FETCHING FROM SERVER!!!

// import { computed, Injectable, signal, effect } from '@angular/core';
// import { debounceTime, delay, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
// import { Note } from '../models/models';
// import { toObservable } from '@angular/core/rxjs-interop';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class NotesService {
//   notes = signal<Note[]>([]);
//   selectedNoteId = signal<string | null>(null);
//   isSyncing = signal<boolean>(false);
//   lastUpdated = signal<Date | null>(null);

//   searchTerm = signal<string>('');

//   /** 🔥 COMPUTED filtered notes — always in sync */
//   filteredNotes = computed(() => {
//     const term = this.searchTerm().toLowerCase();
//     const notes = this.notes();

//     if (!term) return notes;

//     return notes.filter(
//       (n) => n.title?.toLowerCase().includes(term) || n.content?.toLowerCase().includes(term),
//     );
//   });

//   selectedNote = computed(() => this.notes().find((n) => n.id === this.selectedNoteId()));
//   noteCount = computed(() => this.notes().length);
//   searchActive = computed(() => this.searchTerm().length > 0);
//   searchSubscription$: any;

//   constructor(private http: HttpClient) {
//     /** Load initial notes */
//     this.getAllNotes().subscribe((serverNotes) => {
//       this.notes.set(serverNotes);
//     });

//     /** RxJS Search Stream for SERVER FILTERING */
//     this.searchSubscription$ = toObservable(this.searchTerm)
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         switchMap((term): Observable<Note[]> => {
//           if (term.length === 0) return this.getAllNotes();
//           return this.getFilteredNotes(term);
//         }),
//       )
//       .subscribe((serverResults: Note[]) => {
//         /** 🔥 IMPORTANT:
//          *  Replace local notes entirely with server results
//          *  filteredNotes recomputes automatically
//          */
//         this.notes.set(serverResults);
//       });

//     /** Auto-sync effect */
//     effect(() => {
//       this.notes(); // track changes
//       this.syncWithServer();
//     });
//   }

//   /** HTTP Calls */
//   getAllNotes(): Observable<Note[]> {
//     return this.http.get<Note[]>(`http://localhost:5000/notes`);
//   }

//   getFilteredNotes(term: string): Observable<Note[]> {
//     return this.http.get<Note[]>(`http://localhost:5000/search?q=${term}`);
//   }

//   /** CRUD */
//   addNote(text: string) {
//     this.notes.update((notes) => [
//       ...notes,
//       { id: Date.now().toString(), title: text, content: text, createdAt: new Date() },
//     ]);
//   }

//   updateNote(id: string, newContent: string) {
//     this.notes.update((notes) =>
//       notes.map((note) =>
//         note.id === id
//           ? { ...note, content: newContent } // <-- only update content
//           : note,
//       ),
//     );
//   }

//   deleteNote(id: string) {
//     this.notes.update((notes) => notes.filter((note) => note.id !== id));
//   }

//   selectNote(id: string) {
//     this.selectedNoteId.set(id);
//   }

//   syncWithServer() {
//     this.isSyncing.set(true);
//     of(null)
//       .pipe(delay(1000))
//       .subscribe(() => {
//         this.isSyncing.set(false);
//         this.lastUpdated.set(new Date());
//       });
//   }

//   ngOnDestroy(): void {
//     this.searchSubscription$.unsubscribe();
//   }
// }

import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { Note } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  /** ------------------------------
   *  Signals (source-of-truth state)
   *  ------------------------------ */
  notes = signal<Note[]>([]);
  selectedNoteId = signal<string | null>(null);
  searchTerm = signal<string>('');

  isSyncing = signal<boolean>(false);
  lastUpdated = signal<Date | null>(null);

  /** ------------------------------
   *  Derived state (computed)
   *  ------------------------------ */
  selectedNote = computed(() => this.notes().find((n) => n.id === this.selectedNoteId()));

  noteCount = computed(() => this.notes().length);

  filteredNotes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const all = this.notes();

    if (!term) return all;

    return all.filter(
      (n) => n?.title?.toLowerCase().includes(term) || n?.content?.toLowerCase().includes(term),
    );
  });

  constructor(private http: HttpClient) {
    /** Load initial notes */
    this.getAllNotes().subscribe((serverNotes) => {
      this.notes.set(serverNotes);
    });

    /** Auto-sync effect (runs whenever notes changes) */
    effect(() => {
      this.notes(); // dependency
      this.triggerSync();
    });
  }

  /** ------------------------------
   *  API Methods
   *  ------------------------------ */

  getAllNotes() {
    return this.http.get<Note[]>(`http://localhost:5000/notes`);
  }

  /** ------------------------------
   *  CRUD Operations (Local State)
   *  ------------------------------ */

  addNote(title: string) {
    const newNote: Note = {
      id: Date.now().toString(),
      title: title,
      content: '',
      createdAt: new Date(),
    };

    this.notes.update((list) => [...list, newNote]);
  }

  /** ONLY UPDATE CONTENT — NOT TITLE */
  updateNote(id: string, newContent: string) {
    this.notes.update((list) => list.map((n) => (n.id === id ? { ...n, content: newContent } : n)));
  }

  deleteNote(id: string) {
    this.notes.update((list) => list.filter((n) => n.id !== id));

    // If the selected note was deleted, deselect it
    if (this.selectedNoteId() === id) {
      this.selectedNoteId.set(null);
    }
  }

  selectNote(id: string) {
    this.selectedNoteId.set(id);
  }

  /** ------------------------------
   *  Sync Logic
   *  ------------------------------ */

  private triggerSync() {
    this.isSyncing.set(true);

    of(null)
      .pipe(delay(800))
      .subscribe(() => {
        this.isSyncing.set(false);
        this.lastUpdated.set(new Date());
      });
  }
}
