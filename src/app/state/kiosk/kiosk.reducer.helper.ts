import { KAgent, ICategoryData, IProductData } from "src/app/interface/maestro-interface";
import moment from 'moment';


export const sequencedCategories = (allCategories: ICategoryData[]): ICategoryData[] => {
    const inStockSequenceCategoriesData: ICategoryData[] = allCategories
        ? allCategories.filter(
            (category: ICategoryData) =>
                !category.outOfStockStatus && category?.categoryInfo.sequence
        )
        : [];
    const outStockNoSequenceCategoriesData: ICategoryData[] = allCategories
        ? allCategories.filter(
            (category: ICategoryData) =>
                category.outOfStockStatus || !category?.categoryInfo.sequence
        )
        : [];
    return [
        ...inStockSequenceCategoriesData.sort(
            (categoryA: ICategoryData, categoryB: ICategoryData) => {
                return (
                    categoryA?.categoryInfo.sequence - categoryB?.categoryInfo.sequence
                );
            }
        ),
        ...outStockNoSequenceCategoriesData,
    ];
}

export const setCategoryImage = (allCategories: ICategoryData[]): ICategoryData[] => {
    const temp: ICategoryData[] = [];
    allCategories.forEach((obj: ICategoryData) => {
        const newObj: ICategoryData = { ...obj };
        newObj["imgURL"] =
            obj["categoryInfo"]["image"]["baseUrl"] +
            "tr:w-300:h-300/" +
            obj["categoryInfo"]["image"]["imageBasePath"];
        temp.push(newObj);
    });
    return temp;
}

export const setAvaialableProducts = (
    availableProducts: IProductData[],
    cartItems: IProductData[],
    itemQty: Map<string, { qty: number; idx: number }>
) => {
    const temp: IProductData[] = [];
    availableProducts?.forEach((obj: IProductData, idx: number) => {
        const newObj: IProductData = { ...obj };
        newObj["qty"] = 0;
        newObj["idx"] = idx;
        if (itemQty.get(newObj["productInfo"]["_id"])) {
            newObj["qty"] = itemQty.get(newObj["productInfo"]["_id"]).qty;
        } else {
            itemQty.set(newObj["productInfo"]["_id"], { qty: 0, idx: -1 });
        }
        temp.push(newObj);
    });
    availableProducts = temp;


    // moving outOfStockProducts to end
    let key = 0;
    for (let idx = 0; idx < availableProducts.length; idx++) {
        if (!availableProducts[idx]?.metaInfo?.outOfStockStatus) {
            let temp = availableProducts[idx];
            availableProducts[idx] = availableProducts[key];
            availableProducts[key] = temp;
            key++;
        }
    }
    if (!cartItems) cartItems = [];
    return {
        availableProducts,
        itemQty,
        cartItems
    }
};


export const setQuantity = (
    availableProducts: IProductData[],
    itemQty: Map<string, { qty: number; idx: number }>
) => {

    availableProducts.forEach((obj: IProductData, idx: number) => {
        const newObj: IProductData = { ...obj };
        newObj["qty"] = 0;
        newObj["idx"] = idx;
        if (itemQty.get(newObj["productInfo"]["_id"])) {
            newObj["qty"] = itemQty.get(newObj["productInfo"]["_id"]).qty;
        } else {
            itemQty.set(newObj["productInfo"]["_id"], { qty: 0, idx: -1 });
        }
    })
    return itemQty
};



export const incrementQtyViaProduct = (
    product: IProductData,
    cartItems: IProductData[],
    availableProducts: IProductData[],
    itemQty: Map<string, { qty: number; idx: number }>,
    cartLen: number
) => {
    availableProducts = availableProducts.map((item: IProductData) => {
        if (product["productInfo"]["_id"] === item["productInfo"]["_id"]) {
            return { ...item, qty: item["qty"] + 1 }
        }
        return item
    })
    product = { ...product, qty: product.qty + 1 };
    const mapObj = itemQty.get(product["productInfo"]["_id"]);
    if (mapObj.qty === 0) { cartLen++; }
    if (mapObj.idx > -1) {
        cartItems = cartItems.map((item: IProductData) => {
            if (item["productInfo"]["_id"] === product["productInfo"]["_id"]) {
                return { ...item, qty: item["qty"] + 1 }
            }
            return item
        })
        itemQty.set(product["productInfo"]["_id"], {
            ...mapObj,
            qty: product.qty,
        });
    } else {
        cartItems = [...cartItems, product]
        itemQty.set(product["productInfo"]["_id"], {
            qty: product.qty,
            idx: cartItems.length - 1,
        });
    }
    return {
        cartItems,
        availableProducts,
        itemQty,
        cartLen
    }
};





export const decrementQtyViaProduct = (
    product: IProductData,
    cartItems: IProductData[],
    availableProducts: IProductData[],
    itemQty: Map<string, { qty: number; idx: number }>,
    cartLen: number
) => {

    if (product["qty"] === 0) return;

    const mapObj = itemQty.get(product["productInfo"]["_id"]);

    if (product["qty"] > 1) {
        cartItems = cartItems.map((item: IProductData) => {
            if (item["productInfo"]["_id"] === product["productInfo"]["_id"]) {
                return { ...item, qty: item["qty"] - 1 }
            }
            return item
        })
        availableProducts = availableProducts.map((item: IProductData) => {
            if (item["productInfo"]["_id"] === product["productInfo"]["_id"]) {
                return { ...item, qty: item["qty"] - 1 }
            }
            return item
        })
        product = { ...product, qty: product.qty - 1 };
        itemQty.set(product["productInfo"]["_id"], {
            ...mapObj,
            qty: product.qty,
        });
    }
    else {
        --cartLen;
        cartItems = cartItems.filter(item => product["productInfo"]["_id"] !== item["productInfo"]["_id"])
        availableProducts = availableProducts.map((item: IProductData) => {
            if (product["productInfo"]["_id"] === item["productInfo"]["_id"]) {
                return { ...item, qty: 0 }
            }
            return item
        })
        itemQty.set(product["productInfo"]["_id"], {
            ...mapObj,
            qty: 0,
            idx: -1
        });
    }
    return {
        cartItems,
        availableProducts,
        itemQty,
        cartLen
    };
};

export const updateCartValue = (
    products: IProductData[],
    _,
    availableProducts: IProductData[],
    itemQty: Map<string, { qty: number; idx: number }>,
    cartLen: number
) => {

    const updatedCartItems = products.map((item: IProductData) => {
        const matchingProduct = availableProducts.find((p) => p?.productInfo?._id === item?.productInfo?._id);
        if (matchingProduct) {
            return { ...matchingProduct, qty: item.qty, metaInfo: { ...matchingProduct?.metaInfo, price: item?.metaInfo?.price } };
        }
        return item;
    });

    const updatedAvailableProducts = availableProducts.map((item: IProductData) => {
        const matchingProduct = products.find((p) => p.productInfo._id === item.productInfo._id);

        if (matchingProduct) {
            return { ...item, qty: matchingProduct.qty };
        }
        return item;
    });

    products.forEach((product: IProductData) => {
        // let idx = 0;
        if (product.qty >= 0) {
            const mapObj = itemQty.get(product.productInfo._id);
            itemQty.set(product.productInfo._id, {
                ...mapObj,
                qty: product.qty,
                idx: products.length - 1
            });

        } else {
            const mapObj = itemQty.get(product.productInfo._id);

            // --cartLen;
            // updatedCartItems.forEach((item: IProductData) => {
            //   if (product.productInfo._id === item.productInfo._id) {
            //     item.qty = 0;
            //   }
            // });

            // updatedAvailableProducts.forEach((item: IProductData) => {
            //   if (product.productInfo._id === item.productInfo._id) {
            //     item.qty = 0;
            //   }
            // });

            itemQty.set(product.productInfo._id, {
                ...mapObj,
                qty: 0,
                idx: -1,
            });
        }
    });
    cartLen = updatedCartItems?.length;
    return {
        cartItems: updatedCartItems,
        availableProducts: updatedAvailableProducts,
        itemQty,
        cartLen,
    };
};


export const extractProductDataFromCategory = (categoryData: ICategoryData[]) => {
    let availableProducts: IProductData[] = [];
    categoryData.forEach((category: ICategoryData) => {
        if (category["products"])
            availableProducts = [...availableProducts, ...category["products"]];
    });
    availableProducts = availableProducts.map((obj: IProductData) => {
        if (obj) {
            return {
                ...obj,
                imageURL: obj?.productInfo?.image
                    ? obj.productInfo.image.baseUrl +
                    "tr:w-300:h-300/" +
                    obj.productInfo.image.imageBasePath
                    : "",
                qty: 0
            };
        }
    });
    return availableProducts
}


export const removeCartItem = (
    _id: string,
    cartItems: IProductData[],
    availableProducts: IProductData[],
    itemQty: Map<string, { qty: number; idx: number }>,
    cartLen: number
) => {
    --cartLen;
    cartItems = cartItems.filter((item: IProductData) => item.productInfo._id !== _id)
    itemQty.set(_id, {
        qty: 0,
        idx: -1,
    });
    availableProducts = availableProducts.map((item: IProductData) => {
        if (_id === item["productInfo"]["_id"]) {
            return { ...item, qty: 0 }
        }
        return item
    })
    return {
        cartItems,
        availableProducts,
        itemQty,
        cartLen
    }
};

export const getKAgentWithOnlineStatus = (res: KAgent) => {
    const kAgentArray = []
    for (let idx = 0; idx < res?.length; idx++) {
        const agentData = { ...res?.[idx] };
        agentData['online'] = getTimeDifferenceDuration(agentData?.lastStatusUpdate);
        agentData['lastSeen'] = getLastSeen(agentData?.lastStatusUpdate);
        kAgentArray.push(agentData);
    }
    return kAgentArray;
}

export const getTimeDifferenceDuration = (lastStatusUpdate) => {
    if (lastStatusUpdate) {
        const currentTime = moment();
        const statusTime = moment(lastStatusUpdate);
        const durationMinutes = currentTime.diff(statusTime, 'minutes');
        if (durationMinutes < 10) {
            return true;
        }
        else {
            return false;
        }
    }
}

export const getLastSeen = (time) => {
    const formattedDateTime = moment(time).format('MMMM D, YYYY, h:mm A');
    return formattedDateTime;
}

export const updateKAgentStatusAfterSocketPush = (machineId, lastStatusUpdate, kAgents) => {
    const kAgentArray = []
    for (let idx = 0; idx < kAgents?.length; idx++) {
        const agentData = { ...kAgents?.[idx] };
        if (kAgents?.[idx]?.machineId === machineId) {
            agentData['online'] = getTimeDifferenceDuration(lastStatusUpdate);
            agentData['lastSeen'] = getLastSeen(lastStatusUpdate);

        }
        kAgentArray.push(agentData);
    }
    return kAgentArray;
}