export declare class CreateMovementDto {
    productId: number;
    type: 'IN' | 'OUT' | 'ADJUST';
    quantity: number;
    reason?: string;
    userId?: number;
}
