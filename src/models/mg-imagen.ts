export class MgImagen{
  imageCategoryPath: string;
  imageProductPath: string;
  image:string;
  path:string;
  private URL_CATALOG:string = "http://magento.local/magento/pub/media/catalog/category";
  private URL_PRODUCT:string = "http://magento.local/magento/pub/media/catalog/product";
  constructor(image:any, path:any){
    this.image = "/"+ image;
    this.path = "/"+ path;
    this.imageCategoryPath = this.URL_CATALOG + this.image;
    this.imageProductPath = this.URL_PRODUCT +this.path+ this.image;
  }

}
