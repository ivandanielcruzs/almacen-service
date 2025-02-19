import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { IIngredientsRepository } from 'src/infra/database/interfaces/ingredients.repository';
import { IOrderRepository } from 'src/infra/database/interfaces/orders.repository';
import { IPurchaseRepository } from 'src/infra/database/interfaces/purchase.repository';
import { IJobData } from './interfaces/jobData.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IResponseStore } from './interfaces/responseStore.interface';
import { Purchase } from 'src/domain/purchase.domain';

@Processor('supply-request')
@Injectable()
export class AlmacenService extends WorkerHost {
  // Use build pattern to get better distribution of responsability
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IIngredientRepository')
    private readonly ingredientsRepository: IIngredientsRepository,
    @Inject('IPurchaseRepository')
    private readonly purchaseRepository: IPurchaseRepository,
    @InjectQueue('supply-confirmation')
    private readonly supplyConfirmationQueue: Queue,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    await this.handleSupplyRequest(job);
  }

  async handleSupplyRequest(job: Job) {
    const { orderId, verifyStock } = job.data as IJobData;
    console.info(
      `Revisando disposición de ingredientes para la orden ${orderId}`,
    );
    console.info(
      `📦 Procesando solicitud de compra para: ${verifyStock.map(({ id }) => id).join(', ')}`,
    );

    const ingredientsStock =
      await this.ingredientsRepository.getListIngredients(
        verifyStock.map(({ id }) => id),
      );

    for (const ingredient of ingredientsStock) {
      const element = verifyStock.find(({ id }) => id === ingredient.id); // improve to TreeSet or equivalent
      if (element && ingredient.stock < element.quantity) {
        await this.buyIngredients(
          ingredient.id,
          ingredient.name,
          element.quantity - ingredient.stock,
        );
      }
      await this.ingredientsRepository.updateStockIngredient(
        ingredient.id,
        -1 * (element?.quantity || 0),
      );
    }
    console.log(`✅ Ingredientes surtidos, notificando a la Cocina`);
    await this.orderRepository.updateOrder(orderId, { status: 'EN_PROCESO' });
    await this.supplyConfirmationQueue.add('supply-ready', {
      orderId,
    });
  }

  private async buyIngredients(
    id: string,
    name: string,
    requiredQuantity: number,
  ) {
    let totalPurchased = 0;
    let attempts = 1;
    const delayMs = 300; // Waited 300ms in order to avoid rate limit of the endpoint

    while (totalPurchased < requiredQuantity) {
      console.info(`Intento #${attempts} en obtener el ingrediente ${name}`);
      try {
        const response = await firstValueFrom(
          this.httpService.get(`${process.env.PURCHASE_STOCK as string}`, {
            params: { ingredient: name },
          }), // URL to Store
        );
        console.info('GET RESPONSE --->', response.data);
        const purchasedQuantity =
          (response.data as IResponseStore)?.quantitySold || 0;
        totalPurchased += purchasedQuantity;

        const purchase = new Purchase(null, id, purchasedQuantity, new Date());
        await this.purchaseRepository.create(purchase);

        await this.ingredientsRepository.updateStockIngredient(
          id,
          purchasedQuantity,
        );

        console.info(
          `⏳ Esperando ${delayMs / 1000} segundos antes de reintentar...`,
        );
        await this.delay(delayMs);
      } catch (error) {
        throw new Error(`Error consultando la tienda: ${error}`);
      }
      attempts++;
    }
    console.info(
      `Se ha completao la compras del ingrediente ${name} con un toal de ${totalPurchased} unidades compradas`,
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
