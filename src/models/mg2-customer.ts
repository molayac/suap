export class MgCustomer{
  private usr:string="tiendavirtual";
  private loginParams:any;
  private token:string=null;
  constructor(data){
    this.loginParams={username:this.usr, password:data}
  }
  getLoginParams(){
    return this.loginParams;
  }

  getLoginParamsUsr(usr){
    let loginParams = this.loginParams;
    loginParams.username=usr;
    return loginParams;
  }

  getLoginParamsData(data){
    let loginParams = this.loginParams;
    loginParams.username=data.email;
    loginParams.password=data.password;
    return loginParams;
  }
  setToken(token){
    this.token = token;
  }
  getToken(){
    return this.token;
  }
}
