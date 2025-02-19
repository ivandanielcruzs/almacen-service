import { Purchase } from 'src/domain/purchase.domain';

export interface IPurchaseRepository {
  create(pruchase: Partial<Purchase>): Promise<void>;
}
