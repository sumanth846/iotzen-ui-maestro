import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {filter} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class PromptUpdateService {

  constructor(swUpdate: SwUpdate) {
    swUpdate.checkForUpdate()
      .then(e => console.log(e ? 'A new version is available.' : 'Already on the latest version.'))
      .catch(console.error);

    swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(evt => {
        if (prompt(evt.type)) {
          // Reload the page to update to the latest version.
          document.location.reload();
        }
      });
  }

}
