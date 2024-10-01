
export interface SaldoResponse {
    saldo: number;
    current_donation: number;
    donation_length: number;
    withdraw_amount: number;
    supporter_active: number;
}

export interface OrderDetailResponse {
    orderId: String
    tanggal: String;
    nama: String;
    unit: {
        length: String,
        image: String,
    },
    nominal: String;
    message: String;
}