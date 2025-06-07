const getNav = async () => {
    
    return [
        { name: "Home", url: "/" },
        { name: "Custom", url: "/inventory/type/custom" },
        { name: "Sedan", url: "/inventory/type/sedan" },
        { name: "SUV", url: "/inventory/type/suv" },
        { name: "Truck", url: "/inventory/type/truck" },
    ];
};

module.exports = {
    getNav,
};