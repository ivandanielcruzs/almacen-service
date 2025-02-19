export class Purchase {
  constructor(
    public id: string | null,
    public ingredientId: string,
    public quantity: number,
    public orderedAt: Date,
  ) {}
}
