import { Pipe, PipeTransform } from "@angular/core";
import { IProductData } from "src/app/interface/maestro-interface";

@Pipe({
  name: "productSearch",
  standalone: true,
  pure: true,
})
export class ProductSearchPipe implements PipeTransform {
  transform(products: IProductData[], { searchedProduct, categoryIdStr }): IProductData[] {

    const extractedData: IProductData[] =
      categoryIdStr ? extractProductsByCategoryds(categoryIdStr, products) : products;

    return extractProductsBySearch(searchedProduct, extractedData)
  }
}



export const extractProductsByCategoryds = (categoryIds: string, productsData: IProductData[]): IProductData[] => {
  const categoryIdsArray: string[] = categoryIds?.split(",");

  if (categoryIds) {
    productsData = productsData?.filter((product: IProductData) => {
      if (product.metaInfo?.categoryIds) {
        return categoryIdsArray?.some((categoryId: string) => {
          return product.metaInfo.categoryIds.split(",").some((productCategoryId: string) => {
            return categoryId === productCategoryId;
          });
        });
      }
      return false;
    });
    return productsData
  }
  return productsData;
}

export const extractProductsBySearch = (searchStr: string | undefined, productsData: IProductData[]): IProductData[] => {
  return productsData?.filter((item: IProductData) => searchStr ?
    item["metaInfo"]["itemName"]?.toLowerCase().includes(searchStr?.toLowerCase())
    : productsData
  );
}