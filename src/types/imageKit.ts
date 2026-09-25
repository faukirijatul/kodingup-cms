export interface GetImageKitSignatureResponse {
  data: {
    expire: number;
    publicKey: string;
    signature: string;
    token: string;
  };
}
