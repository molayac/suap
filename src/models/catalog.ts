export class Catalog{
  id:number;
  parent_id:number;
  name:string;
  is_active:boolean;
  position:number;
  level:number;
  product_count:number;
  children_data:Catalog[];

  constructor (private fields:any){
    // Quick and dirty extend/assign fields to this model
    for (let f in fields) {
      this[f] = fields[f];
    }
  }
  
}

export class CatalogParser{
  catalogs:Catalog[];
  constructor(private data:Catalog[]){
    this.catalogs = data;
  }

  getGrandSonsBySon(son_id:number){
    return this.catalogs.filter(function( parent ) {
      return parent.children_data.filter(function( son ) {
        return son.children_data.filter(function( grandSon){
          return grandSon[son_id];
        });
      });
    });
  }





  query(params?:any){
    if (!params) {
      return this.catalogs;
    }
    return this.catalogs.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

}
