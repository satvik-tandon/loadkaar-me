function validation(values) {
    let errors = {};
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phone_pattern = /^\d{10}$/;
    const pincode_pattern = /^\d{6}$/;

    if (!values.firstName) {
        errors.firstName = "First Name is required";
    }

    if (!values.lastName) {
        errors.lastName = "Last Name is required";
    }

    if (!values.houseNo) {
        errors.houseNo = "House Number is required";
    }

    if (!values.locality) {
        errors.locality = "Locality is required";
    }

    if (!values.city) {
        errors.city = "City is required";
    }

    if (!values.state) {
        errors.state = "State is required";
    }

    if (!values.pincode) {
        errors.pincode = "Pincode is required";
    } else if (!pincode_pattern.test(values.pincode)) {
        errors.pincode = "Invalid Pincode";
    }

    if (!values.phoneNumber) {
        errors.phoneNumber = "Phone Number is required";
    } else if (!phone_pattern.test(values.phoneNumber)) {
        errors.phoneNumber = "Invalid Phone Number";
    }

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!email_pattern.test(values.email)) {
        errors.email = "Invalid Email";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Invalid Password";
    }

    return errors;
}

export default validation;
