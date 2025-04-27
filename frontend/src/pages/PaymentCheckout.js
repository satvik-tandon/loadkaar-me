import React, { useEffect, useState } from 'react';
import '../styles/PaymentCheckout.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import logo from '../assets/logo.jpeg';
import { clearDeliveryFormData, clearDeliveryPartnerView } from "../redux/deliveryPartnerViewSlice";

const PaymentCheckout = () => {

    const location = useLocation();
    const { userID } = useSelector((state) => state.user);
    const deliveryFormData = useSelector((state) => state.deliveryPartnerView.deliveryForm || {});
    const { selectedDriver } = location.state || {};
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({ FName: '', LName: '', UserContact: '', Email: '' });
    const [paymentResponse, setPaymentResponse] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState('');
    const [vehicleType, setVehicleType] = useState("");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);


    const paymentData = {
        user_id: userID,
        employee_name: `${selectedDriver?.firstname} ${selectedDriver?.lastname}` || '',
        employee_id: selectedDriver.user_id || '',
        amount: selectedDriver.estimated_price,
        payment_date: new Date().toISOString().split('T')[0],
    };

    // Fetch user details when userID changes
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.post("http://localhost:5001/api/get-username", { userID });

                // Set user details
                setUserDetails({
                    FName: response.data.FName,
                    LName: response.data.LName,
                    UserContact: response.data.UserContact,
                    Email: response.data.Email,
                });

                // Set vehicle type based on deliveryFormData
                if (deliveryFormData?.vehicleType) {
                    switch (deliveryFormData.vehicleType) {
                        case "2wheeler":
                            setVehicleType("Two Wheeler");
                            break;
                        case "3wheeler":
                            setVehicleType("Three Wheeler");
                            break;
                        case "4wheeler":
                            setVehicleType("Four Wheeler");
                            break;
                        case "truck":
                            setVehicleType("Truck");
                            break;
                        default:
                            setVehicleType("Unknown Vehicle");
                    }
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };

        if (userID) {
            fetchDetails();
        }
    }, [userID, deliveryFormData?.vehicleType]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const updateUserStatus = async (employee_id) => {
        try {
            const userStatus = {
                user_id: employee_id,
                status: "Inactive",
                fromVehicleStatus: "Active",
                toVehicleStatus: "In Use"
            };
            const response = await axios.post("http://localhost:5001/api/users/update-employee-status", userStatus);

            if (response.status === 200) {
                console.log("User status updated successfully:", response.data);
            } else {
                console.error("Failed to update user status:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    const handlePaymentSuccess = () => {
        try {
            if (paymentData && paymentResponse && transactionStatus && deliveryFormData) {

                updateUserStatus(paymentData.employee_id);

                axios.post("http://localhost:5001/api/save-payment-details", {
                    paymentResponse: paymentResponse,
                    paymentData: paymentData,
                    status: transactionStatus

                })
                    .then(response => {

                        axios.post("http://localhost:5001/api/save-tasks", {
                            paymentResponse: paymentResponse,
                            paymentData: paymentData
                        })
                            .then(response => {
                                const task_id = response.data.taskID;
                                axios.post("http://localhost:5001/api/save-task-details", {
                                    task_id: task_id,
                                    deliveryFormData: deliveryFormData
                                })
                                    .then(response => {
                                        console.log(response.data.message);
                                    })
                            })

                            const timeout = setTimeout(() => {
                                window.location.href = '/employer-home';
                                dispatch(clearDeliveryFormData());
                                dispatch(clearDeliveryPartnerView());
                            }, 1000);

                            return (() => clearTimeout(timeout));
                        
                    })
                    .catch(error => {
                        console.error("Error occurred while saving details:", error.response?.data || error.message);
                        alert("Error occurred while saving details. Please try again.");
                    });

            }



        } catch (error) {
            alert(error);
        }
    };

    const handlePayment = async () => {
        setIsLoading(true);
        if (!userDetails.FName || !userDetails.LName || !paymentData.employee_name || !paymentData.amount) {
            alert("Please fill in all required fields!");
            return;
        }

        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert("Failed to load Razorpay SDK. Please check your internet connection.");
            return;
        }

        const options = {
            key: "rzp_test_LpesfJag0kjwF6",
            amount: paymentData.amount * 100, // Amount in paisa
            currency: "INR",
            name: "LoadKaar",
            description: `Invoice: ${deliveryFormData.itemDescription}`,
            handler: (response) => {
                setPaymentResponse(response);
                setTransactionStatus('success');
            },
            prefill: {
                name: `${userDetails.FName} ${userDetails.LName}`,
                contact: deliveryFormData.contactPhoneNumber,
                email: userDetails.Email,
            },
            theme: {
                color: "#3399cc",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on('payment.failed', (response) => {
            setPaymentResponse(response.error);
            setTransactionStatus('failure');
        });
        setIsLoading(false);
    };

    useEffect(() => {
        if (transactionStatus === 'success') {
            handlePaymentSuccess();
        }
    }, [transactionStatus]);

    return (
        <div className="payment-checkout">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="LoadKaar Logo" className="logo" />
                </div>
                <h1 className="website-name">LoadKaar</h1>
            </header>

            <h2>Payment Checkout</h2>
            <form>
                <label>
                    Driver Name:
                    <input type="text" value={`${userDetails.FName} ${userDetails.LName}`} className="readonly" readOnly />
                </label>
                <label>
                    Vehicle Type:
                    <input type="text" value={vehicleType} className="readonly" readOnly />
                </label>
                <label>
                    Item Description:
                    <input type="text" value={deliveryFormData.itemDescription} className="readonly" readOnly />
                </label>
                <label>
                    Pickup Location:
                    <input type="text" value={deliveryFormData.pickupLocation} className="readonly" readOnly />
                </label>
                <label>
                    Drop Location:
                    <input type="text" value={deliveryFormData.dropLocation} className="readonly" readOnly />
                </label>
                <label>
                    Contact Person:
                    <input type="text" value={deliveryFormData.contactPerson} className="readonly" readOnly />
                </label>
                <label>
                    Contact Address:
                    <input type="text" value={deliveryFormData.contactAddress} className="readonly" readOnly />
                </label>
                <label>
                    Contact Phone Number:
                    <input type="text" value={deliveryFormData.contactPhoneNumber} className="readonly" readOnly />
                </label>
                <label>
                    Amount:
                    <input type="number" name="amount" value={paymentData.amount} className='readonly' />
                </label>
                <button type="button" onClick={handlePayment} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Pay Now"}
                </button>

            </form>

            {transactionStatus === 'failure' && (
                <div className="payment-response">
                    <h2>Payment Failed!</h2>
                    <p><strong>Error Code:</strong> {paymentResponse?.code}</p>
                    <p><strong>Description:</strong> {paymentResponse?.description}</p>
                    <p><strong>Source:</strong> {paymentResponse?.source}</p>
                    <p><strong>Step:</strong> {paymentResponse?.step}</p>
                    <p><strong>Reason:</strong> {paymentResponse?.reason}</p>
                    <button onClick={() => setTransactionStatus('')}>Back to Checkout</button>
                </div>
            )}
        </div>
    );
};

export default PaymentCheckout;
