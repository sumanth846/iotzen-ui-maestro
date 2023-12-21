import _ from "lodash";
import {Injectable} from "@angular/core";

Injectable({
  providedIn: "root"
})

export class TaxCalculationService {

  async taxProcessor(data: TaxData) {
    try {
      let items = []
      //ifIncludedInPrice
      if (data.taxIncluded) {
        let dataObj = {dineType: data?.dineType}
        return this.fetchTaxDataFromPrice(data?.data, dataObj);
      } else {
        let dataObj = {dineType: data?.dineType}
        // data = data?.data
        for (let obj of data?.data) {
          obj.totalPrice = (obj.price) * (obj.quantity)
          if (obj?.tax && obj?.tax?.length !== 0) {
            let unitPriceTaxResp = this.calculateTax(obj.price, obj.tax)
            obj.unitPriceAfterTax = unitPriceTaxResp?.itemPriceAfterTax
            obj.taxInfo = this.calculateTax(obj.totalPrice, obj.tax)
          }
          obj.unitPriceBeforeTax = obj.price;
          //TODO: process parcel charge if dineType is dineOut
          if (dataObj?.dineType === 'dineOut') {
            const parcelCharge = (obj.parcelCharge?.['value'] * obj.quantity);
            const parcelChargeTaxArr = obj?.parcelCharge?.['tax'];
            if (_.size(parcelChargeTaxArr) > 0) {
              let parcelChargeAfterTaxResp = this.calculateTax(parcelCharge);
              // parcelChargeAfterTaxResp = parcelChargeAfterTaxResp?.itemPriceAfterTax;
              obj.parcelChargeTotal = parcelChargeAfterTaxResp?.itemPriceAfterTax;
              obj.parcelCharge = parcelCharge
              // parcelChargeAfterTaxResp = parcelChargeAfterTaxResp?.itemPriceAfterTax;
              obj.parcelChargeTax = Number((parcelChargeAfterTaxResp?.itemPriceAfterTax - parcelCharge)?.toFixed(2));
            } else {
              obj.parcelCharge = parcelCharge;
              obj.parcelChargeTotal = parcelCharge;
              obj.parcelChargeTax = 0;
            }
          }
          let item = this.itemDTO(obj)
          items.push(item)
        }
        let totalTaxByName = this.processPrice(items, dataObj)
        let price = this.priceDTO(items, totalTaxByName);
        let {subTotal, totalTaxAmt} = this.getSubTotal(price);
        return {
          items,
          price: {
            ...price,
            subTotal,
            totalTaxAmt
          }
        }
      }
    } catch (e) {
      console.log(`err while processing tax ${JSON.stringify(e)}`)
      throw `Error While Calculating tax , ${e}`
    }

  }

  itemDTO = async (obj) => {
    return {
      name: obj.name,
      price: obj.price,
      unitPriceAfterTax: obj.unitPriceAfterTax,
      quantity: obj.quantity,
      tax: obj.taxInfo?.taxes,
      sku: obj.sku,
      // itemPriceAfterTax : obj.taxInfo?.itemPriceAfterTax,
      // itemPriceBeforeTax : obj.taxInfo?.itemPriceBeforeTax,

      unitPriceBeforeTax: obj.unitPriceBeforeTax,
      itemsPriceAfterTax: obj.taxInfo?.itemsPriceAfterTax,
      itemsPriceBeforeTax: obj.taxInfo?.itemsPriceBeforeTax,
      parcelCharge: obj?.parcelCharge,
      parcelChargeTotal: obj?.parcelChargeTotal,
      parcelChargeTax: obj?.parcelChargeTax,
      _id: obj?._id

    }
  }

  priceDTO = (data, info) => {
    let items = []
    for (let i of data) {
      let itemObj = {
        name: i.name,
        price: i.price,
        sku: i.sku,
        quantity: i.quantity,
        itemPriceAfterTax: i.itemPriceAfterTax,
        parcelCharge: i.parcelCharge,
        parcelChargeTotal: i.parcelChargeTotal,
        parcelChargeTax: i.parcelChargeTax,
        _id: i._id,
        itemsPriceAfterTax: i.itemsPriceAfterTax,
        itemsPriceBeforeTax: i.itemsPriceBeforeTax,
        unitPriceAfterTax: i.unitPriceAfterTax,
        unitPriceBeforeTax: i.unitPriceBeforeTax
      }

      items.push(itemObj)
    }
    return {
      items: items,
      tax: info.taxInfo,
      total: info.total,
      parcelCharge: info.parcelCharge
    }
  }


  fetchTaxAmountFromPrice(price, taxObj) {
    try {
      try {
        let taxIncludedPrice = price;
        // let totalPrice = 0
        // let itemPriceAfterTax = 0
        let taxes = []
        let combinedTax = 0
        for (let t of taxObj) {
          let per = 0
          if (t.percentage !== 0) {
            per = t.percentage
            //   let taxAmt = Number((price * (per / 100)).toFixed(2))
            let taxAmt = this.getTaxAmount(price, per);
            // price=price-taxAmt;
            combinedTax += Number(taxAmt.toFixed(2))
            let obj = {
              name: t.name,
              percentage: per,
              taxAmt: taxAmt
            }

            //check whether this key is needed or not
            //   itemPriceAfterTax = taxIncludedPrice
            taxes.push(obj)
          }
        }
        const itemsPriceBeforeTax = Number((taxIncludedPrice - combinedTax).toFixed(2));
        const itemsPriceAfterTax = taxIncludedPrice;

        return {taxes, itemsPriceBeforeTax, itemsPriceAfterTax}
      } catch (e) {
        console.log(`err while calculating tax ${JSON.stringify(e)}`)
      }
    } catch (error) {
      throw error;
    }
  }

  getTaxAmount(price, per) {
    try {
      return Number(price * (per / 100));
    } catch (e) {
      throw e;
    }
  }


  fetchTaxDataFromPrice(data, dataObj) {
    try {
      let items = [];
      for (let obj of data) {
        obj.totalPrice = (obj.price) * (obj.quantity);
        obj.unitPriceAfterTax = obj.price;
        if (obj?.tax && obj?.tax?.length !== 0) {
          const unitPriceTaxResp = this.fetchTaxAmountFromPrice(obj.price, obj.tax);
          obj.unitPriceBeforeTax = unitPriceTaxResp?.itemsPriceBeforeTax;
          obj.taxInfo = this.fetchTaxAmountFromPrice(obj.totalPrice, obj.tax);
        } else {
          obj.unitPriceBeforeTax = obj.price;
        }
        //TODO: handle parcel charge if dineType is dineOut for taxIncluded price
        if (dataObj?.dineType === 'dineOut') {
          const parcelChargeTax = obj?.parcelCharge?.tax;
          const parcelCharge = (obj.parcelCharge?.value) * (obj.quantity);
          if (_.size(parcelChargeTax) > 0) {
            let parcelChargeAfterTaxResp = this.calculateTax(parcelCharge, parcelChargeTax);
            // parcelChargeAfterTaxResp = parcelChargeAfterTaxResp?.itemPriceAfterTax;
            obj.parcelCharge = parcelCharge
            obj.parcelChargeTotal = parcelChargeAfterTaxResp?.itemPriceAfterTax;
            obj.parcelChargeTax = Number((parcelChargeAfterTaxResp?.itemPriceAfterTax - parcelCharge)?.toFixed(2));
          } else {
            obj.parcelCharge = parcelCharge;
            obj.parcelChargeTotal = parcelCharge;
            obj.parcelChargeTax = 0;
          }
        }
        let item = this.itemDTO(obj)
        items.push(item)
      }
      let totalTaxByName = this.processPrice(items, dataObj)
      let price = this.priceDTO(items, totalTaxByName)
      let {subTotal, totalTaxAmt} = this.getSubTotal(price);

      return {
        items,
        price: {
          ...price,
          subTotal,
          totalTaxAmt
        }
      }
    } catch (error) {
      throw error;
    }
  }

  getDineTypeOptions(dataObj) {
    try {
      let isDineOut
      if (dataObj?.dineType === 'dineOut') {
        isDineOut = true;
      }
      return {isDineOut}
    } catch (error) {
      throw error;
    }
  }

  calculateTax(price, tax?) {
    try {
      let itemPriceAfterTax = 0;
      let taxes = [];
      let combinedTax = 0;
      for (let t of tax) {
        let per = 0;
        if (t.percentage !== 0) {
          per = t.percentage;
          let taxAmt = Number((price * (per / 100)).toFixed(3))
          combinedTax += taxAmt
          let obj = {
            name: t.name,
            percentage: per,
            taxAmt: taxAmt
          }
          itemPriceAfterTax = price + combinedTax
          taxes.push(obj)
        }
      }

      return {taxes, itemPriceAfterTax}
    } catch (e) {
      console.log(`err while calculating tax ${JSON.stringify(e)}`)
    }
  }


  getSubTotal(price) {
    try {
      const taxArr = price?.tax;
      const parcelCharge = price?.parcelCharge;
      let totalTaxAmt = 0;
      let subTotal = 0;
      for (let taxObj of taxArr) {
        totalTaxAmt += taxObj?.amt;

      }
      totalTaxAmt = Number(totalTaxAmt.toFixed(2));
      subTotal = price?.total - totalTaxAmt;
      subTotal = subTotal - parcelCharge?.total;
      subTotal = Number(subTotal.toFixed(2));
      return {subTotal, totalTaxAmt}
    } catch (error) {
      throw error;
    }
  }


  processPrice(items, _dataObj) {
    try {
      let taxInfo = []
      let taxes = []
      let total = 0
      let totalParcelCharge = 0;
      let totalParcelChargeTax = 0;

      // const {isDineOut} = this.getDineTypeOptions(dataObj);

      for (let i of items) {
        let taxArr = i?.tax
        total += (i?.itemPriceAfterTax) ? (i.itemPriceAfterTax) : (i?.price * i?.quantity)
        if (taxArr && taxArr?.length !== 0) {
          for (let t of taxArr) {
            taxes.push(t)
          }
        }
        if (i?.parcelChargeTotal) {
          totalParcelCharge = totalParcelCharge + i?.parcelChargeTotal;
        }

        if (i?.parcelChargeTax) {
          totalParcelChargeTax = totalParcelChargeTax + i?.parcelChargeTax;
        }

      }
      if (taxes.length !== 0) {
        let grpByTaxName = _.groupBy(taxes, 'name')

        _.forOwn(grpByTaxName, async (value, key) => {
          let totalTax = 0
          let name = key
          let percentage = value[0].percentage
          for await (let v of value) {
            totalTax += v.taxAmt
          }
          let obj = {
            name: name,
            amt: Number(totalTax.toFixed(2)),
            value: percentage
          }
          taxInfo.push(obj)
        })
      }
      let parcelChargeObj = {
        charge: totalParcelCharge - totalParcelChargeTax,
        total: totalParcelCharge,
        tax: totalParcelChargeTax
      }

      //adding parcelCharge to total
      total = total + parcelChargeObj?.total;
      return {
        taxInfo,
        total,
        parcelCharge: parcelChargeObj
      }
    } catch (e) {
      console.log(`err while processing price ${JSON.stringify(e)}`)
    }
  }


  sample = {
    "_id": "6582d47c25f1b0156f9bb6c9",
    "tableId": "658016a44a124c312352e5dd",
    "storeId": "657c3d89a5746969972ccf75",
    "orderSource": "iotzen-pos",
    "dineType": "table",
    "posId": "657c8bd4566c3a701d1ddd41",
    "kId": 1,
    "orderType": "pickUp",
    "isQuantityDecremented": false,
    "payment": {
      "items": [
        {
          "name": "Mutton Biryani Half",
          "price": 189,
          "unitPriceAfterTax": 189,
          "quantity": 1,
          "tax": [
            {
              "name": "CGST",
              "percentage": 2.5,
              "taxAmt": 4.7250000000000005
            },
            {
              "name": "SGST",
              "percentage": 2.5,
              "taxAmt": 4.7250000000000005
            }
          ],
          "sku": "",
          "unitPriceBeforeTax": 179.54,
          "itemsPriceAfterTax": 189,
          "itemsPriceBeforeTax": 179.54,
          "parcelCharge": {},
          "parcelChargeTotal": "",
          "parcelChargeTax": "",
          "_id": "651c24af27110d0d288b7f25"
        }
      ],
      "price": {
        "items": [
          {
            "name": "Mutton Biryani Half",
            "price": 189,
            "sku": "",
            "quantity": 1,
            "itemPriceAfterTax": "",
            "parcelCharge": {},
            "parcelChargeTotal": "",
            "parcelChargeTax": "",
            "_id": "651c24af27110d0d288b7f25",
            "itemsPriceAfterTax": 189,
            "itemsPriceBeforeTax": 179.54,
            "unitPriceAfterTax": 189,
            "unitPriceBeforeTax": 179.54
          }
        ],
        "tax": [
          {
            "name": "CGST",
            "amt": 4.73,
            "value": 2.5
          },
          {
            "name": "SGST",
            "amt": 4.73,
            "value": 2.5
          }
        ],
        "total": 189,
        "parcelCharge": {
          "charge": 0,
          "total": 0,
          "tax": 0
        },
        "subTotal": 179.54,
        "totalTaxAmt": 9.46
      },
      "amountToBePaid": 0,
      "amountPaid": 189,
      "status": "paid",
      "isPaid": true,
      "Date": "2023-12-20T12:12:37.087Z",
      "amountToReturn": 0,
      "mode": "cash",
      "userId": "657ca614566c3a701d22b35d"
    },
    "pickup": {
      "created": "2023-12-20T11:48:12.710Z",
      "status": "placed",
      "statusDate": "2023-12-20T12:12:37.087Z",
      "placed": "2023-12-20T12:12:37.087Z"
    },
    "tableData": {
      "_id": "658016a44a124c312352e5dd",
      "tableNo": "14"
    },
    "pickUpLocation": "657c3d89a5746969972ccf75",
    "pickUpCity": "651d36055a3c5b71c64767f4",
    "accountId": "651c11bcfb15bdf4eba77ebf",
    "orderDetails": {
      "items": [
        {
          "category": "",
          "_id": "651c24af27110d0d288b7f25",
          "name": "Mutton Biryani Half",
          "sku": "",
          "price": 189,
          "quantity": 1,
          "assetsLinked": [
            "6533fc30c5c27857b87799e9",
            "6533fc3ec5c27857b877a1c1",
            "651d36f95a3c5b71c647cfbe",
            "651c24769738d70cb588b5e1",
            "657c3d89a5746969972ccf75"
          ],
          "isPriceIncludesTax": "",
          "instruction": "",
          "parcelCharge": {},
          "tax": [
            {
              "name": "CGST",
              "percentage": 2.5,
              "_id": "6533fc30c5c27857b87799e9"
            },
            {
              "name": "SGST",
              "percentage": 2.5,
              "_id": "6533fc3ec5c27857b877a1c1"
            }
          ],
          "totalPrice": 189,
          "unitPriceAfterTax": 189,
          "unitPriceBeforeTax": 179.54,
          "taxInfo": {
            "taxes": [
              {
                "name": "CGST",
                "percentage": 2.5,
                "taxAmt": 4.7250000000000005
              },
              {
                "name": "SGST",
                "percentage": 2.5,
                "taxAmt": 4.7250000000000005
              }
            ],
            "itemsPriceBeforeTax": 179.54,
            "itemsPriceAfterTax": 189
          }
        }
      ]
    },
    "orderStatus": "placed",
    "isAddedToQueue": false,
    "assetType": "order",
    "currentStatus": "created",
    "currentStatusDate": "2023-12-20T11:48:12.718Z",
    "updated": "2023-12-20T11:48:12.718Z",
    "created": "2023-12-20T11:48:12.718Z",
    "serialNo": 8466,
    "orderId": "8466",
    "zenId": 8466,
    "expirationTime": "2024-12-20T11:48:12.723Z",
    "__v": 0,
    "outOfStock": "",
    "paymentGateway": {
      "amount": 18900,
      "amount_due": 18900,
      "amount_paid": 0,
      "attempts": 0,
      "created_at": 1703074354,
      "currency": "INR",
      "entity": "order",
      "id": "order_NEayHYPjzXMSwC",
      "notes": [],
      "offer_id": "",
      "receipt": "d0UxYRbAQ",
      "status": "created"
    }
  }

}

type TaxData = {
  taxIncluded: boolean
  dineType: string
  data: Array<{
    [key: string]: unknown,
    _id: string
    name: string
    sku: any
    price: number
    quantity: number
    isPriceIncludesTax: any
    parcelCharge: unknown
    tax: Array<{
      name: string
      percentage: number
    }>
  }>
}
