const { AccountModel } = require("../models/Account.model");
const { TransactionModel } = require("../models/Transactions.model");
const { RechargeModel } = require("../models/Recharge.model");
const { UserModel } = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const NotificationService = require("./NotificationService");
const mongoose = require("mongoose");
const { generateAccountNumber } = require("../utils/accountNumberUtils");

// Check if models are available (for testing without MongoDB)
const isDatabaseAvailable = () => {
    try {
        return AccountModel && TransactionModel && RechargeModel && UserModel;
    } catch (error) {
        return false;
    }
};

class RechargeService {
    /**
     * Process mobile recharge
     */
    static async processMobileRecharge(rechargeData, userId) {
        const { mobileNumber, operator, amount, rechargeType, mode } = rechargeData;

        // Validate input
        if (!mobileNumber || !operator || !amount) {
            throw new ApiError(400, "Missing required fields");
        }

        // Validate mobile number format
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobileNumber)) {
            throw new ApiError(400, "Invalid mobile number format");
        }

        // Validate amount
        if (amount < 10) {
            throw new ApiError(400, "Minimum recharge amount is ₹10");
        }

        // Get user and account details
        const user = await UserModel.findById(userId).populate('account_no');
        if (!user || !user.account_no || user.account_no.length === 0) {
            throw new ApiError(404, "User account not found");
        }

        const account = user.account_no[0]; // Primary account

        // Check sufficient balance
        if (account.amount < amount) {
            throw new ApiError(400, "Insufficient balance for recharge");
        }

        // Real mode: Placeholder for real recharge API integration
        if (mode === 'real') {
            // TODO: Replace this block with your real recharge API call
            // Example:
            // const apiUrl = process.env.REAL_RECHARGE_API_URL;
            // const apiKey = process.env.REAL_RECHARGE_API_KEY;
            // const response = await axios.post(apiUrl, { mobileNumber, operator, amount, apiKey });
            // if (response.data.status === 'success') { ... } else { throw new ApiError(500, ...); }
            throw new ApiError(501, "Real recharge API integration not implemented yet. Add your API call here.");
        }

        // Start database transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create recharge record
            const recharge = new RechargeModel({
                user: userId,
                account: account._id,
                rechargeType: 'mobile',
                mobileNumber: mobileNumber,
                operator: operator,
                amount: amount,
                status: 'pending'
            });

            // Create debit transaction
            const transaction = new TransactionModel({
                account: account._id,
                user: userId,
                amount: amount,
                type: 'debit',
                isSuccess: false,
                remark: `Mobile Recharge - ${this.getOperatorName(operator)} - ${mobileNumber}`,
                rechargeId: recharge._id
            });

            // Save recharge and transaction
            await recharge.save({ session });
            await transaction.save({ session });

            // Simulate recharge processing (in real scenario, this would call operator API)
            console.log(`🔄 Processing recharge for ${mobileNumber} with ${this.getOperatorName(operator)}`);
            const rechargeSuccess = await this.simulateRechargeProcessing(operator, mobileNumber, amount);
            console.log(`📊 Recharge processing result: ${rechargeSuccess ? 'SUCCESS' : 'FAILED'}`);

            if (rechargeSuccess) {
                console.log(`💳 Deducting ₹${amount} from account for transaction: ${recharge.transactionId}`);
                
                // Update account balance
                const accountUpdateResult = await AccountModel.findByIdAndUpdate(
                    account._id,
                    { $inc: { amount: -amount } },
                    { session, new: true }
                );
                
                console.log(`✅ Amount deducted successfully. New balance: ₹${accountUpdateResult.amount}`);

                // Update recharge status
                recharge.status = 'success';
                recharge.processedAt = new Date();
                await recharge.save({ session });
                console.log(`✅ Recharge status updated to success: ${recharge.transactionId}`);

                // Update transaction status
                transaction.isSuccess = true;
                transaction.remark = `Mobile Recharge Successful - ${this.getOperatorName(operator)} - ${mobileNumber}`;
                await transaction.save({ session });
                console.log(`✅ Transaction status updated: ${recharge.transactionId}`);

                // Commit transaction
                await session.commitTransaction();
                console.log(`✅ Database transaction committed for recharge: ${recharge.transactionId}`);

                // Send notifications asynchronously
                setImmediate(async () => {
                    try {
                        console.log(`📧 Sending recharge notifications for transaction: ${recharge.transactionId}`);
                        const generatedAccountNumber = generateAccountNumber(user._id, account._id, account.ac_type);
                        
                        // Send email notification
                        console.log(`📧 Sending email to: ${user.email}`);
                        await NotificationService.sendMobileRechargeEmail(
                            user.name,
                            user.email,
                            amount,
                            mobileNumber,
                            operator,
                            recharge.transactionId,
                            generatedAccountNumber
                        );
                        console.log(`✅ Email sent successfully to: ${user.email}`);

                        // Send SMS notification
                        console.log(`📱 Sending SMS for recharge: ${recharge.transactionId}`);
                        await NotificationService.sendMobileRechargeSMS(
                            user.name,
                            mobileNumber,
                            amount,
                            operator,
                            recharge.transactionId,
                            mobileNumber // Send SMS to the recharged number
                        );
                        console.log(`✅ SMS sent successfully for transaction: ${recharge.transactionId}`);

                        // Create announcement
                        await NotificationService.createAnnouncement(
                            userId,
                            'mobile_recharge',
                            'Mobile Recharge Successful',
                            `₹${amount} recharge completed for ${mobileNumber} via ${this.getOperatorName(operator)}`
                        );
                        console.log(`✅ All notifications sent successfully for transaction: ${recharge.transactionId}`);
                        
                    } catch (notificationError) {
                        console.error("❌ Failed to send recharge notifications:", notificationError);
                        console.error("❌ Error details:", notificationError.stack);
                    }
                });

                return {
                    success: true,
                    message: "Mobile recharge completed successfully",
                    transactionId: recharge.transactionId,
                    details: {
                        mobileNumber: mobileNumber,
                        operator: this.getOperatorName(operator),
                        amount: amount,
                        newBalance: account.amount - amount
                    }
                };

            } else {
                // Recharge failed
                recharge.status = 'failed';
                recharge.failureReason = 'Operator service unavailable';
                await recharge.save({ session });

                transaction.remark = `Mobile Recharge Failed - ${this.getOperatorName(operator)} - ${mobileNumber}`;
                await transaction.save({ session });

                await session.commitTransaction();

                throw new ApiError(500, "Recharge failed due to operator service issue");
            }

        } catch (error) {
            await session.abortTransaction();
            throw new ApiError(500, "Recharge processing failed: " + error.message);
        } finally {
            session.endSession();
        }
    }

    /**
     * Process bill payment
     */
    static async processBillPayment(billData, userId) {
        const { billType, consumerNumber, amount, rechargeType } = billData;

        // Validate input
        if (!billType || !consumerNumber || !amount) {
            throw new ApiError(400, "Missing required fields");
        }

        // Validate amount
        if (amount < 10) {
            throw new ApiError(400, "Minimum bill payment amount is ₹10");
        }

        // Get user and account details
        const user = await UserModel.findById(userId).populate('account_no');
        if (!user || !user.account_no || user.account_no.length === 0) {
            throw new ApiError(404, "User account not found");
        }

        const account = user.account_no[0]; // Primary account

        // Check sufficient balance
        if (account.amount < amount) {
            throw new ApiError(400, "Insufficient balance for bill payment");
        }

        // Start database transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create recharge record for bill payment
            const billPayment = new RechargeModel({
                user: userId,
                account: account._id,
                rechargeType: 'bill',
                billType: billType,
                consumerNumber: consumerNumber,
                amount: amount,
                status: 'pending'
            });

            // Create debit transaction
            const transaction = new TransactionModel({
                account: account._id,
                user: userId,
                amount: amount,
                type: 'debit',
                isSuccess: false,
                remark: `Bill Payment - ${this.getBillTypeName(billType)} - ${consumerNumber}`,
                rechargeId: billPayment._id
            });

            // Save bill payment and transaction
            await billPayment.save({ session });
            await transaction.save({ session });

            // Simulate bill payment processing
            const paymentSuccess = await this.simulateBillPaymentProcessing(billType, consumerNumber, amount);

            if (paymentSuccess) {
                // Update account balance
                await AccountModel.findByIdAndUpdate(
                    account._id,
                    { $inc: { amount: -amount } },
                    { session }
                );

                // Update bill payment status
                billPayment.status = 'success';
                billPayment.processedAt = new Date();
                await billPayment.save({ session });

                // Update transaction status
                transaction.isSuccess = true;
                transaction.remark = `Bill Payment Successful - ${this.getBillTypeName(billType)} - ${consumerNumber}`;
                await transaction.save({ session });

                // Commit transaction
                await session.commitTransaction();

                // Send notifications asynchronously
                setImmediate(async () => {
                    try {
                        const generatedAccountNumber = generateAccountNumber(user._id, account._id, account.ac_type);
                        await NotificationService.sendBillPaymentEmail(
                            user.name,
                            user.email,
                            amount,
                            billType,
                            consumerNumber,
                            billPayment.transactionId,
                            generatedAccountNumber
                        );

                        await NotificationService.sendBillPaymentSMS(
                            user.name,
                            user.phone || '9999999999', // Use user's phone or default
                            amount,
                            billType,
                            consumerNumber,
                            billPayment.transactionId
                        );

                        await NotificationService.createAnnouncement(
                            userId,
                            'bill_payment',
                            'Bill Payment Successful',
                            `₹${amount} payment completed for ${this.getBillTypeName(billType)} - ${consumerNumber}`
                        );
                    } catch (notificationError) {
                        console.error("Failed to send bill payment notifications:", notificationError);
                    }
                });

                return {
                    success: true,
                    message: "Bill payment completed successfully",
                    transactionId: billPayment.transactionId,
                    details: {
                        billType: this.getBillTypeName(billType),
                        consumerNumber: consumerNumber,
                        amount: amount,
                        newBalance: account.amount - amount
                    }
                };

            } else {
                // Payment failed
                billPayment.status = 'failed';
                billPayment.failureReason = 'Service provider unavailable';
                await billPayment.save({ session });

                transaction.remark = `Bill Payment Failed - ${this.getBillTypeName(billType)} - ${consumerNumber}`;
                await transaction.save({ session });

                await session.commitTransaction();

                throw new ApiError(500, "Bill payment failed due to service provider issue");
            }

        } catch (error) {
            await session.abortTransaction();
            throw new ApiError(500, "Bill payment processing failed: " + error.message);
        } finally {
            session.endSession();
        }
    }

    /**
     * Get recharge history for user
     */
    static async getRechargeHistory(userId) {
        const history = await RechargeModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        return {
            success: true,
            history: history.map(item => ({
                transactionId: item.transactionId,
                type: item.rechargeType,
                amount: item.amount,
                status: item.status,
                description: item.description,
                date: item.createdAt,
                processedAt: item.processedAt,
                // Mobile specific
                mobileNumber: item.mobileNumber,
                operator: item.operator ? this.getOperatorName(item.operator) : null,
                // Bill specific
                billType: item.billType ? this.getBillTypeName(item.billType) : null,
                consumerNumber: item.consumerNumber
            }))
        };
    }

    /**
     * Get available operators
     */
    static async getOperators() {
        const operators = [
            { id: 'jio', name: 'Jio', logo: '🔵', color: '#0066cc' },
            { id: 'airtel', name: 'Airtel', logo: '🔴', color: '#dc2626' },
            { id: 'vi', name: 'Vi (Vodafone Idea)', logo: '🟣', color: '#7c3aed' },
           //add more if needed
        ];

        return {
            success: true,
            operators: operators
        };
    }

    /**
     * Simulate recharge processing (replace with actual operator API integration)
     */
    static async simulateRechargeProcessing(operator, mobileNumber, amount) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo/testing purposes, always return success
        // In production, this would integrate with actual operator APIs
        return true;
        
        // Original random simulation (disabled for testing):
        // return Math.random() > 0.05; // 95% success rate
    }

    /**
     * Simulate bill payment processing
     */
    static async simulateBillPaymentProcessing(billType, consumerNumber, amount) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo/testing purposes, always return success
        // In production, this would integrate with actual bill payment APIs
        return true;
        
        // Original random simulation (disabled for testing):
        // return Math.random() > 0.02; // 98% success rate
    }

    /**
     * Get operator display name
     */
    static getOperatorName(operatorId) {
        const operators = {
            jio: 'Jio',
            airtel: 'Airtel',
            vi: 'Vi (Vodafone Idea)',
            bsnl: 'BSNL',
            mtnl: 'MTNL',
            reliance: 'Reliance',
            tata: 'Tata Docomo',
            telenor: 'Telenor'
        };
        return operators[operatorId] || operatorId;
    }

    /**
     * Get bill type display name
     */
    static getBillTypeName(billTypeId) {
        const billTypes = {
            electricity: 'Electricity Bill',
            water: 'Water Bill',
            gas: 'Gas Bill',
            credit_card: 'Credit Card Payment',
            broadband: 'Broadband/Internet Bill',
            dth: 'DTH/Cable TV Bill'
        };
        return billTypes[billTypeId] || billTypeId;
    }

    /**
     * Process demo recharge (for testing - doesn't affect real balance)
     */
    static async processDemoRecharge(rechargeData, userId) {
        const { mobileNumber, operator, amount, rechargeType, billType, consumerNumber, billAmount } = rechargeData;

        // Validate input based on recharge type
        if (rechargeType === 'mobile') {
            if (!mobileNumber || !operator || !amount) {
                throw new ApiError(400, "Missing required fields for mobile recharge");
            }

            // Validate mobile number format
            const mobileRegex = /^[6-9]\d{9}$/;
            if (!mobileRegex.test(mobileNumber)) {
                throw new ApiError(400, "Invalid mobile number format");
            }

            // Validate amount
            if (amount < 10) {
                throw new ApiError(400, "Minimum recharge amount is ₹10");
            }
        } else if (rechargeType === 'bill') {
            if (!billType || !consumerNumber || !billAmount) {
                throw new ApiError(400, "Missing required fields for bill payment");
            }

            // Validate amount
            if (billAmount < 10) {
                throw new ApiError(400, "Minimum bill payment amount is ₹10");
            }
        } else {
            throw new ApiError(400, "Invalid recharge type");
        }

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate demo transaction ID
        const transactionId = 'DEMO' + Date.now() + Math.floor(Math.random() * 1000);

        // If database is not available, return demo response without saving
        if (!isDatabaseAvailable()) {
            return {
                success: true,
                message: `Demo ${rechargeType === 'mobile' ? 'recharge' : 'bill payment'} completed successfully`,
                transactionId: transactionId,
                isDemo: true,
                details: rechargeType === 'mobile' ? {
                    mobileNumber: mobileNumber,
                    operator: this.getOperatorName(operator),
                    amount: amount,
                    currentBalance: 50000 // Demo balance
                } : {
                    billType: this.getBillTypeName(billType),
                    consumerNumber: consumerNumber,
                    amount: billAmount,
                    currentBalance: 50000 // Demo balance
                }
            };
        }

        // Get user and account details
        const user = await UserModel.findById(userId).populate('account_no');
        if (!user || !user.account_no || user.account_no.length === 0) {
            throw new ApiError(404, "User account not found");
        }

        const account = user.account_no[0]; // Primary account

        // Create recharge record for demo
        const recharge = new RechargeModel({
            user: userId,
            account: account._id,
            rechargeType: rechargeType,
            mobileNumber: rechargeType === 'mobile' ? mobileNumber : null,
            operator: rechargeType === 'mobile' ? operator : null,
            billType: rechargeType === 'bill' ? billType : null,
            consumerNumber: rechargeType === 'bill' ? consumerNumber : null,
            amount: rechargeType === 'mobile' ? amount : billAmount,
            status: 'success',
            isDemo: true,
            processedAt: new Date()
        });

        // Create demo transaction (no actual balance deduction)
        const transaction = new TransactionModel({
            account: account._id,
            user: userId,
            amount: rechargeType === 'mobile' ? amount : billAmount,
            type: 'debit',
            isSuccess: true,
            isDemo: true,
            remark: rechargeType === 'mobile' 
                ? `Demo Mobile Recharge - ${this.getOperatorName(operator)} - ${mobileNumber}`
                : `Demo Bill Payment - ${this.getBillTypeName(billType)} - ${consumerNumber}`,
            rechargeId: recharge._id
        });

        // Save records
        await recharge.save();
        await transaction.save();

        // Send demo notifications asynchronously
        setImmediate(async () => {
            try {
                const generatedAccountNumber = generateAccountNumber(user._id, account._id, account.ac_type);
                
                if (rechargeType === 'mobile') {
                    await NotificationService.createAnnouncement(
                        userId,
                        'demo_mobile_recharge',
                        'Demo Mobile Recharge Successful',
                        `Demo: ₹${amount} recharge completed for ${mobileNumber} via ${this.getOperatorName(operator)}`
                    );
                } else {
                    await NotificationService.createAnnouncement(
                        userId,
                        'demo_bill_payment',
                        'Demo Bill Payment Successful',
                        `Demo: ₹${billAmount} payment completed for ${this.getBillTypeName(billType)} - ${consumerNumber}`
                    );
                }
            } catch (notificationError) {
                console.error("Failed to send demo notifications:", notificationError);
            }
        });

        return {
            success: true,
            message: `Demo ${rechargeType === 'mobile' ? 'recharge' : 'bill payment'} completed successfully`,
            transactionId: recharge.transactionId,
            isDemo: true,
            details: rechargeType === 'mobile' ? {
                mobileNumber: mobileNumber,
                operator: this.getOperatorName(operator),
                amount: amount,
                currentBalance: account.amount // No change in balance for demo
            } : {
                billType: this.getBillTypeName(billType),
                consumerNumber: consumerNumber,
                amount: billAmount,
                currentBalance: account.amount // No change in balance for demo
            }
        };
    }

    /**
     * Process real recharge (affects actual balance)
     */
    static async processRealRecharge(rechargeData, userId) {
        const { mobileNumber, operator, amount, rechargeType, billType, consumerNumber, billAmount } = rechargeData;

        // Validate input based on recharge type
        if (rechargeType === 'mobile') {
            if (!mobileNumber || !operator || !amount) {
                throw new ApiError(400, "Missing required fields for mobile recharge");
            }

            // Validate mobile number format
            const mobileRegex = /^[6-9]\d{9}$/;
            if (!mobileRegex.test(mobileNumber)) {
                throw new ApiError(400, "Invalid mobile number format");
            }

            // Validate amount
            if (amount < 10) {
                throw new ApiError(400, "Minimum recharge amount is ₹10");
            }
        } else if (rechargeType === 'bill') {
            if (!billType || !consumerNumber || !billAmount) {
                throw new ApiError(400, "Missing required fields for bill payment");
            }

            // Validate amount
            if (billAmount < 10) {
                throw new ApiError(400, "Minimum bill payment amount is ₹10");
            }
        } else {
            throw new ApiError(400, "Invalid recharge type");
        }

        // If database is not available, return error for real transactions
        if (!isDatabaseAvailable()) {
            throw new ApiError(503, "Database not available. Real transactions require database connection.");
        }

        // Get user and account details
        const user = await UserModel.findById(userId).populate('account_no');
        if (!user || !user.account_no || user.account_no.length === 0) {
            throw new ApiError(404, "User account not found");
        }

        const account = user.account_no[0]; // Primary account

        const actualAmount = rechargeType === 'mobile' ? amount : billAmount;

        // Check sufficient balance
        if (account.amount < actualAmount) {
            throw new ApiError(400, "Insufficient balance for transaction");
        }

        // Use existing methods for real processing
        if (rechargeType === 'mobile') {
            return await this.processMobileRecharge({
                mobileNumber,
                operator,
                amount,
                rechargeType
            }, userId);
        } else {
            return await this.processBillPayment({
                billType,
                consumerNumber,
                amount: billAmount,
                rechargeType
            }, userId);
        }
    }
}

module.exports = RechargeService;