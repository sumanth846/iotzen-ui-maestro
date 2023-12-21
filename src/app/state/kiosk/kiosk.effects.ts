import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from, EMPTY, forkJoin } from 'rxjs';
import { switchMap, map, catchError, tap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { Store, } from '@ngrx/store';
import { AppState } from '../app.state';
import { KioskActions } from '.';
import {
  ICategoryData,
  IKioskCategory,
  IGroupData,
  IQuantityStatus,
  PosData,
  GatewayList,
  IKisoskSettingsMetaData
} from 'src/app/interface/maestro-interface';
import { AssetGroupService } from 'src/app/services/asset.service.group';
import { AssetService } from 'src/app/services/asset.service';
import { AssetConfigService } from 'src/app/services/asset-config-service';
import { sequencedCategories, setCategoryImage } from './kiosk.reducer.helper'
// import { AssetsActions } from '../Assets';
// import { getAccountFromLoginResponse } from '../Login/login.selector';
import { getAllKioskSettingsMetaData, getKioskSettings } from './kiosk.selector';
import { KioskStoreService } from 'src/app/services/kiosk.store.service';


@Injectable()
export class KioskEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private API: KioskStoreService,
    private assetGroupService: AssetGroupService,
    private assetService: AssetService,
    private assetConfigService: AssetConfigService,
  ) {
  }

  loadBranches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.loadBranchList),
      switchMap(() => {
        return from(this.API.getStoreList()).pipe(
          map((res) => {
            return KioskActions.loadBranchListSuccess({ branchList: res })
          }),
          catchError((error) => of(KioskActions.loadBranchListFailure({ err: error })))
        )
      })
    )
  );

  loadAllProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.loadProductList),
      switchMap((action) => {
        return from(this.API.getAllProductAssetsInKiosk(action.skip, action.limit, action.searchedText)).pipe(
          map((res) => {
            return KioskActions.loadProductListSuccess({ allProducts: res })
          }),
          catchError((error) => of(KioskActions.loadProductListFailure({ err: error })))
        )
      })
    )
  );

  loadAllProductsCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.loadProductsCount),
      switchMap((action) => {
        return from(this.API.getAllProductAssetsCountInKiosk(action.searchedText)).pipe(
          map((res) => {
            return KioskActions.loadProductsCountSuccess({ allProductsCount: res })
          }),
          catchError((error) => of(KioskActions.loadProductsCountFailure({ err: error })))
        )
      })
    )
  );

  loadAllOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.loadOrderList),
      switchMap(() => {
        return from(this.API.getAllOrders()).pipe(
          map((res) => {
            return KioskActions.loadOrderListSuccess({ allOrders: res })
          }),
          catchError((error) => of(KioskActions.loadOrderListFailure({ err: error })))
        )
      })
    )
  );

  loadProductCountByStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.loadProductCountByStore),
      switchMap((action) => {
        if (action?.filters) {
          return from(this.API.getProductCountByStore(action.storeId, action.filters, action.isCategory, (action?.searchQuery ? action.searchQuery : ''))).pipe(
            map((res) => {
              return KioskActions.loadProductCountByStoreSuccess({ productCountByStore: res })
            }),
            catchError((error) => of(KioskActions.loadProductCountByStoreFailure({ err: error })))
          )
        } else {
          let search = action.searchQuery ? action.searchQuery : ''
          return from(this.API.getProductCountByStore(action.storeId, action.filters, action.isCategory, search)).pipe(
            map((res) => {
              return KioskActions.loadProductCountByStoreSuccess({ productCountByStore: res })
            }),
            catchError((error) => of(KioskActions.loadProductCountByStoreFailure({ err: error })))
          )
        }
      })
    )
  );

  loadUnlinkedProductCountByStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.loadUnlinkedProductCountByStore),
      switchMap((action) => {
        return from(this.API.getUnlinkedProductCountByStore(action.storeId, action.searchQuery)).pipe(
          map((res) => {
            return KioskActions.loadUnlinkedProductCountByStoreSuccess({ unlinkedProductCountByStore: res })
          }),
          catchError((error) => of(KioskActions.loadUnlinkedProductCountByStoreFailure({ err: error })))
        )
      })
    )
  );

  getMaestroAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getMaestroAreas),
      switchMap(() => {
        return from(this.API.getMaestroAreas()).pipe(
          map((res) => {
            return KioskActions.getMaestroAreasSuccess({ areas: res })
          })
        )
      })
    )
  );

  getMaestroInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getMaestroInfo),
      switchMap(() =>
        from(this.API.getMaestroInfo()).pipe(
          map((res: PosData) => {
            return KioskActions.getMaestroInfoSuccess({ maestroInfo: res })
          })
        )
      )
    )
  );

  loadProductListByStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.loadProductListByStore),
      switchMap((action) => {

        if (action?.filters) {
          let searchQuery = (action?.searchQuery ? action.searchQuery : '')
          return from(this.API.getProductListByStore(action.storeId, action.skip, action.limit, action.filters, action.isCategory, searchQuery, action.includeImage)).pipe(
            map((res) => {
              return KioskActions.loadProductListByStoreSuccess({ productListByStore: res })
            }),
            catchError((error) => of(KioskActions.loadProductListByStoreFailure({ err: error })))
          )
        } else {
          let searchQuery = (action?.searchQuery ? action.searchQuery : '')
          return from(this.API.getProductListByStore(action.storeId, action.skip, action.limit, '', action.isCategory, searchQuery, action.includeImage)).pipe(
            map((res) => {
              if (action?.clean) {
                return KioskActions.loadProductListByStoreSuccess({ productListByStore: res })
              } else {
                return KioskActions.updateProductList({ listToAdd: res })
              }
            }),
            catchError((error) => of(KioskActions.loadProductListByStoreFailure({ err: error })))
          )
        }
      })
    )
  );

  loadUnlinkedProductListByStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.loadUnlinkedProductListByStore),
      switchMap((action) => {
        return from(this.API.getUnlinkedProductListByStore1(action.storeId, action.skip, action.limit, action.searchQuery)).pipe(
          map((res) => {
            return KioskActions.loadUnlinkedProductListByStoreSuccess({ unlinkedProductListByStore: res })
          }),
          catchError((error) => of(KioskActions.loadUnlinkedProductListByStoreFailure({ error: error })))
        )
      })
    )
  );


  sendProductIdsTolinkToStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.sendProductIdsTolinkToStore),
      switchMap((action) => {
        return from(this.API.sendProductIdsTolinkToStore(action.storeId, action.productIds, action.isActivated)).pipe(
          map((res) => {
            return KioskActions.sendProductIdsTolinkToStoreSuccess({ responseMsg: res, responseType: 'success' })
          }),
          catchError((error) => of(KioskActions.sendProductIdsTolinkToStoreFailure({ error: error })))
        )
      })
    )
  )

  sendProductandGroupIds$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.sendProductandGroupIds),
    switchMap((action) => {
      return from(this.API.sendProductsAndGroups(action.assetLinkids, action.groupIds)).pipe(
        map((res) => {
          return KioskActions.sendProudGroupAddedSuccess({ responseMsg: res });
        }),
        catchError((error) => of(KioskActions.sendProductIdsTolinkToStoreFailure({ error: error })))
      );
    })
  )
  )

  addProductsAndGroupIds$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.addProductsAndGroupIds),
    switchMap((action) => {
      return from(this.API.addMultipleProductsToMultipleGroups(action.assetIds, action.groupIds)).pipe(
        map((res) => {
          return KioskActions.sendProudGroupAddedSuccess({ responseMsg: res });
        }),
        catchError((error) => of(KioskActions.sendProductIdsTolinkToStoreFailure({ error: error })))
      );
    })
  )
  )


  // enable or disbale products in kios customer facing store
  sendassetLinkMeta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.sendassetLinkMeta),
      switchMap(({
        assetLinkId,
        metaInfoStatus,
        metaInfoQty,
        metaInfoStorePrice,
        metaInfoIsActivated,
        storeId,
        skip,
        limit,
        filters,
        isCategory,
        searchQuery,
        includeImage,
        clean,
        updateMultiple,
        dynamicPriceData
      }) => {
        return from(this.API.sendassetLinkMeta(assetLinkId, metaInfoStatus, metaInfoQty, metaInfoStorePrice, metaInfoIsActivated, dynamicPriceData)).pipe(
          map((res) => {
            return KioskActions.assetLinkMetaSuccess({ response: res });
          }),
          catchError((error) => of(KioskActions.assetLinkMetaFailure({ error: error, assetLinkId: assetLinkId }))),
          tap((_) => {
            if (assetLinkId?.length > 1 || updateMultiple)
              this.store.dispatch(KioskActions.loadProductListByStore({
                storeId,
                skip,
                limit,
                filters,
                isCategory,
                includeImage,
                searchQuery,
                clean: clean
              }));
          })
        );
      })
    ));

  removeProduct$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.removeProduct),
    switchMap((action) => {
      return from(this.API.removeProductByAssetLinkId(action.assetLinkIds)).pipe(
        map((res) => {
          return KioskActions.productRemovedByLinkIdSuccess({ response: res, assetLinkId: action.assetLinkIds });
        }),
        catchError((error) => of(KioskActions.productRemovedByLinkIdFailure({ error: error })))
      );
    })
  )
  )


  removeGroup$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.removeGroup),
    switchMap((action) => {
      return from(this.API.removeGroupByLinkIds(action.groupId, action.assetLinkId)).pipe(
        map((res) => {
          return KioskActions.removeGroupSuccess({ response: res });
        }),
        catchError((error) => of(KioskActions.removeGroupFailure({ error: error })))
      );
    })
  )
  )

  getCategoryList$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.getCategoryList),
    switchMap((action) => {
      return from(this.API.getCategoriesList(action.skip, action.limit)).pipe(
        map((res) => {
          return KioskActions.getCategoryListSuccess({ response: res });
        }),
        catchError((error) => of(KioskActions.getCategoryListFailure({ error: error })))
      );
    })
  )
  )
  getGroupList$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.getGroupList),
    switchMap(() => {
      return from(this.assetGroupService.getAssetGroupByType('product')).pipe(
        map((res) => {
          return KioskActions.getGroupListSuccess({ response: res });
        }),
        catchError((error) => of(KioskActions.getGroupListFailure({ error: error })))
      );
    })
  )
  )

  getConfig$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.getConfig),
    switchMap(() => {
      return from(this.assetConfigService.getAssetsConfig()).pipe(
        map((res) => {
          return KioskActions.getConfigSuccess({ config: res });
        }),
        catchError((error) => of(KioskActions.getConfigFailure({ error: error })))
      );
    })
  )
  )


  getImageUrlForProducts$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.getImageUrlForProducts),
    switchMap((action) => {
      return from(this.assetService.getOnCardImageUrl(action.aId, action.fData)).pipe(
        map((res) => {
          return KioskActions.getImageUrlForProductSuccess({ response: res, index: action.index });
        }),
        catchError((error) => of(KioskActions.getImageUrlForProductFailure({ error: error })))
      );
    })
  )
  )

  getProductMetaInfoByLinkId$ = createEffect(() => this.actions$.pipe(
    ofType(KioskActions.getProductMetaInfoByLinkId),
    switchMap((action) => {
      return from(this.API.getAssetLinkMetaById(action.linkId)).pipe(
        map((res) => {
          return KioskActions.getProductMetaInfoByLinkIdSuccess({ response: res });
        }),
        catchError((error) => of(KioskActions.getProductMetaInfoByLinkIdFailure({ err: error })))
      );
    })
  )
  )

  getKioskSettingsByModule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getKioskSettingsByModule),
      withLatestFrom(this.store.select(getKioskSettings)),
      switchMap(([_, stateData]) => {
        if (stateData) {
          return of(KioskActions.getKioskSettingsSuccess({ response: stateData }))
        } else {
          return from(this.API.getKioskSettings().pipe(
            map((value) => KioskActions.getKioskSettingsSuccess({ response: value })),
            catchError((error) => of(KioskActions.getKioskSettingsFailure({ error: error })))
          ))
        }
      })
    )
  )

  getKioskSettingsByModuleForSocket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getKioskSettingsByModuleForSocket),
      switchMap((_) => {
        return from(this.API.getKioskSettings().pipe(
          map((value) => KioskActions.getKioskSettingsSuccess({ response: value })),
          catchError((error) => of(KioskActions.getKioskSettingsFailure({ error: error })))
        ))
      })
    )
  )


  putKioskTimesSlotToProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.putTimeAndDaySlots),
      switchMap((action) =>
        from(this.API.putAndLinkTimeAndDaySlotsToSelectedProducts(action.payload, action.locationId).pipe(
          tap(() => {
            //   this.messageService.add({ key: 'global-notification', severity: 'success', summary: 'Updated', detail: 'Successfully Updated ' + 'Day/s and Timeslots' });
          }),
          switchMap((_) => [KioskActions.putAndLinkTimeAndDaySlotsToSelectedProductsSuccess()]),
          catchError((error) => {
            // this.messageService.add({ key: 'global-notification', severity: 'error', summary: 'Error', detail: 'Failed to update ' + 'Category Sequence' })
            return of(KioskActions.putAndLinkTimeAndDaySlotsToSelectedProductsFailure({ error: error }))
          })
        ))
      )
    )
  )

  delinkKioskTimesSlotToProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.delinkDayAndTimeSlots),
      switchMap((action) =>
        from(this.API.delinkDayAndTimeSlots(action.payload, action.locationId).pipe(
          switchMap(() => {
            return [KioskActions.removeTimeSlotsToSelectedProductsSuccess()]
          }),
          // map((res) => KioskActions.sendProductIdsTolinkToStoreSuccess({responseMsg: res['message'] })),
          catchError((_) => {
            //this.messageService.add({ key: 'global-notification', severity: 'error', summary: 'Error', detail: 'Failed to remove Day/Timeslot' })
            return []
          })
        ))
      )
    )
  )


  getCategoriesByStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getCategoriesBySelectedStore),
      switchMap((action) =>
        from(this.API.getCategoriesByStore(action?.locationId).pipe(
          map((value: IKioskCategory[]) => KioskActions.getCategoriesByStoreSuccess({ response: value })),
          catchError(() => {
            // this.messageService.add({ key: 'global-notification', severity: 'error', summary: 'Error', detail: 'Error while getting categories by store' })

            return []
          })
        ))
      )
    )
  )
  putCategorySequence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.putCategoryOrderSequence),
      switchMap((action) =>
        from(
          this.API.putCategoryOrderSequence(action.locationId, action.assetType, action.payload)
        ).pipe(
          tap(() => {
            //    this.messageService.add({ key: 'global-notification', severity: 'success', summary: 'Updated', detail: 'Successfully Updated ' + 'Category Sequence' });

          }),
          // catchError(() => of(this.messageService.add({
          //   key: 'global-notification',
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: 'Failed to update ' + 'Category Sequence'
          // }))),
          switchMap(() => {
            return [KioskActions.getCategoriesBySelectedStore({ locationId: action.locationId }),
            ]
          }
          )
        )
      )
    )
  )

  updateCategoryByStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.updateCategoryByStore
      ),
      switchMap((action) =>
        from(
          this.API.updateCategoryStatus(action.locationId, action.payload)
        ).pipe(
          tap(() => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'success',
            //   summary: 'Updated',
            //   detail: 'Successfully Updated ' + 'Category Status'
            // });

          }),
          // catchError(() => of(this.messageService.add({
          //   key: 'global-notification',
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: 'Failed to update ' + 'Category Status'
          // }))),
          switchMap(() => {
            return []
          }
          )
        )
      )
    )
  )

  getCategoriesAndProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getCategories),
      switchMap(() => {
        return from(this.API.getCategoriesAndProducts().pipe(
          map((res: ICategoryData[]) => {
            const sequencedCategoriesData = sequencedCategories(res)
            const categoriesWithImage = setCategoryImage(sequencedCategoriesData)
            return KioskActions.getCategoriesSuccess({ availableCategories: categoriesWithImage })
          }),
          catchError((error) => of(KioskActions.getCategoriesFailure({ err: error })))
        ))
      })))
  getLayoutKioskOrderPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getLayoutKioskOrderPage),
      switchMap(() => {
        return from(this.API.getKioskOrderPageLayout()).pipe(
          map((res: any) => {
            console.log(res);
            return KioskActions.getLayoutKioskOrderPageSuccess({ response: res })
          }),
          catchError((error) => of(KioskActions.getCategoriesFailure({ err: error })))
        )
      })))
  addNewStoreForKioskUsingForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.addNewStoreForKioskUsingForm),
      switchMap((action) =>
        from(this.API.effectsAddNewStoreLocation(action.formData)).pipe(
          tap(() => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'success',
            //   summary: 'Updated',
            //   detail: 'Added store location successfully'
            // });
          }),
          switchMap(() => {
            return [
              KioskActions.loadBranchList(),
              // AssetsActions.loadAssetCountByType({ assetType: CONSTANT.ASSET_TYPES.LOCATION }),
              KioskActions.addStore({ isAddStoreSidebarOpen: false }),
            ];
          }),
          catchError(() => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'error',
            //   summary: 'Error',
            //   detail: 'Failed to add new store location ',
            // });
            return of();
          })
        )
      )
    )
  );

  quantityCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.quantityCheck),
      switchMap((action) => {
        console.log(5555)
        return from(this.API.quantityCheck(action.productArray, action.storeId)).pipe(
          map((res: IQuantityStatus) => {
            return KioskActions.quantityCheckSuccess({ quantityStatus: res })
          }),
          catchError((error) => of(KioskActions.quantityCheckFailure({ err: error })))
        )
      })
    )
  );

  getProductGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getProductGroups),
      switchMap(() => {
        return from(this.API.getProductGroups()).pipe(
          map((res: IGroupData[]) => {
            return KioskActions.getProductGroupsSuccess({ productGroups: res })
          }),
          catchError((error) => of(KioskActions.getProductGroupsFailure({ err: error })))
        )
      })
    )
  );
  getAllPaymentGateways$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getAllPaymentGatewayList),
      switchMap(() =>
        from(this.API.effectGetAllPaymentGateways().pipe(
          switchMap((value: GatewayList[]) => [KioskActions.getAllPaymentGatewayListSucces({ response: value })]),
          catchError(() => {
            return []
          })
        ))
      )
    )
  );

  sendPaymentVerification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.sendPaymentVerification),
      switchMap((action) => {
        return from(this.API.effectSendPaymentVerification(action.orderId)).pipe(
          tap(() => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'success',
            //   summary: 'Updated',
            //   detail: 'Successfully Verified Payment'
            // });
          }), switchMap((res) => {
            return [KioskActions.sendPaymentVerificationSucess({
              res: {
                orderNo: res?.['orderId'],
                orderId: res?.['orderDocId']
              }
            })]
          }),
        )
      })
    )
  );


  printReceiptOnSok$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.printReceiptOnSok),
      switchMap((action) => {
        return from(this.API.effectPrintRecieptOnSOk(action.orderId)).pipe(
          tap((_res) => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'success',
            //   summary: 'Updated',
            //   detail: res?.['message']
            // });
          }), switchMap(() => {
            return []
          }),
          catchError(() => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'error',
            //   summary: 'Error',
            //   detail: 'Failed to print receipt on sokc'
            // })
            return []
          })
        )
      })
    )
  );


  // sendTrasactionProofImage$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(KioskActions.sendTrasactionProofImage),
  //     switchMap((action) => {
  //       return from(this.API.effectSendTransaction(action.orderId)).pipe(
  //         tap((res) => {
  //           this.messageService.add({ key: 'global-notification', severity: 'success', summary: 'Updated', detail: res?.['message'] });
  //         }), switchMap(() => {
  //           return []
  //         }),
  //         catchError((error) => {
  //           this.messageService.add({ key: 'global-notification', severity: 'error', summary: 'Error', detail: 'Failed to print receipt on sokc' })
  //           return error
  //         })
  //       )
  //     })
  //   )
  // );
  sendTrasactionProofImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.sendTrasactionProofImage),
      switchMap((action) =>
        from(this.API.effectSendTransaction(action.payload, action.orderId)).pipe(
          tap(() => {
            // this.messageService.add({ key: 'global-notification', severity: 'success', summary: 'Updated', detail: res?.['msg'] ? res?.['msg'] : res?.['message'] });
          }),
          switchMap((res) => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'success',
            //   summary: 'Updated',
            //   detail: res?.['msg'] ? res?.['msg'] : res?.['message']
            // });
            return [KioskActions.sendPaymentVerificationSucess({
              res: {
                orderNo: res?.['orderId'],
                orderId: res?.['orderDocId']
              }
            }), KioskActions.sendTrasactionProofImageSuccess()]
          }), // Dispatch the success action
          catchError(() => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'error',
            //   summary: 'Error',
            //   detail: 'Failed to print receipt on socket'
            // });
            return EMPTY; // Optionally, dispatch an error action
          })
        )
      ),
      map(() => ({ type: 'NO_ACTION' }))
    )
  );

  // effectGetRazorpayData$ = createEffect(() =>
  //     this.actions$.pipe(
  //         ofType(KioskActions.getRazorpayData),
  //         withLatestFrom(this.store.select(getRazorPayConfigData), this.store.select(getAccountFromLoginResponse)),
  //         switchMap((observablesData) => {
  //             const razorpayData = observablesData?.[1];
  //             const account = observablesData?.[2];
  //             if (razorpayData) {
  //                 return of(
  //                     KioskActions.getRazorpayDataSuccess({ razorpay: razorpayData, account: account })
  //                 )
  //             } else {
  //                 return from(this.API.effectGetRazorpayData('razorpay').pipe(
  //                     map((value) => KioskActions.getRazorpayDataSuccess({ razorpay: value, account: account })),
  //                     catchError(() => [])
  //                 ))
  //             }
  //         })
  //     )
  // );


  effectGetKioskSettingsMetaData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getKioskSettingsMetadata),
      withLatestFrom(this.store.select(getAllKioskSettingsMetaData)),
      switchMap(([action, stateData]) => {
        if (stateData && stateData[action.groupType]) {
          return of(KioskActions.setKioskSettingsMetadata({
            kioskMetaData: stateData[action.groupType],
            groupType: action.groupType
          }));
        } else {
          return from(this.API.getKioskSettingsMetaData(action.groupType)).pipe(
            switchMap((res: IKisoskSettingsMetaData) => {
              const dynamicDropDownObservables = [];

              // Finding if Is Dynamic is true anywhere in Metadata response/
              res?.headers?.forEach((el) => {
                res[el]?.actions?.forEach((e, id) => {
                  if (e?.type === 'dropDown' && e?.isDynamic) {
                    dynamicDropDownObservables.push(
                      this.API.dynamicAPIfromMetaData(e.apiDetails.url, e.apiDetails.method).pipe(
                        catchError(() => []),
                        mergeMap(ress => {
                          // Setting the value according to api res
                          res[el].actions[id].dropDownValues = [...ress];
                          return [KioskActions.setKioskSettingsMetadata({
                            kioskMetaData: res,
                            groupType: action.groupType
                          })];
                        })
                      )
                    );
                  }
                  if (e?.data) {
                    let accordianData = e?.data
                    accordianData?.map((ele, idx) => {
                      if (ele?.subActions) {
                        let subaction = ele?.subActions
                        subaction?.map((val: any, i) => {
                          if (val.type === 'dropDown' && val?.isDynamic) {
                            dynamicDropDownObservables.push(
                              this.API.dynamicAPIfromMetaData(val.apiDetails.url, val.apiDetails.method).pipe(
                                catchError(() => []),
                                mergeMap(ress => {
                                  // Setting the value according to api res
                                  res[el].actions[id].data[idx].subActions[i].dropDownValues = [...ress]
                                  return [KioskActions.setKioskSettingsMetadata({
                                    kioskMetaData: res,
                                    groupType: action.groupType
                                  })];
                                })
                              )
                            );
                          }
                        })
                      }
                    })
                  }
                });
              });
              if (dynamicDropDownObservables.length === 0) {
                return [res]
              } else {
                return forkJoin(dynamicDropDownObservables).pipe(
                  map(() => {
                    return res
                  }),
                  catchError(() => []),
                );

              }
            }),
            switchMap((res: IKisoskSettingsMetaData) => {
              return [KioskActions.setKioskSettingsMetadata({ kioskMetaData: res, groupType: action.groupType })]
            }),
            catchError(() => of(KioskActions.showLoaderForGenericSettings({ val: false })))
          );
        }
      })
    )
  );

  effectGetGenericKioskSettingsByGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getAllGroupsForKioskSettings),
      switchMap(() =>
        from(this.API.getKioskSettingsMetaDataByGroups().pipe(
          map((value) =>
            KioskActions.getAllGroupsForKioskSettingsSuccess({ res: value?.settings })),
          catchError(() => [KioskActions.errorHandlerForGenericKioskSettings()])
        ))
      )
    )
  )


  effectPutGenericKioskSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.putGenericKioskSettings),
      switchMap((action) =>
        from(this.API.putKioskGenericSettings(action.payload, action.moduleType).pipe(
          tap(() => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'success',
            //   summary: 'Successfully Updated',
            //   detail: `Kiosk ${action.moduleType}  Settings`
            // });
          }, (error) => {
            console.log("Error Occured!", error)
            // this.messageService.add({key: 'global-notification', severity: 'error', summary: 'Something Went Wrong!'});
          }),
          map(() =>
            // console.log(value),
            KioskActions.putGenericKioskSettingsSuccess({ res: action.payload, moduleType: action.moduleType })),
          catchError(() => [KioskActions.errorHandlerForGenericKioskSettings()])
        ))
      )
    )
  )

  effectUpdateKioskStoreCategoryMetaInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.updateKioskStoreCategoryMetaInfo),
      switchMap((action) =>
        from(this.API.effectUpdateCategoryMetaInfo(action?.locationId, action?.payload).pipe(
          tap(() => {
            // this.messageService.add({
            //   key: 'global-notification',
            //   severity: 'success',
            //   summary: 'Successfully Updated',
            //   detail: `Kiosk Category Meta Info`
            // });
          }),
          switchMap(() => {
            return [KioskActions.getCategoriesBySelectedStore({ locationId: action.locationId })]
          }),
          catchError((error) => of(KioskActions.KioskMetaDataSettingsFailure({ err: error }))),
        )
        )))
  )

  getAllKagnets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getAllKagnets),
      switchMap(() => {
        return from(this.API.getKAgents()).pipe(
          map((res) => {
            return KioskActions.getAllKagnetsSuccess({ res: res })
          }),
          catchError(() => of(KioskActions.kAgentTabAPiFailure()))
        )
      })
    )
  );


  rebootKioskAgent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.kioskAgentReboot),
      switchMap((action) => {
        return from(this.API.rebootKioskAgent(action.machineId, action.rebootTo)).pipe(
          map(() => {
            return KioskActions.kioskAgentRebootSuccess()
          }),
          catchError(() => of(KioskActions.kAgentTabAPiFailure()))
        )
      })
    )
  );

  delinkKioskAgent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.delinkKioskAgent),
      switchMap((action) => {
        return from(this.API.delinkKioskAgent(action.kAgentId)).pipe(
          mergeMap(() => {
            return [KioskActions.linkKioskAgentProcessSuccess(), KioskActions.getAllKagnets()]
          }),
          catchError(() => of(KioskActions.kAgentTabAPiFailure()))
        )
      })
    )
  );

  getAvailableKiosk$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getAvailableKiosk),
      switchMap(() => {
        return from(this.API.getKioskList()).pipe(
          map((res) => {
            return KioskActions.getAvailableKioskSuccess({ kioksData: res })
          }),
          catchError(() => of(KioskActions.kAgentTabAPiFailure()))
        )
      })
    )
  );


  linkKiosk$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.linkKioskAgent),
      switchMap((action) => {
        return from(this.API.linkKiosk(action.kAgentId, action.kioskId)).pipe(
          mergeMap(() => {
            return [KioskActions.linkKioskAgentProcessSuccess(), KioskActions.getAllKagnets()]
          }),
          catchError(() => of(KioskActions.kAgentTabAPiFailure()))
        )
      })
    )
  );

  changeTheMachineName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.changeTheMachinename),
      switchMap((action) => {
        return from(this.API.changeMachineName(action.kAgentId, action.machineName)).pipe(
          mergeMap(() => {
            return [KioskActions.changeTheMachinenameSuccess(), KioskActions.getAllKagnets()]
          }),
          catchError(() => of(KioskActions.kAgentTabAPiFailure()))
        )
      })
    )
  )

  getKioskKAgentMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KioskActions.getKioskKAgentMetadata),
      switchMap((action) => {
        return from(this.API.getKAgentMetaData(action.module, action.typeId)).pipe(
          map((res: IKisoskSettingsMetaData[]) => {
            return KioskActions.setKioskKAgentMetadata({ kioskKAgentMetaData: res[0], typeId: action.typeId })
          }),
          catchError(() => of(KioskActions.kAgentTabAPiFailure()))
        )
      })
    )
  )

}
