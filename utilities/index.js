
const getNav = async () => {
    return [
        { name: "Home", url: "/" },
        { name: "Custom", url: "/inventory/type/custom" },
        { name: "Sedan", url: "/inventory/type/sedan" },
        { name: "SUV", url: "/inventory/type/suv" },
        { name: "Truck", url: "/inventory/type/truck" },
    ];
};

const buildByClassificationGrid = (data) => {

    return data.map(vehicle => {
        return {
            id: vehicle.inv_id,
            make: vehicle.inv_make,
            model: vehicle.inv_model,
            year: vehicle.inv_year,
            price: vehicle.inv_price,
            image: vehicle.inv_image, 
            miles: vehicle.inv_miles,
        };
    });
};

module.exports = {
    getNav,
    buildByClassificationGrid,  
};
