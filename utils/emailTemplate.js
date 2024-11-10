export const emailTemplate = (orderData) => {
    const { customerDetails, orderDetails } = orderData;
    
    const productsHtml = orderDetails.products.map(product => `
      <tr>
        <td style="padding: 12px; border: 1px solid #dee2e6;">
          <img src="${product.imageUrl}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover;">
        </td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">
          ${product.name}
        </td>
        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: center;">
          ${product.quantity}
        </td>
        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: right;">
          ₹${product.price.toLocaleString()}
        </td>
        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: right;">
          ₹${(product.price * product.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .container { 
            max-width: 600px;
            margin: 0 auto;
          }
          .header { 
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid #dee2e6;
          }
          .content { 
            padding: 20px;
          }
          .address { 
            background: #f8f9fa;
            padding: 15px;
            margin: 20px 0;
            border: 1px solid #dee2e6;
          }
          .table { 
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .table th {
            background: #f8f9fa;
            padding: 12px;
            border: 1px solid #dee2e6;
            text-align: left;
          }
          .summary {
            margin: 20px 0;
            text-align: right;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin:0;">Order Confirmation</h2>
            <p>Order #${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          
          <div class="content">
            <p>Dear ${customerDetails.fullName},</p>
            <p>Thank you for your order. Please find your order details below:</p>
            
            <div class="address">
              <strong>Delivery Address:</strong><br>
              ${customerDetails.streetAddress}<br>
              ${customerDetails.landmark ? customerDetails.landmark + '<br>' : ''}
              ${customerDetails.city}, ${customerDetails.state}<br>
              Pincode: ${customerDetails.pincode}<br>
              Phone: ${customerDetails.phoneNumber}
            </div>
  
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
            </table>
  
            <div class="summary">
              <p>Delivery Fee: ₹${orderDetails.deliveryFee}</p>
              <p><strong>Total Amount: ₹${orderDetails.totalAmount.toLocaleString()}</strong></p>
            </div>
          </div>
  
          <div class="footer">
            <p>For any queries regarding your order, please contact our customer support.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};