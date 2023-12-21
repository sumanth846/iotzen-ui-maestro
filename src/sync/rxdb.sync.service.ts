import {RxCollection, RxDatabase, createRxDatabase} from "rxdb";
import {getRxStorageLoki} from 'rxdb/plugins/storage-lokijs';
import * as loki from "lokijs";

import {replicateWithWebsocketServer} from 'rxdb/plugins/replication-websocket';
import {getFetchWithCouchDBAuthorization, replicateCouchDB} from 'rxdb/plugins/replication-couchdb';
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class RxdbSyncService {

  database?: RxDatabase;

  async createRxDB(dbName = 'test') {
    if (!this.database) {
      const db = await createRxDatabase({
        name: dbName,
        storage: getRxStorageLoki({
          adapter: new loki.LokiLocalStorageAdapter(),
          autoload: true,
          autosave: true
        })
      });

      await db.addCollections({
        assetinfo: {
          schema: {
            title: 'assetinfo',
            version: 0,
            primaryKey: '_id',
            type: 'object',
            properties: {
              _id: {type: 'string', "maxLength": 100},
              updated: {type: 'date'},
              created: {type: 'date'},
              // Add other properties from your Mongoose schema here
            },
            required: ['updated', 'created'],
            indexes: ['updated', 'created'],
          }
        }
      });

      console.log('Init DB, Loaded the schema');

      this.database = db;
    } else {
      console.log('Database already initiated');
    }


    return this.database;
  };


  getAllCollectionName() {
    return [
      'assetinfo'
    ]
  }

  getCollection(name: string) {
    if (this.database) {
      return this.database[name];
    } else {
      throw new Error('Db not initiated')
    }
  }

  async replicationWebSocket(socketUrl: string, collection: RxCollection) {
    const replicationState = await replicateWithWebsocketServer({
      collection: collection,
      url: socketUrl, //'ws://localhost:1337/socket'
      live: true,
    });

    // emits each document that was received from the remote
    replicationState.received$.subscribe(doc => console.log('emits each document that was received from the remote', doc));

    // emits each document that was send to the remote
    replicationState.send$.subscribe(doc => console.log('emits each document that was send to the remote', doc));

    // emits all errors that happen when running the push- & pull-handlers.
    replicationState.error$.subscribe(error => console.error('emits all errors that happen when running the push- & pull-handlers.', error));

    // emits true when the replication was canceled, false when not.
    replicationState.canceled$.subscribe(bool => console.log('emits true when the replication was canceled, false when not.', bool));

    // emits true when a replication cycle is running, false when not.
    replicationState.active$.subscribe(bool => console.log('emits true when a replication cycle is running, false when not.', bool));

    console.log('replication started');

    return replicationState;
  }


  replicationWithCouchDB(couchdbUrl: string, collection: RxCollection) {
    const replicationState = replicateCouchDB({
      collection: collection,
      url: couchdbUrl,
      live: true,
      fetch: getFetchWithCouchDBAuthorization('admin', 'admin'),
      autoStart: true,
      pull: {
        batchSize: 1,
        // modifier: docData => {/* ... */ },
        heartbeat: 60000
      },
      push: {
        batchSize: 1,
        // modifier: docData => {/* ... */ }
      }
    });

    // console.log(replicationState)

    // emits each document that was received from the remote
    replicationState.received$.subscribe(doc => console.log('emits each document that was received from the remote', doc));

    // emits each document that was send to the remote
    replicationState.send$.subscribe(doc => console.log('emits each document that was send to the remote', doc));

    // emits all errors that happen when running the push- & pull-handlers.
    replicationState.error$.subscribe(error => console.error('emits all errors that happen when running the push- & pull-handlers.', error));

    // emits true when the replication was canceled, false when not.
    replicationState.canceled$.subscribe(bool => console.log('emits true when the replication was canceled, false when not.', bool));

    // emits true when a replication cycle is running, false when not.
    replicationState.active$.subscribe(bool => console.log('emits true when a replication cycle is running, false when not.', bool));


    return replicationState;
  }
}
