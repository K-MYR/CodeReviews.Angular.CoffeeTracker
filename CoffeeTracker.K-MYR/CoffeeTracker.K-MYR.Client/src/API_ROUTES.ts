export class API_ROUTES {
  public static BASE_PATH: string = 'https://localhost:56169/api/coffees'; 
  public static GET_RECORDS: string = `${this.BASE_PATH}`;
  public static GET_RECORD = (id: number): string => `${this.BASE_PATH}/${id}`;
  public static DELETE_RECORD = (id: number): string => `${this.BASE_PATH}/${id}`;
  public static PUT_RECORD = (id: number): string => `${this.BASE_PATH}/${id}`;
  public static POST_RECORD: string = `${this.BASE_PATH}`;
  public static GET_STATISTICS: string = `${this.BASE_PATH}/statistics`;
}
