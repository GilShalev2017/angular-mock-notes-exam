import { Component } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
@Component({
  selector: 'app-notes-stats',
  imports: [CommonModule,MaterialModule],
  templateUrl: './notes-stats.component.html',
  styleUrl: './notes-stats.component.scss',
})
export class NotesStatsComponent {
  constructor(public notesSvc: NotesService) {}
}
