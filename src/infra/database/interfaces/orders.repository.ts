export interface IOrderRepository {
  updateOrder(id: string, update: object): Promise<boolean>;
}
