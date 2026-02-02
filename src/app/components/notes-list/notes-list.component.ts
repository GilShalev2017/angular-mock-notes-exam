import { Component } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-notes-list',
  imports: [CommonModule,MaterialModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent {
  constructor(public notesSvc: NotesService) {}

  onSearch(searchTerm: string) {
    this.notesSvc.searchTerm.set(searchTerm);
  }

  delete(id: string) {
    this.notesSvc.deleteNote(id);
  }

  onEdit(content: string) {
    const selectedNote = this.notesSvc.selectedNote();
    if (selectedNote) {
      this.notesSvc.updateNote(selectedNote.id, content);
    }
  }
}
