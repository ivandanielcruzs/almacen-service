export interface IJobData {
  orderId: string;
  verifyStock: {
    id: string;
    quantity: number;
  }[];
}
