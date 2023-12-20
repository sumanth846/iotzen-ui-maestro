import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./components/sync/sync.component")
      .then((m) => m.SyncComponent),
  }
];
