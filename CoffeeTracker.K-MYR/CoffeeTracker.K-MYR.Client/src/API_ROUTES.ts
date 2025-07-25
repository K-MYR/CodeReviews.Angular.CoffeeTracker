export class API_ROUTES {
  public static BASE_PATH: string = 'https://localhost:56169/api';
  public static COFFEE_RECORDS: string = `${this.BASE_PATH}/coffees`;
  public static ACCOUNT: string = `${this.BASE_PATH}/account`;
  public static GET_RECORDS: string = `${this.COFFEE_RECORDS}`;
  public static GET_RECORD = (id: number): string => `${this.COFFEE_RECORDS}/${id}`;
  public static DELETE_RECORD = (id: number): string => `${this.COFFEE_RECORDS}/${id}`;
  public static PUT_RECORD = (id: number): string => `${this.COFFEE_RECORDS}/${id}`;
  public static POST_RECORD: string = `${this.COFFEE_RECORDS}`;
  public static GET_STATISTICS: string = `${this.COFFEE_RECORDS}/statistics`;
  public static GET_ACC_STATUS: string = `${this.ACCOUNT}/status`;
  public static POST_LOGIN: string = `${this.ACCOUNT}/login`;
  public static POST_REGISTER: string = `${this.ACCOUNT}/register`;
  public static CONFIRM_EMAIL = (userId: string, code: string): string => `${this.ACCOUNT}/confirmEmail?userId=${userId}&code=${code}`;
  public static RESEND_EMAIL: string = `${this.ACCOUNT}/resendConfirmationEmail`;
  public static ACCOUNT_INFO: string = `${this.ACCOUNT}/manage/info`;
}

