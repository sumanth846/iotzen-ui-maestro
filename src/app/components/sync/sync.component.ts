import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {RxdbSyncService} from '../../../sync/rxdb.sync.service';
import {RxCollection, RxDatabase, RxDocument} from 'rxdb';
import {RxReplicationState} from 'rxdb/dist/types/plugins/replication';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sync.component.html',
  styleUrl: './sync.component.scss'
})
export class SyncComponent implements OnInit, OnDestroy {
  cCount = signal(0);
  database?: RxDatabase;
  couchDb = 'http://10.1.0.94:5984/synctest/';
  rState?: RxReplicationState<any, unknown>;
  collection?: RxCollection;
  cData = signal([]);

  constructor(private rxdb: RxdbSyncService) {
  }


  ngOnDestroy(): void {
  }


  ngOnInit(): void {
    // this.rxdb.createRxDB().then(db => this.database = db).catch(console.error);
  }

  async insertDocs() {
    // const data: Array<RxDocument> = await this.rxdb.getCollection('assetinfo').find().exec();
    this.collection = this.rxdb.getCollection('assetinfo');
    const data: Array<RxDocument> = await this.collection.find().exec();
    const queries = [];

    if (data.length) {
      for (const d of data) {
        if (d._data?.['assets']?.length) {
          for (let i = 0; i < d._data?.['assets'].length; i++) {
            const c = d._data?.['assets'][i];
            queries.push(this.collection.upsert({
              ...c,
              'collectionName': 'assets'
            }))
          }
        }

        if (d._data['assetlinkmetas']?.length) {
          for (let i = 0; i < d._data['assetlinkmetas'].length; i++) {
            const c = d._data['assetlinkmetas'][i];
            queries.push(this.collection.upsert({
              ...c,
              'collectionName': 'assetlinkmetas'
            }))
          }
        }
      }
    }

    await Promise.all(queries);
    // console.log(data);
    this.cCount.set(data.length);

    this.cData.set(data);
  }


  async getCount() {
    this.cCount.set(await this.rxdb.getCollection('assetinfo').count().exec())
  }

  async startSync() {
    console.log('startSync');
    console.log('collection data count', await this.collection.count().exec())
    // this.rState = await this.rxdb.replicationWebSocket(this.socketUrl, this.collection);
    this.rxdb.replicationWithCouchDB(this.couchDb, this.collection);

    console.log('collection data count', await this.collection.count().exec())
  }

}
