interface PaymentDetails {
    amount: number;
    currency: string;
    paymentMethod: string;
}

interface paymentMethod {
    name: string;
    card?: {
        number: string;
        exp_month: number;
        exp_year: number;
        cvc: string;
    };
    bank?: {
        account_number: string;
        bank_code: string;
    };
}