import { Routes } from '@angular/router';
import { ReleaseNotesComponent } from './features/release-notes/release-notes.component';

export const routes: Routes = [
  {
    path: 'release-notes',
    component: ReleaseNotesComponent
  },
  {
    path: '',
    redirectTo: '/release-notes',
    pathMatch: 'full'
  }
]; 