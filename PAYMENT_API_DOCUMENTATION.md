# AgriSmart Payment API Documentation

## Overview
The AgriSmart platform now includes comprehensive payment processing capabilities using Razorpay integration with blockchain transaction recording for transparent agricultural marketplace transactions.

## Features Implemented

### 1. Payment Processing
- **Razorpay Integration**: Secure payment gateway for Indian market
- **Order Payment**: Create payment intents for marketplace orders
- **Payment Confirmation**: Verify and confirm payments with signature validation
- **Payment History**: Track all user payment transactions
- **Refund Processing**: Handle payment reversals with Razorpay refund API

### 2. Blockchain Transparency
- **Transaction Recording**: All payments recorded on blockchain for transparency
- **Immutable Ledger**: Cryptographic hashing ensures transaction integrity
- **Agricultural Traceability**: Track farmer-to-buyer payment flows

### 3. Payment Methods Management
- **Saved Payment Methods**: Store and manage user payment preferences
- **Multiple Payment Types**: Support for cards, UPI, net banking, wallets
- **Default Payment Method**: User can set preferred payment method

## API Endpoints

### Authentication Required
All payment endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Payment Intent Creation
```
POST /api/payments/create-intent
```
Create a payment intent for an order.

**Request Body:**
```json
{
  "orderId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "amount": 1500.00,
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "64f1a2b3c4d5e6f7g8h9i0j2",
    "razorpayOrderId": "order_KX0nVz...",
    "amount": 150000,
    "currency": "INR",
    "razorpayKeyId": "rzp_test_...",
    "blockchainTxHash": "a1b2c3d4...",
    "blockchainBlockNumber": 12345
  }
}
```

### Payment Confirmation
```
POST /api/payments/:paymentId/confirm
```
Confirm payment after Razorpay callback.

**Request Body:**
```json
{
  "razorpayPaymentId": "pay_KX0nVz...",
  "razorpayOrderId": "order_KX0nVz...",
  "razorpaySignature": "signature..."
}
```

### Payment History
```
GET /api/payments/history?page=1&limit=10&status=paid
```
Get user's payment history with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by payment status

### Process Refund
```
POST /api/payments/:paymentId/refund
```
Process refund for a payment.

**Request Body:**
```json
{
  "amount": 500.00,
  "reason": "requested_by_customer",
  "notes": "Customer requested refund"
}
```

### Payment Methods
```
GET /api/payments/methods
```
Get user's saved payment methods.

```
POST /api/payments/methods
```
Add a new payment method.

**Request Body:**
```json
{
  "type": "card",
  "provider": "visa",
  "last4": "4242",
  "expiryMonth": "12",
  "expiryYear": "2025",
  "name": "John Doe",
  "isDefault": true
}
```

```
DELETE /api/payments/methods/:methodId
```
Delete a payment method.

## Database Models

### Payment Model
```javascript
{
  order: ObjectId,           // Reference to Order
  user: ObjectId,            // Reference to User
  razorpayOrderId: String,   // Unique Razorpay order ID
  razorpayPaymentId: String, // Razorpay payment ID
  amount: Number,            // Payment amount
  currency: String,          // Currency (INR, USD, EUR)
  status: String,            // created, attempted, paid, failed, cancelled, refunded
  paymentMethod: String,     // card, netbanking, wallet, upi, emi
  razorpaySignature: String, // Payment signature for verification
  blockchainTxHash: String,  // Blockchain transaction hash
  blockchainBlockNumber: Number, // Blockchain block number
  metadata: Mixed            // Additional payment data
}
```

### Blockchain Transaction Model
```javascript
{
  payment: ObjectId,         // Reference to Payment
  transactionHash: String,   // Unique transaction hash
  blockNumber: Number,       // Simulated block number
  fromAddress: String,       // Sender address (buyer)
  toAddress: String,         // Receiver address (seller)
  amount: Number,            // Transaction amount
  currency: String,          // Transaction currency
  transactionType: String,   // payment, escrow, refund, commission
  status: String,            // pending, confirmed, failed
  metadata: Mixed            // Additional transaction data
}
```

### Refund Model
```javascript
{
  payment: ObjectId,         // Reference to Payment
  order: ObjectId,           // Reference to Order
  user: ObjectId,            // Reference to User
  razorpayRefundId: String,  // Unique Razorpay refund ID
  amount: Number,            // Refund amount
  currency: String,          // Refund currency
  reason: String,            // Refund reason
  status: String,            // pending, processed, failed
  blockchainTxHash: String,  // Blockchain refund hash
  notes: String,             // Refund notes
  processedAt: Date,         // When refund was processed
  metadata: Mixed            // Additional refund data
}
```

### Payment Method Model
```javascript
{
  user: ObjectId,            // Reference to User
  type: String,              // card, netbanking, wallet, upi
  provider: String,          // visa, mastercard, paytm, gpay, etc.
  razorpayMethodId: String,  // Razorpay method ID
  last4: String,             // Last 4 digits of card
  expiryMonth: String,       // Card expiry month
  expiryYear: String,        // Card expiry year
  name: String,              // Cardholder name
  isDefault: Boolean,        // Is this the default payment method
  isActive: Boolean,         // Is this method active
  metadata: Mixed            // Additional method data
}
```

## Security Features

1. **JWT Authentication**: All payment endpoints require valid JWT tokens
2. **Signature Verification**: Razorpay payment signatures are verified server-side
3. **Input Validation**: All inputs are validated using express-validator
4. **Role-based Access**: Payment operations respect user roles and permissions
5. **Blockchain Integrity**: Transactions are cryptographically hashed and recorded

## Testing

### Razorpay Test Credentials
- **Key ID**: `rzp_test_RXvtqZ9mxuwewf`
- **Key Secret**: `fh78cPul1NeNEslW0LX0owG8`

### Test Cards
- **Success Card**: 4111 1111 1111 1111
- **Failure Card**: 4000 0000 0000 0002

## Integration Flow

1. **Create Order**: User places order in marketplace
2. **Payment Intent**: Frontend calls `/payments/create-intent` with order details
3. **Razorpay Checkout**: Frontend loads Razorpay checkout with order details
4. **Payment Completion**: User completes payment on Razorpay
5. **Payment Confirmation**: Frontend calls `/payments/:paymentId/confirm` with payment details
6. **Order Update**: System updates order status to 'paid'
7. **Blockchain Recording**: Payment transaction recorded on blockchain
8. **Notifications**: Seller notified of payment receipt

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common error scenarios:
- Invalid order ID
- Payment already processed
- Insufficient permissions
- Razorpay API errors
- Blockchain recording failures

## Future Enhancements

1. **Multi-currency Support**: Extend beyond INR
2. **Subscription Payments**: Recurring payment support
3. **Payment Analytics**: Advanced payment insights dashboard
4. **Fraud Detection**: ML-based fraud prevention
5. **International Payments**: Global payment gateway integration