import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { NotesStatsComponent } from '../notes-stats/notes-stats.component';
import { NotesListComponent } from '../notes-list/notes-list.component';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
@Component({
  selector: 'app-notes-dashboard.component',
  imports: [CommonModule,MaterialModule,NotesStatsComponent,NotesListComponent,NoteEditorComponent],
  templateUrl: './notes-dashboard.component.html',
  styleUrl: './notes-dashboard.component.scss',
})
export class NotesDashboardComponent {

}
