const NodeMailerService = require("../utils/NodeMail");
const { AnnouncementModel } = require("../models/Announcement.model");
const { UserModel } = require("../models/User.model");

class NotificationService {
    /**
     * Send transfer sent confirmation email
     */
    static async sendTransferSentEmail(senderName, senderEmail, amount, recipientName, recipientAccountNumber, transferType, transferId) {
        try {
            await NodeMailerService.sendEmail({
                to: senderEmail,
                subject: `Transfer Successful - ₹${amount.toLocaleString()} Sent`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2563eb; margin: 0;">CBI Bank</h1>
                                <h2 style="color: #059669; margin: 10px 0;">Transfer Successful ✓</h2>
                            </div>
                            
                            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h3 style="color: #1e40af; margin-top: 0;">Transaction Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Amount Transferred:</td>
                                        <td style="padding: 8px 0; text-align: right; color: #dc2626; font-size: 18px; font-weight: bold;">₹${amount.toLocaleString()}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">To:</td>
                                        <td style="padding: 8px 0; text-align: right;">${recipientName}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Account Number:</td>
                                        <td style="padding: 8px 0; text-align: right; font-family: monospace;">${recipientAccountNumber}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Transfer Type:</td>
                                        <td style="padding: 8px 0; text-align: right;">${transferType}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold;">Transaction ID:</td>
                                        <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${transferId}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #92400e;">
                                    <strong>📱 SMS Alert:</strong> You will receive an SMS confirmation shortly.
                                </p>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
                                If you did not initiate this transfer, please contact us immediately.<br>
                                This is an automated email from CBI Bank. Please do not reply.
                            </p>
                        </div>
                    </div>
                `
            });
        } catch (error) {
            console.error("Failed to send transfer sent email:", error);
        }
    }

    /**
     * Send transfer received notification email
     */
    static async sendTransferReceivedEmail(recipientName, recipientEmail, amount, senderName, senderAccountNumber, transferType, transferId) {
        try {
            await NodeMailerService.sendEmail({
                to: recipientEmail,
                subject: `Money Received - ₹${amount.toLocaleString()} Credited`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2563eb; margin: 0;">CBI Bank</h1>
                                <h2 style="color: #059669; margin: 10px 0;">Money Received! 💰</h2>
                            </div>
                            
                            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h3 style="color: #166534; margin-top: 0;">Credit Transaction Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Amount Received:</td>
                                        <td style="padding: 8px 0; text-align: right; color: #059669; font-size: 18px; font-weight: bold;">₹${amount.toLocaleString()}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">From:</td>
                                        <td style="padding: 8px 0; text-align: right;">${senderName}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Sender Account:</td>
                                        <td style="padding: 8px 0; text-align: right; font-family: monospace;">${senderAccountNumber}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Transfer Type:</td>
                                        <td style="padding: 8px 0; text-align: right;">${transferType}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold;">Transaction ID:</td>
                                        <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${transferId}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #1e40af;">
                                    <strong>💳 Balance Update:</strong> The amount has been credited to your account instantly.
                                </p>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
                                If you have any questions about this transaction, please contact us.<br>
                                This is an automated email from CBI Bank. Please do not reply.
                            </p>
                        </div>
                    </div>
                `
            });
        } catch (error) {
            console.error("Failed to send transfer received email:", error);
        }
    }

    /**
     * Send ATM card transaction email
     */
    static async sendATMTransactionEmail(userName, userEmail, amount, location, transactionType, atmId) {
        try {
            const isWithdrawal = transactionType.toLowerCase() === 'withdrawal';
            const subject = `ATM ${transactionType} Alert - ₹${amount.toLocaleString()}`;
            
            await NodeMailerService.sendEmail({
                to: userEmail,
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2563eb; margin: 0;">CBI Bank</h1>
                                <h2 style="color: ${isWithdrawal ? '#dc2626' : '#059669'}; margin: 10px 0;">ATM ${transactionType} Alert 🏧</h2>
                            </div>
                            
                            <div style="background-color: ${isWithdrawal ? '#fef2f2' : '#f0fdf4'}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h3 style="color: ${isWithdrawal ? '#991b1b' : '#166534'}; margin-top: 0;">Transaction Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
                                        <td style="padding: 8px 0; text-align: right; color: ${isWithdrawal ? '#dc2626' : '#059669'}; font-size: 18px; font-weight: bold;">₹${amount.toLocaleString()}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Transaction Type:</td>
                                        <td style="padding: 8px 0; text-align: right;">${transactionType}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                                        <td style="padding: 8px 0; text-align: right;">${location}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">ATM ID:</td>
                                        <td style="padding: 8px 0; text-align: right; font-family: monospace;">${atmId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold;">Date & Time:</td>
                                        <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #92400e;">
                                    <strong>🔒 Security Notice:</strong> If this transaction was not made by you, please contact us immediately.
                                </p>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
                                For your security, we notify you of all ATM transactions.<br>
                                This is an automated email from CBI Bank. Please do not reply.
                            </p>
                        </div>
                    </div>
                `
            });
        } catch (error) {
            console.error("Failed to send ATM transaction email:", error);
        }
    }

    /**
     * Send Fixed Deposit email notifications
     */
    static async sendFDEmail(userName, userEmail, amount, action, maturityDate = null, fdId) {
        try {
            const isOpening = action.toLowerCase() === 'opened';
            const isClaiming = action.toLowerCase() === 'claimed';
            
            let subject = `Fixed Deposit ${action} - ₹${amount.toLocaleString()}`;
            let actionColor = isOpening ? '#059669' : (isClaiming ? '#dc2626' : '#2563eb');
            let bgColor = isOpening ? '#f0fdf4' : (isClaiming ? '#fef2f2' : '#f0f9ff');
            let textColor = isOpening ? '#166534' : (isClaiming ? '#991b1b' : '#1e40af');
            
            await NodeMailerService.sendEmail({
                to: userEmail,
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2563eb; margin: 0;">CBI Bank</h1>
                                <h2 style="color: ${actionColor}; margin: 10px 0;">Fixed Deposit ${action} 🏦</h2>
                            </div>
                            
                            <div style="background-color: ${bgColor}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h3 style="color: ${textColor}; margin-top: 0;">FD Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
                                        <td style="padding: 8px 0; text-align: right; color: ${actionColor}; font-size: 18px; font-weight: bold;">₹${amount.toLocaleString()}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Action:</td>
                                        <td style="padding: 8px 0; text-align: right;">${action}</td>
                                    </tr>
                                    ${maturityDate ? `
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Maturity Date:</td>
                                        <td style="padding: 8px 0; text-align: right;">${maturityDate}</td>
                                    </tr>
                                    ` : ''}
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">FD ID:</td>
                                        <td style="padding: 8px 0; text-align: right; font-family: monospace;">${fdId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold;">Date & Time:</td>
                                        <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            ${isOpening ? `
                            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #1e40af;">
                                    <strong>📈 Congratulations:</strong> Your Fixed Deposit has been successfully opened. You will earn attractive interest on your investment.
                                </p>
                            </div>
                            ` : ''}
                            
                            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
                                Thank you for choosing CBI Bank for your investments.<br>
                                This is an automated email from CBI Bank. Please do not reply.
                            </p>
                        </div>
                    </div>
                `
            });
        } catch (error) {
            console.error("Failed to send FD email:", error);
        }
    }

    /**
     * Send account opening confirmation email
     */
    static async sendAccountOpeningEmail(userName, userEmail, accountNumber, accountType) {
        try {
            await NodeMailerService.sendEmail({
                to: userEmail,
                subject: "Welcome to CBI Bank - Account Opened Successfully!",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2563eb; margin: 0;">Welcome to CBI Bank! 🎉</h1>
                                <h2 style="color: #059669; margin: 10px 0;">Account Successfully Opened</h2>
                            </div>
                            
                            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h3 style="color: #166534; margin-top: 0;">Your Account Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Account Holder:</td>
                                        <td style="padding: 8px 0; text-align: right;">${userName}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Account Number:</td>
                                        <td style="padding: 8px 0; text-align: right; font-family: monospace; color: #059669; font-weight: bold;">${accountNumber}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">Account Type:</td>
                                        <td style="padding: 8px 0; text-align: right;">${accountType}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 8px 0; font-weight: bold;">IFSC Code:</td>
                                        <td style="padding: 8px 0; text-align: right; font-family: monospace;">CBIN001234</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold;">Opening Date:</td>
                                        <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleDateString()}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #92400e;">
                                    <strong>🔐 Next Steps:</strong> Please complete your KYC verification to unlock all banking features including transfers, cards, and loans.
                                </p>
                            </div>
                            
                            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #1e40af;">
                                    <strong>🎁 Special Offer:</strong> Enjoy zero balance requirement for the first 6 months!
                                </p>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
                                Thank you for choosing CBI Bank. We're excited to serve you!<br>
                                This is an automated email from CBI Bank. Please do not reply.
                            </p>
                        </div>
                    </div>
                `
            });
        } catch (error) {
            console.error("Failed to send account opening email:", error);
        }
    }

    /**
     * Send mobile recharge email notification
     */
    static async sendMobileRechargeEmail(userName, userEmail, amount, mobileNumber, operator, transactionId, accountNumber) {
        try {
            const operatorNames = {
                jio: 'Reliance Jio',
                airtel: 'Bharti Airtel',
                vi: 'Vi (Vodafone Idea)',
                bsnl: 'BSNL',
                mtnl: 'MTNL',
                reliance: 'Reliance Communications',
                tata: 'Tata Docomo',
                telenor: 'Telenor'
            };

            const operatorName = operatorNames[operator] || operator;
            
            await NodeMailerService.sendEmail({
                to: userEmail,
                subject: `Mobile Recharge Successful - ₹${amount.toLocaleString()} | SBI Bank`,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Recharge Successful - SBI Bank</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        <div style="max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                            <div style="background-color: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">
                                
                                <!-- SBI Bank Header -->
                                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 30px; text-align: center; position: relative;">
                                    <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; background-color: rgba(255,255,255,0.1); border-radius: 50%; transform: translate(50px, -50px);"></div>
                                    <div style="position: absolute; bottom: 0; left: 0; width: 100px; height: 100px; background-color: rgba(255,255,255,0.1); border-radius: 50%; transform: translate(-30px, 30px);"></div>
                                    
                                    <div style="position: relative; z-index: 10;">
                                        <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">State Bank of India</h1>
                                        <p style="margin: 0 0 20px 0; font-size: 16px; opacity: 0.9;">Digital Banking Excellence</p>
                                        
                                        <div style="background-color: rgba(255,255,255,0.2); padding: 20px; border-radius: 12px; display: inline-block; backdrop-filter: blur(10px);">
                                            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                                            <h2 style="margin: 0; font-size: 24px; font-weight: bold;">Recharge Successful!</h2>
                                            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Transaction completed successfully</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Transaction Summary -->
                                <div style="padding: 40px 30px;">
                                    <div style="text-align: center; margin-bottom: 40px;">
                                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px 40px; border-radius: 12px; display: inline-block; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                                            ₹${amount.toLocaleString()}
                                        </div>
                                        <p style="color: #059669; font-size: 18px; font-weight: 600; margin: 0;">Recharge Amount</p>
                                    </div>
                                    
                                    <!-- Transaction Details -->
                                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #bbf7d0; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
                                        <h3 style="color: #166534; margin: 0 0 25px 0; font-size: 20px; font-weight: bold; display: flex; align-items: center;">
                                            <span style="background-color: #059669; color: white; padding: 8px; border-radius: 8px; margin-right: 12px; font-size: 16px;">📋</span>
                                            Transaction Details
                                        </h3>
                                        
                                        <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
                                            <tr style="border-bottom: 2px solid #dcfce7;">
                                                <td style="padding: 15px 0; font-weight: 600; color: #374151;">📱 Mobile Number:</td>
                                                <td style="padding: 15px 0; text-align: right; font-family: 'Courier New', monospace; font-size: 18px; color: #059669; font-weight: bold;">${mobileNumber}</td>
                                            </tr>
                                            <tr style="border-bottom: 2px solid #dcfce7;">
                                                <td style="padding: 15px 0; font-weight: 600; color: #374151;">📡 Network Operator:</td>
                                                <td style="padding: 15px 0; text-align: right; font-weight: bold; color: #059669; font-size: 18px;">${operatorName}</td>
                                            </tr>
                                            <tr style="border-bottom: 2px solid #dcfce7;">
                                                <td style="padding: 15px 0; font-weight: 600; color: #374151;">🔢 Transaction ID:</td>
                                                <td style="padding: 15px 0; text-align: right; font-family: 'Courier New', monospace; color: #6b7280; font-size: 14px; background-color: #f3f4f6; padding: 8px; border-radius: 6px;">${transactionId}</td>
                                            </tr>
                                            <tr style="border-bottom: 2px solid #dcfce7;">
                                                <td style="padding: 15px 0; font-weight: 600; color: #374151;">🏦 Account Debited:</td>
                                                <td style="padding: 15px 0; text-align: right; font-family: 'Courier New', monospace; color: #6b7280;">SBI A/c XXXXXX${accountNumber}</td>
                                            </tr>
                                            <tr style="border-bottom: 2px solid #dcfce7;">
                                                <td style="padding: 15px 0; font-weight: 600; color: #374151;">🕒 Date & Time:</td>
                                                <td style="padding: 15px 0; text-align: right; color: #6b7280; font-weight: 600;">${new Date().toLocaleString('en-IN', { 
                                                    timeZone: 'Asia/Kolkata',
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 15px 0; font-weight: 600; color: #374151;">🏧 Payment Method:</td>
                                                <td style="padding: 15px 0; text-align: right; color: #6b7280;">SBI Debit Card ending ****${accountNumber}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    
                                    <!-- Success Confirmation -->
                                    <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #60a5fa; border-radius: 16px; padding: 25px; margin-bottom: 25px; text-align: center;">
                                        <div style="font-size: 32px; margin-bottom: 15px;">🎉</div>
                                        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Recharge Completed Successfully!</h3>
                                        <p style="margin: 0; color: #1e40af; font-size: 16px; line-height: 1.6;">
                                            Your mobile number <strong>${mobileNumber}</strong> has been recharged with 
                                            <strong>₹${amount.toLocaleString()}</strong> via <strong>${operatorName}</strong>.<br>
                                            You will receive SMS confirmation shortly.
                                        </p>
                                    </div>
                                    
                                    <!-- Important Notices -->
                                    <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 30px;">
                                        <!-- SMS Alert -->
                                        <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border: 2px solid #a855f7; border-radius: 12px; padding: 20px;">
                                            <p style="margin: 0; color: #7c3aed; font-weight: 600; display: flex; align-items: center;">
                                                <span style="font-size: 20px; margin-right: 10px;">📱</span>
                                                <strong>SMS Confirmation:</strong> You will receive confirmation SMS on ${mobileNumber} from ${operatorName} within 5 minutes.
                                            </p>
                                        </div>
                                        
                                        <!-- Security Notice -->
                                        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); border: 2px solid #f87171; border-radius: 12px; padding: 20px;">
                                            <p style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 600; display: flex; align-items: flex-start;">
                                                <span style="font-size: 18px; margin-right: 10px; margin-top: 2px;">🔒</span>
                                                <span><strong>Security Notice:</strong> If you did not initiate this transaction, please contact SBI Customer Care immediately at <strong>1800-11-2211</strong> or visit your nearest branch.</span>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <!-- CTA Buttons -->
                                    <div style="text-align: center; margin-bottom: 30px;">
                                        <div style="display: inline-block; margin: 0 10px;">
                                            <a href="#" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">View Transaction History</a>
                                        </div>
                                        <div style="display: inline-block; margin: 0 10px;">
                                            <a href="#" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Recharge Again</a>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Footer -->
                                <div style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #e5e7eb;">
                                    <div style="text-align: center;">
                                        <h4 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">State Bank of India</h4>
                                        <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0; line-height: 1.6;">
                                            Thank you for choosing <strong>SBI Digital Banking Services</strong><br>
                                            Your trusted banking partner since 1955
                                        </p>
                                        <div style="margin: 20px 0;">
                                            <p style="color: #6b7280; font-size: 14px; margin: 5px 0; font-weight: 600;">
                                                📞 Customer Care: <span style="color: #1e3a8a;">1800-11-2211</span> (24x7 Toll Free)
                                            </p>
                                            <p style="color: #6b7280; font-size: 14px; margin: 5px 0; font-weight: 600;">
                                                🌐 Website: <span style="color: #1e3a8a;">www.sbi.co.in</span>
                                            </p>
                                            <p style="color: #6b7280; font-size: 14px; margin: 5px 0; font-weight: 600;">
                                                📧 Email: <span style="color: #1e3a8a;">customer.care@sbi.co.in</span>
                                            </p>
                                        </div>
                                        <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0; line-height: 1.5;">
                                            This is an automated email from State Bank of India. Please do not reply to this email.<br>
                                            For security reasons, SBI will never ask for your passwords, PINs, or OTPs via email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });
        } catch (error) {
            console.error("Failed to send mobile recharge email:", error);
        }
    }

    /**
     * Send mobile recharge SMS notification
     */
    static async sendMobileRechargeSMS(userName, userPhone, amount, operator, transactionId, mobileNumber) {
        try {
            const operatorNames = {
                jio: 'JIO',
                airtel: 'AIRTEL',
                vi: 'VI',
                bsnl: 'BSNL',
                mtnl: 'MTNL',
                reliance: 'RELIANCE',
                tata: 'TATA',
                telenor: 'TELENOR'
            };

            const operatorName = operatorNames[operator] || operator.toUpperCase();
            const smsMessage = `Dear ${userName}, Your mobile recharge of Rs.${amount} for ${mobileNumber} via ${operatorName} is SUCCESSFUL. Txn ID: ${transactionId}. Thank you for using SBI Bank. -State Bank of India`;
            
            // Here you would integrate with SMS gateway (Twilio, MSG91, etc.)
            console.log(`SMS sent to ${mobileNumber}: ${smsMessage}`);
            
            // For simulation, we'll just log the message
            // In production, replace this with actual SMS API call
            /*
            await smsProvider.send({
                to: mobileNumber,
                message: smsMessage,
                sender: 'SBIBNK'
            });
            */
        } catch (error) {
            console.error("Failed to send mobile recharge SMS:", error);
        }
    }

    /**
     * Send bill payment email notification
     */
    static async sendBillPaymentEmail(userName, userEmail, amount, billType, consumerNumber, transactionId, accountNumber) {
        try {
            const billTypeNames = {
                electricity: 'Electricity Bill Payment',
                water: 'Water Bill Payment', 
                gas: 'Gas Bill Payment',
                credit_card: 'Credit Card Bill Payment',
                broadband: 'Broadband/Internet Bill Payment',
                dth: 'DTH/Cable TV Bill Payment'
            };

            const billTypeName = billTypeNames[billType] || 'Bill Payment';
            
            await NodeMailerService.sendEmail({
                to: userEmail,
                subject: `${billTypeName} Successful - ₹${amount.toLocaleString()} | CBI Bank`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                            <!-- Bank Header -->
                            <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
                                <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Central Bank of India</h1>
                                <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Digital Banking Services</p>
                            </div>
                            
                            <!-- Success Header -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="background-color: #059669; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                                    <h2 style="margin: 0; font-size: 22px;">💳 ${billTypeName} Successful</h2>
                                </div>
                            </div>
                            
                            <!-- Transaction Details -->
                            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                                <h3 style="color: #166534; margin-top: 0; margin-bottom: 20px; font-size: 18px;">📋 Payment Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr style="border-bottom: 1px solid #dcfce7;">
                                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">Bill Type:</td>
                                        <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #059669;">${billTypeName}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #dcfce7;">
                                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">Consumer Number:</td>
                                        <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 16px; color: #059669; font-weight: bold;">${consumerNumber}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #dcfce7;">
                                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">Payment Amount:</td>
                                        <td style="padding: 12px 0; text-align: right; font-size: 20px; font-weight: bold; color: #dc2626;">₹${amount.toLocaleString()}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #dcfce7;">
                                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">Transaction ID:</td>
                                        <td style="padding: 12px 0; text-align: right; font-family: monospace; color: #6b7280;">${transactionId}</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #dcfce7;">
                                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">Debited From A/c:</td>
                                        <td style="padding: 12px 0; text-align: right; font-family: monospace; color: #6b7280;">XXXXXX${accountNumber}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">Date & Time:</td>
                                        <td style="padding: 12px 0; text-align: right; color: #6b7280;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- ATM Card Info -->
                            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <p style="margin: 0; color: #92400e; font-weight: bold;">
                                    🏧 <strong>ATM Card Usage:</strong> This bill payment was processed using your CBI Bank ATM/Debit Card ending with ****${accountNumber}
                                </p>
                            </div>
                            
                            <!-- Success Message -->
                            <div style="background-color: #dbeafe; border: 1px solid #60a5fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <p style="margin: 0; color: #1e40af; text-align: center; font-weight: bold;">
                                    ✅ Your ${billTypeName.toLowerCase()} for consumer number ${consumerNumber} has been successfully completed
                                </p>
                            </div>
                            
                            <!-- Security Notice -->
                            <div style="background-color: #fef2f2; border: 1px solid #f87171; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <p style="margin: 0; color: #dc2626; font-size: 14px;">
                                    🔒 <strong>Security Notice:</strong> If you did not initiate this payment, please contact our customer care immediately at 1800-XXX-XXXX or visit your nearest branch.
                                </p>
                            </div>
                            
                            <!-- Footer -->
                            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                    Thank you for using CBI Bank Digital Services<br>
                                    <strong>Customer Care:</strong> 1800-XXX-XXXX | <strong>Website:</strong> www.cbibank.com
                                </p>
                                <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                                    This is an automated email from Central Bank of India. Please do not reply to this email.
                                </p>
                            </div>
                        </div>
                    </div>
                `
            });
        } catch (error) {
            console.error("Failed to send bill payment email:", error);
        }
    }

    /**
     * Send bill payment SMS notification
     */
    static async sendBillPaymentSMS(userName, userPhone, amount, billType, consumerNumber, transactionId) {
        try {
            const billTypeNames = {
                electricity: 'ELECTRICITY',
                water: 'WATER', 
                gas: 'GAS',
                credit_card: 'CREDIT CARD',
                broadband: 'BROADBAND',
                dth: 'DTH'
            };

            const billTypeName = billTypeNames[billType] || billType.toUpperCase();
            const smsMessage = `Dear ${userName}, Your ${billTypeName} payment of Rs.${amount} for A/c ${consumerNumber} is SUCCESSFUL. Txn ID: ${transactionId}. Thank you for using CBI Bank. -Central Bank of India`;
            
            console.log(`SMS sent to ${userPhone}: ${smsMessage}`);
            
            // In production, replace this with actual SMS API call
        } catch (error) {
            console.error("Failed to send bill payment SMS:", error);
        }
    }

    /**
     * Create announcement/notification for user
     */
    static async createAnnouncement(userId, type, title, message, priority = 'normal') {
        try {
            await AnnouncementModel.create({
                user: userId,
                type: type,
                title: title,
                message: message,
                priority: priority,
                isRead: false
            });
        } catch (error) {
            console.error("Failed to create announcement:", error);
        }
    }

    /**
     * Get user announcements
     */
    static async getUserAnnouncements(userId, limit = 20) {
        try {
            return await AnnouncementModel.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(limit);
        } catch (error) {
            console.error("Failed to get user announcements:", error);
            return [];
        }
    }

    /**
     * Mark announcement as read
     */
    static async markAnnouncementAsRead(announcementId, userId) {
        try {
            await AnnouncementModel.findOneAndUpdate(
                { _id: announcementId, user: userId },
                { isRead: true }
            );
        } catch (error) {
            console.error("Failed to mark announcement as read:", error);
        }
    }
}

module.exports = NotificationService;