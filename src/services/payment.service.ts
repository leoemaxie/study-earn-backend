// import User from '@models/user.model';

// export interface PaymentDetails {
//     amount: number;
//     currency: string;
//     paymentMethod: string;
// }

// export interface paymentMethod {
//     name: string;
//     card?: {
//         number: string;
//         exp_month: number;
//         exp_year: number;
//         cvc: string;
//     };
//     bank?: {
//         account_number: string;
//         bank_code: string;
//     };
// }

// export async function addPaymentMethod(
//     user: User,
//     paymentMethod: paymentMethod
// ): Promise<void> {
//     const { name, card, bank } = paymentMethod;

//     if (!name) {

//     user.paymentMethod = JSON.parse(String(paymentMethod));
//     await user.save();
// }
