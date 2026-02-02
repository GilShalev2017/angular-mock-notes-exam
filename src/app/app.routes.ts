import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { UsersComponent } from './components/users/users.component';
import { SettingsComponent } from './components/settings/settings-component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NotesStatsComponent } from './components/notes-stats/notes-stats.component';
import { NotesDashboardComponent } from './components/notes-dashboard/notes-dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notes-list' },
  { path: 'notes-list', component: NotesListComponent },
  { path: 'notes-stats', component: NotesStatsComponent },
  { path: 'notes-dashboard', component: NotesDashboardComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent },
];
