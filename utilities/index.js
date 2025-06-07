// utilities/index.js

const getNav = async () => {
    return [
        { name: "Home", url: "/" },
        { name: "Custom", url: "/inventory/type/custom" },
        { name: "Sedan", url: "/inventory/type/sedan" },
        { name: "SUV", url: "/inventory/type/suv" },
        { name: "Truck", url: "/inventory/type/truck" },
    ];
};

// Function to create a grid for vehicles based on classification
const buildByClassificationGrid = (data) => {
    // Format the data as a grid
    // For now, we'll assume that 'data' is an array of objects, and we just return it as is
    return data.map(vehicle => {
        return {
            id: vehicle.inv_id,
            make: vehicle.inv_make,
            model: vehicle.inv_model,
            year: vehicle.inv_year,
            price: vehicle.inv_price,
            image: vehicle.inv_image, // Assuming images are URLs or relative paths
            miles: vehicle.inv_miles,
        };
    });
};

module.exports = {
    getNav,
    buildByClassificationGrid,  // Exporting the new function
};
