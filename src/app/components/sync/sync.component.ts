import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxdbSyncService } from '../../../sync/rxdb.sync.service';
import { RxCollection, RxDatabase } from 'rxdb';
import { RxReplicationState } from 'rxdb/dist/types/plugins/replication';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sync.component.html',
  styleUrl: './sync.component.scss'
})
export class SyncComponent implements OnInit, OnDestroy {

  database?: RxDatabase;
  socketUrl = 'ws://127.0.0.1:9800';
  couchDb = 'http://10.1.0.94:5984/test/';
  rState?: RxReplicationState<any, unknown>;
  collection?: RxCollection;

  constructor(private rxdb: RxdbSyncService) {
  }


  ngOnDestroy(): void {
  }


  ngOnInit(): void {
    this.rxdb.createRxDB().then(db => this.database = db).catch(console.error);
  }

  async startSync() {
    console.log('startSync');
    this.collection = this.rxdb.getCollection('assetinfo');
    console.log('collection data count', await this.collection.count().exec())
    // this.rState = await this.rxdb.replicationWebSocket(this.socketUrl, this.collection);
    await this.rxdb.replicationWithCouchDB(this.couchDb, this.collection);

    console.log('collection data count', await this.collection.count().exec())
  }

}
